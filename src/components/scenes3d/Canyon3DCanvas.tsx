import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Canyon3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x2a0d3b, 0.018);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 38);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Lighting (Sunset Golden Hour)
    const ambientLight = new THREE.AmbientLight(0x4a1f68, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffa254, 3.2);
    sunLight.position.set(15, 25, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x6366f1, 1.2);
    fillLight.position.set(-15, 12, 15);
    scene.add(fillLight);

    const riverPointLight = new THREE.PointLight(0x38bdf8, 2.5, 40);
    riverPointLight.position.set(0, 1, 10);
    scene.add(riverPointLight);

    // 4. Procedural Low-Poly Canyon Geometry (Left & Right Cliffs)
    const canyonGroup = new THREE.Group();
    scene.add(canyonGroup);

    // Left Canyon Wall
    const leftCliffGeo = new THREE.BoxGeometry(18, 32, 70, 14, 20, 30);
    const leftCliffPos = leftCliffGeo.attributes.position;
    for (let i = 0; i < leftCliffPos.count; i++) {
      const x = leftCliffPos.getX(i);
      const y = leftCliffPos.getY(i);
      const z = leftCliffPos.getZ(i);
      const noise = Math.sin(y * 0.4) * Math.cos(z * 0.2) * 2.2 + Math.sin(z * 0.6) * 1.2;
      if (x > 0) {
        leftCliffPos.setX(i, x + noise - (y > 0 ? (y * 0.2) : 0));
      }
      leftCliffPos.setY(i, y + Math.sin(x * 0.5) * 0.8);
    }
    leftCliffGeo.computeVertexNormals();
    const cliffMatWarm = new THREE.MeshStandardMaterial({
      color: 0x933358,
      roughness: 0.88,
      metalness: 0.05,
      flatShading: true,
    });
    const leftCliff = new THREE.Mesh(leftCliffGeo, cliffMatWarm);
    leftCliff.position.set(-17, 12, -5);
    leftCliff.receiveShadow = true;
    leftCliff.castShadow = true;
    canyonGroup.add(leftCliff);

    // Right Canyon Wall
    const rightCliffGeo = new THREE.BoxGeometry(18, 32, 70, 14, 20, 30);
    const rightCliffPos = rightCliffGeo.attributes.position;
    for (let i = 0; i < rightCliffPos.count; i++) {
      const x = rightCliffPos.getX(i);
      const y = rightCliffPos.getY(i);
      const z = rightCliffPos.getZ(i);
      const noise = Math.cos(y * 0.45) * Math.sin(z * 0.25) * 2.0 + Math.cos(z * 0.5) * 1.1;
      if (x < 0) {
        rightCliffPos.setX(i, x + noise + (y > 0 ? (y * 0.2) : 0));
      }
      rightCliffPos.setY(i, y + Math.cos(x * 0.5) * 0.8);
    }
    rightCliffGeo.computeVertexNormals();
    const cliffMatCool = new THREE.MeshStandardMaterial({
      color: 0x581c87,
      roughness: 0.85,
      metalness: 0.08,
      flatShading: true,
    });
    const rightCliff = new THREE.Mesh(rightCliffGeo, cliffMatCool);
    rightCliff.position.set(17, 12, -5);
    rightCliff.receiveShadow = true;
    rightCliff.castShadow = true;
    canyonGroup.add(rightCliff);

    // 5. Metropolis Monolith Towers
    const towerGroup = new THREE.Group();
    scene.add(towerGroup);

    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x1e1233,
      metalness: 0.65,
      roughness: 0.35,
      flatShading: true,
    });

    const windowGlowMatGold = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    const windowGlowMatCyan = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const createMonolith = (x: number, y: number, z: number, w: number, h: number, d: number) => {
      const tower = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), towerMat);
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      tower.add(shaft);

      const crown = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, h * 0.2, d * 0.7), towerMat);
      crown.position.y = h * 0.55;
      tower.add(crown);

      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.3, h * 0.25, 6), new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.9 }));
      spire.position.y = h * 0.7;
      tower.add(spire);

      const rows = Math.floor(h / 3);
      for (let r = 0; r < rows; r++) {
        const win = new THREE.Mesh(
          new THREE.PlaneGeometry(w * 0.8, 0.4),
          r % 2 === 0 ? windowGlowMatGold : windowGlowMatCyan
        );
        win.position.set(0, -h * 0.4 + r * 3, d * 0.51);
        tower.add(win);
      }

      tower.position.set(x, y, z);
      return tower;
    };

    towerGroup.add(createMonolith(-9.5, 14, -10, 4, 22, 5));
    towerGroup.add(createMonolith(-12.5, 16, 5, 5, 26, 6));
    towerGroup.add(createMonolith(-8.0, 9, 15, 3.5, 16, 4.5));

    towerGroup.add(createMonolith(9.5, 14, -10, 4, 22, 5));
    towerGroup.add(createMonolith(12.5, 17, 5, 5.5, 28, 6));
    towerGroup.add(createMonolith(8.0, 9, 15, 3.5, 16, 4.5));

    // Distant Monolith Portal
    const portalArc = new THREE.Mesh(
      new THREE.TorusGeometry(8, 0.8, 8, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xff9900, metalness: 0.8, roughness: 0.2 })
    );
    portalArc.position.set(0, 8, -25);
    portalArc.rotation.z = Math.PI;
    scene.add(portalArc);

    // 6. 3D Canyon River with Animated Water
    const riverGeo = new THREE.PlaneGeometry(12, 90, 32, 64);
    riverGeo.rotateX(-Math.PI / 2);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.15,
      flatShading: true,
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.position.set(0, -1.2, -10);
    scene.add(riverMesh);

    // 7. Dynamic Soaring Birds in 3D (Wings Flapping)
    const birdGroup = new THREE.Group();
    scene.add(birdGroup);

    const birdData: Array<{
      mesh: THREE.Group;
      leftWing: THREE.Mesh;
      rightWing: THREE.Mesh;
      speed: number;
      radius: number;
      angle: number;
      height: number;
      flapSpeed: number;
      flapOffset: number;
    }> = [];

    const birdMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const create3DBird = () => {
      const bGroup = new THREE.Group();
      const bodyGeo = new THREE.ConeGeometry(0.18, 1.2, 4);
      bodyGeo.rotateX(Math.PI / 2);
      const body = new THREE.Mesh(bodyGeo, birdMat);
      bGroup.add(body);

      const leftWingGeo = new THREE.BufferGeometry();
      const leftVerts = new Float32Array([
        0, 0, 0.2,
        -1.3, 0, -0.4,
        0, 0, -0.4
      ]);
      leftWingGeo.setAttribute('position', new THREE.BufferAttribute(leftVerts, 3));
      leftWingGeo.computeVertexNormals();
      const leftWing = new THREE.Mesh(leftWingGeo, birdMat);
      bGroup.add(leftWing);

      const rightWingGeo = new THREE.BufferGeometry();
      const rightVerts = new Float32Array([
        0, 0, 0.2,
        1.3, 0, -0.4,
        0, 0, -0.4
      ]);
      rightWingGeo.setAttribute('position', new THREE.BufferAttribute(rightVerts, 3));
      rightWingGeo.computeVertexNormals();
      const rightWing = new THREE.Mesh(rightWingGeo, birdMat);
      bGroup.add(rightWing);

      return { bGroup, leftWing, rightWing };
    };

    for (let i = 0; i < 14; i++) {
      const { bGroup, leftWing, rightWing } = create3DBird();
      const angle = (i / 14) * Math.PI * 2;
      const radius = 9 + Math.random() * 8;
      const height = 10 + Math.random() * 8;
      birdGroup.add(bGroup);

      birdData.push({
        mesh: bGroup,
        leftWing,
        rightWing,
        speed: 0.008 + Math.random() * 0.006,
        radius,
        angle,
        height,
        flapSpeed: 9 + Math.random() * 5,
        flapOffset: Math.random() * Math.PI * 2,
      });
    }

    // 8. Interactive Mouse Parallax
    let targetCamX = 0;
    let targetCamY = 8;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetCamX = nx * 5;
      targetCamY = 8 + ny * 3;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 9. Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth Camera Lerp
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 6, -15);

      // Animate River Waves
      const riverPos = riverGeo.attributes.position;
      for (let i = 0; i < riverPos.count; i++) {
        const u = riverPos.getX(i);
        const v = riverPos.getZ(i);
        const wave = Math.sin(v * 0.4 + elapsedTime * 2.5) * 0.18 + Math.cos(u * 0.8 + elapsedTime * 3.0) * 0.12;
        riverPos.setY(i, wave);
      }
      riverPos.needsUpdate = true;

      // Animate Birds Flocking & Flapping
      birdData.forEach((bird) => {
        bird.angle += bird.speed;
        const x = Math.sin(bird.angle) * bird.radius;
        const z = Math.cos(bird.angle) * (bird.radius * 1.5) - 5;
        const y = bird.height + Math.sin(bird.angle * 2) * 2.2;

        bird.mesh.position.set(x, y, z);
        const nextX = Math.sin(bird.angle + 0.05) * bird.radius;
        const nextZ = Math.cos(bird.angle + 0.05) * (bird.radius * 1.5) - 5;
        bird.mesh.lookAt(nextX, y, nextZ);

        const flap = Math.sin(elapsedTime * bird.flapSpeed + bird.flapOffset) * 0.55;
        bird.leftWing.rotation.z = flap;
        bird.rightWing.rotation.z = -flap;
      });

      sunLight.intensity = 3.0 + Math.sin(elapsedTime * 1.5) * 0.2;
      riverPointLight.intensity = 2.2 + Math.cos(elapsedTime * 2.0) * 0.4;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
