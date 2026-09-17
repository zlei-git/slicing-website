/**
 * SEGESTA — Living 3D WebGL Experience Engine
 * Implements 3D Flocking Birds (Boids), Articulated Wing Animation,
 * Kinetic Torus Rings, Depth Lighting, and Interactive Camera Trajectory.
 * 
 * Powered by local Three.js (r128). Zero external CDN dependencies.
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('Segesta3D: Three.js is not loaded.');
    return;
  }

  // --- Configuration ---
  const CONFIG = {
    flockSize: 42,
    worldBounds: { x: 300, y: 180, z: 240 },
    maxSpeed: 3.4,
    minSpeed: 1.8,
    maxForce: 0.08,
    separationDist: 26,
    neighborDist: 70,
    cameraStartPos: { x: 0, y: 8, z: 290 }
  };

  // --- Runtime Variables ---
  let canvas, scene, camera, renderer;
  let flock = [];
  let kineticRingsGroup, dustParticles;
  let mouse = new THREE.Vector2(0, 0);
  let mouseWorld = new THREE.Vector3(0, 0, 0);
  let isPointerActive = false;
  let currentScrollProgress = 0;
  let flockMode = 'cruise'; // 'cruise', 'summon', 'scatter'
  let modeTimer = 0;
  let clock = new THREE.Clock();

  // --- Materials ---
  const birdBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xf6f8fc,
    roughness: 0.3,
    metalness: 0.5,
    flatShading: true,
    emissive: 0x1d1544,
    emissiveIntensity: 0.4
  });

  const birdWingMaterial = new THREE.MeshStandardMaterial({
    color: 0xf6a04a,
    roughness: 0.2,
    metalness: 0.6,
    side: THREE.DoubleSide,
    flatShading: true,
    emissive: 0xd44d9b,
    emissiveIntensity: 0.35
  });

  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.38,
    roughness: 0.2,
    metalness: 0.8
  });

  function createBirdMesh() {
    const birdRoot = new THREE.Group();

    // 1. Fuselage / Body (Sleek elongated diamond prism)
    const bodyGeom = new THREE.ConeGeometry(2.2, 11, 4);
    bodyGeom.rotateX(Math.PI / 2);
    bodyGeom.scale(1, 0.45, 1);
    const bodyMesh = new THREE.Mesh(bodyGeom, birdBodyMaterial);
    birdRoot.add(bodyMesh);

    // 2. Beak Tip
    const beakGeom = new THREE.ConeGeometry(0.8, 3.2, 4);
    beakGeom.rotateX(Math.PI / 2);
    beakGeom.translate(0, 0, 6.6);
    const beakMesh = new THREE.Mesh(beakGeom, new THREE.MeshBasicMaterial({ color: 0xffe279 }));
    birdRoot.add(beakMesh);

    // 3. Left Wing Group (hinged at x = -1.2)
    const leftWingGroup = new THREE.Group();
    leftWingGroup.position.set(-1.2, 0.2, 0);

    const leftWingShape = new THREE.BufferGeometry();
    const lVertices = new Float32Array([
      0, 0, -2.5,
      -9.5, 0.5, 0,
      0, 0, 3.5,
      -9.5, 0.5, 0,
      -18.0, 0.2, 2.0,
      -3.0, 0.1, 3.0
    ]);
    leftWingShape.setAttribute('position', new THREE.BufferAttribute(lVertices, 3));
    leftWingShape.computeVertexNormals();
    const leftWingMesh = new THREE.Mesh(leftWingShape, birdWingMaterial);
    leftWingGroup.add(leftWingMesh);
    birdRoot.add(leftWingGroup);

    // 4. Right Wing Group (hinged at x = 1.2)
    const rightWingGroup = new THREE.Group();
    rightWingGroup.position.set(1.2, 0.2, 0);

    const rightWingShape = new THREE.BufferGeometry();
    const rVertices = new Float32Array([
      0, 0, -2.5,
      0, 0, 3.5,
      9.5, 0.5, 0,
      9.5, 0.5, 0,
      3.0, 0.1, 3.0,
      18.0, 0.2, 2.0
    ]);
    rightWingShape.setAttribute('position', new THREE.BufferAttribute(rVertices, 3));
    rightWingShape.computeVertexNormals();
    const rightWingMesh = new THREE.Mesh(rightWingShape, birdWingMaterial);
    rightWingGroup.add(rightWingMesh);
    birdRoot.add(rightWingGroup);

    // Tail Feathers
    const tailGeom = new THREE.BufferGeometry();
    const tailVerts = new Float32Array([
      0, 0.1, -4.5,
      -3.2, 0.2, -8.5,
      3.2, 0.2, -8.5
    ]);
    tailGeom.setAttribute('position', new THREE.BufferAttribute(tailVerts, 3));
    tailGeom.computeVertexNormals();
    const tailMesh = new THREE.Mesh(tailGeom, birdWingMaterial);
    birdRoot.add(tailMesh);

    return {
      root: birdRoot,
      leftWing: leftWingGroup,
      rightWing: rightWingGroup
    };
  }

  class Boid {
    constructor(x, y, z) {
      this.position = new THREE.Vector3(x, y, z);
      this.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed));
      this.acceleration = new THREE.Vector3(0, 0, 0);
      
      const meshData = createBirdMesh();
      this.mesh = meshData.root;
      this.leftWing = meshData.leftWing;
      this.rightWing = meshData.rightWing;
      
      this.mesh.position.copy(this.position);
      scene.add(this.mesh);

      this.wingSpeed = 8.5 + Math.random() * 4.5;
      this.wingPhase = Math.random() * Math.PI * 2;
      this.scale = 0.55 + Math.random() * 0.35;
      this.mesh.scale.set(this.scale, this.scale, this.scale);
    }

    applyForce(force) {
      this.acceleration.add(force);
    }

    flock(boids) {
      const sep = this.separate(boids).multiplyScalar(1.6);
      const ali = this.align(boids).multiplyScalar(1.0);
      const coh = this.cohere(boids).multiplyScalar(0.9);
      const bounds = this.containBounds().multiplyScalar(1.8);

      this.applyForce(sep);
      this.applyForce(ali);
      this.applyForce(coh);
      this.applyForce(bounds);

      if (flockMode === 'summon' || (isPointerActive && flockMode === 'cruise')) {
        const mouseSeek = this.seek(mouseWorld).multiplyScalar(flockMode === 'summon' ? 2.5 : 0.85);
        this.applyForce(mouseSeek);
      } else if (flockMode === 'scatter') {
        const flee = this.flee(mouseWorld, 150).multiplyScalar(3.0);
        this.applyForce(flee);
      }
    }

    update(delta) {
      this.velocity.add(this.acceleration);
      this.velocity.clampLength(CONFIG.minSpeed, CONFIG.maxSpeed);
      this.position.add(this.velocity);
      this.acceleration.set(0, 0, 0);

      this.mesh.position.copy(this.position);

      if (this.velocity.lengthSq() > 0.001) {
        const lookTarget = this.position.clone().add(this.velocity);
        this.mesh.lookAt(lookTarget);
        const currentBanking = -this.velocity.x * 0.18;
        this.mesh.rotateZ(currentBanking);
      }

      const flapAngle = Math.sin(clock.getElapsedTime() * this.wingSpeed + this.wingPhase) * 0.65;
      this.leftWing.rotation.z = flapAngle;
      this.rightWing.rotation.z = -flapAngle;
    }

    seek(target) {
      const desired = new THREE.Vector3().subVectors(target, this.position);
      desired.setLength(CONFIG.maxSpeed);
      const steer = new THREE.Vector3().subVectors(desired, this.velocity);
      steer.clampLength(0, CONFIG.maxForce);
      return steer;
    }

    flee(target, radius) {
      const dist = this.position.distanceTo(target);
      if (dist < radius && dist > 0.001) {
        const desired = new THREE.Vector3().subVectors(this.position, target);
        desired.setLength(CONFIG.maxSpeed * 1.5);
        const steer = new THREE.Vector3().subVectors(desired, this.velocity);
        steer.clampLength(0, CONFIG.maxForce * 2.0);
        return steer;
      }
      return new THREE.Vector3(0, 0, 0);
    }

    separate(boids) {
      const steer = new THREE.Vector3();
      let count = 0;
      for (let i = 0; i < boids.length; i++) {
        const other = boids[i];
        const d = this.position.distanceTo(other.position);
        if (d > 0 && d < CONFIG.separationDist) {
          const diff = new THREE.Vector3().subVectors(this.position, other.position);
          diff.normalize();
          diff.divideScalar(d);
          steer.add(diff);
          count++;
        }
      }
      if (count > 0) {
        steer.divideScalar(count);
        steer.setLength(CONFIG.maxSpeed);
        steer.sub(this.velocity);
        steer.clampLength(0, CONFIG.maxForce * 1.5);
      }
      return steer;
    }

    align(boids) {
      const sum = new THREE.Vector3();
      let count = 0;
      for (let i = 0; i < boids.length; i++) {
        const other = boids[i];
        const d = this.position.distanceTo(other.position);
        if (d > 0 && d < CONFIG.neighborDist) {
          sum.add(other.velocity);
          count++;
        }
      }
      if (count > 0) {
        sum.divideScalar(count);
        sum.setLength(CONFIG.maxSpeed);
        const steer = new THREE.Vector3().subVectors(sum, this.velocity);
        steer.clampLength(0, CONFIG.maxForce);
        return steer;
      }
      return sum;
    }

    cohere(boids) {
      const sum = new THREE.Vector3();
      let count = 0;
      for (let i = 0; i < boids.length; i++) {
        const other = boids[i];
        const d = this.position.distanceTo(other.position);
        if (d > 0 && d < CONFIG.neighborDist) {
          sum.add(other.position);
          count++;
        }
      }
      if (count > 0) {
        sum.divideScalar(count);
        return this.seek(sum);
      }
      return sum;
    }

    containBounds() {
      const steer = new THREE.Vector3();
      const b = CONFIG.worldBounds;
      const margin = 45;

      if (this.position.x < -b.x + margin) steer.x = CONFIG.maxForce;
      else if (this.position.x > b.x - margin) steer.x = -CONFIG.maxForce;

      if (this.position.y < -b.y + margin) steer.y = CONFIG.maxForce;
      else if (this.position.y > b.y - margin) steer.y = -CONFIG.maxForce;

      if (this.position.z < -b.z + margin) steer.z = CONFIG.maxForce;
      else if (this.position.z > b.z - margin) steer.z = -CONFIG.maxForce;

      return steer;
    }
  }

  function init() {
    canvas = document.getElementById('webgl-3d-canvas');
    if (!canvas) {
      console.warn('Segesta3D: Canvas #webgl-3d-canvas not found.');
      return;
    }

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080820, 0.0022);

    camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.set(CONFIG.cameraStartPos.x, CONFIG.cameraStartPos.y, CONFIG.cameraStartPos.z);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const ambientLight = new THREE.AmbientLight(0x282055, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf6a04a, 2.2);
    keyLight.position.set(180, 160, 120);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-160, -80, -100);
    scene.add(rimLight);

    const magentaAccent = new THREE.PointLight(0xd44d9b, 2.5, 350);
    magentaAccent.position.set(0, 40, 50);
    scene.add(magentaAccent);

    kineticRingsGroup = new THREE.Group();
    kineticRingsGroup.position.set(0, 20, -140);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(85, 1.2, 16, 80), ringMaterial);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(62, 1.0, 16, 60), new THREE.MeshStandardMaterial({
      color: 0xf6a04a,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    }));
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(40, 0.8, 16, 50), new THREE.MeshStandardMaterial({
      color: 0xd44d9b,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    }));

    ring2.rotation.x = Math.PI / 4;
    ring3.rotation.y = Math.PI / 3;

    kineticRingsGroup.add(ring1);
    kineticRingsGroup.add(ring2);
    kineticRingsGroup.add(ring3);
    scene.add(kineticRingsGroup);

    const particleCount = 280;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 600;
      particlePositions[i + 1] = (Math.random() - 0.5) * 400;
      particlePositions[i + 2] = (Math.random() - 0.5) * 500;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffe279,
      size: 2.2,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    dustParticles = new THREE.Points(particleGeom, particleMat);
    scene.add(dustParticles);

    for (let i = 0; i < CONFIG.flockSize; i++) {
      const boid = new Boid(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 120 + 20,
        (Math.random() - 0.5) * 160
      );
      flock.push(boid);
    }

    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    canvas.addEventListener('click', () => {
      window.Segesta3D.triggerSwoop();
    });

    animate();
  }

  function onWindowResize() {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(e) {
    isPointerActive = true;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseWorld.set(mouse.x * 150, mouse.y * 100, 40);
  }

  function onTouchStart(e) {
    if (e.touches.length > 0) {
      isPointerActive = true;
      mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      mouseWorld.set(mouse.x * 150, mouse.y * 100, 40);
    }
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      mouseWorld.set(mouse.x * 150, mouse.y * 100, 40);
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    if (flockMode !== 'cruise') {
      modeTimer += delta;
      if (modeTimer > 3.5) {
        flockMode = 'cruise';
        modeTimer = 0;
        updateModeUI('cruise');
      }
    }

    for (let i = 0; i < flock.length; i++) {
      flock[i].flock(flock);
      flock[i].update(delta);
    }

    if (kineticRingsGroup) {
      kineticRingsGroup.rotation.y = elapsedTime * 0.12;
      kineticRingsGroup.rotation.x = Math.sin(elapsedTime * 0.08) * 0.2;
      kineticRingsGroup.children[1].rotation.z = -elapsedTime * 0.16;
      kineticRingsGroup.children[2].rotation.x = elapsedTime * 0.22;
    }

    if (dustParticles) {
      dustParticles.rotation.y = elapsedTime * 0.02;
    }

    const targetCamX = CONFIG.cameraStartPos.x + (mouse.x * 35);
    const targetCamY = CONFIG.cameraStartPos.y + (mouse.y * 22) - (currentScrollProgress * 110);
    const targetCamZ = CONFIG.cameraStartPos.z - (currentScrollProgress * 90);

    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.position.z += (targetCamZ - camera.position.z) * 0.05;
    camera.lookAt(0, 5 - (currentScrollProgress * 40), 0);

    renderer.render(scene, camera);
  }

  function updateModeUI(mode) {
    const modeBadge = document.getElementById('hero-flock-mode');
    if (modeBadge) {
      if (mode === 'summon') {
        modeBadge.textContent = 'MODE // VORTEX SWOOP';
        modeBadge.style.color = '#f6a04a';
      } else if (mode === 'scatter') {
        modeBadge.textContent = 'MODE // HIGH-ALTITUDE DISPERSE';
        modeBadge.style.color = '#38bdf8';
      } else {
        modeBadge.textContent = 'MODE // AUTONOMOUS FLIGHT';
        modeBadge.style.color = 'var(--text-secondary)';
      }
    }
  }

  window.Segesta3D = {
    setScrollProgress(p) {
      currentScrollProgress = Math.max(0, Math.min(1, p));
    },

    setMode(mode) {
      flockMode = mode;
      modeTimer = 0;
      updateModeUI(mode);
    },

    triggerSwoop() {
      if (flockMode === 'cruise') {
        this.setMode('summon');
      } else if (flockMode === 'summon') {
        this.setMode('scatter');
      } else {
        this.setMode('cruise');
      }
    },

    getTelemetry() {
      if (flock.length === 0) return { altitude: 142, count: 42, speed: 28.4 };
      let sumY = 0;
      let sumSpeed = 0;
      for (let i = 0; i < flock.length; i++) {
        sumY += flock[i].position.y;
        sumSpeed += flock[i].velocity.length();
      }
      return {
        altitude: Math.round(sumY / flock.length + 150),
        count: flock.length,
        speed: (sumSpeed / flock.length * 28).toFixed(1)
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
