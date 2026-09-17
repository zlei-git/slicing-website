import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Foundry3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a0700, 0.02);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 28);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x2a1005, 1.4);
    scene.add(ambientLight);

    const moltenLight = new THREE.PointLight(0xff5500, 6.0, 35);
    moltenLight.position.set(0, -1, 3);
    scene.add(moltenLight);

    const crucibleGlow = new THREE.PointLight(0xffaa00, 4.5, 25);
    crucibleGlow.position.set(0, -2, 0);
    scene.add(crucibleGlow);

    const rimLightCool = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLightCool.position.set(-15, 20, -10);
    scene.add(rimLightCool);

    // 4. Industrial Foundry Architecture (Silos, Trusses, Platforms)
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x241d1a,
      metalness: 0.88,
      roughness: 0.35,
      flatShading: true,
    });

    const industrialFloor = new THREE.Mesh(new THREE.BoxGeometry(36, 1.5, 20), steelMat);
    industrialFloor.position.set(0, -4, 0);
    scene.add(industrialFloor);

    // Massive Smelting Silos (Left & Right)
    const createSilo = (x: number, z: number) => {
      const siloGroup = new THREE.Group();
      const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 22, 20), steelMat);
      siloGroup.add(cylinder);

      // Reinforcement Rings
      for (let y of [-6, -2, 2, 6]) {
        const rRing = new THREE.Mesh(
          new THREE.TorusGeometry(3.65, 0.18, 8, 24),
          new THREE.MeshStandardMaterial({ color: 0x451a03, metalness: 0.9 })
        );
        rRing.position.y = y;
        rRing.rotation.x = Math.PI / 2;
        siloGroup.add(rRing);
      }

      // Conical Bottom Chute
      const cone = new THREE.Mesh(new THREE.ConeGeometry(3.5, 4, 16), steelMat);
      cone.position.y = -13;
      cone.rotation.x = Math.PI;
      siloGroup.add(cone);

      siloGroup.position.set(x, 6, z);
      return siloGroup;
    };

    scene.add(createSilo(-12, -6));
    scene.add(createSilo(12, -6));

    // Ceiling Gantry Trusses
    for (let z of [-8, -2, 4]) {
      const truss = new THREE.Mesh(new THREE.BoxGeometry(32, 0.8, 0.8), steelMat);
      truss.position.set(0, 12, z);
      scene.add(truss);
    }

    // 5. Stepped Molten Metal Chutes & Vat Pool
    const moltenMat = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      emissive: 0xff7700,
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.3,
      flatShading: true,
    });

    // Central Crucible Vat
    const vatRim = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 4.2, 3.5, 24, 1, true),
      steelMat
    );
    vatRim.position.set(0, -2.5, 0);
    scene.add(vatRim);

    // Glowing Molten Pool
    const poolGeo = new THREE.CircleGeometry(4.8, 32);
    poolGeo.rotateX(-Math.PI / 2);
    const poolMesh = new THREE.Mesh(poolGeo, moltenMat);
    poolMesh.position.set(0, -1.8, 0);
    scene.add(poolMesh);

    // Molten Streams Cascading Down
    const streamGeoLeft = new THREE.BoxGeometry(0.8, 9, 0.4);
    const streamLeft = new THREE.Mesh(streamGeoLeft, moltenMat);
    streamLeft.position.set(-4, 0.8, -1.5);
    streamLeft.rotation.z = -0.3;
    scene.add(streamLeft);

    const streamGeoRight = new THREE.BoxGeometry(0.8, 9, 0.4);
    const streamRight = new THREE.Mesh(streamGeoRight, moltenMat);
    streamRight.position.set(4, 0.8, -1.5);
    streamRight.rotation.z = 0.3;
    scene.add(streamRight);

    // 6. Overhead Travelling Crane with Tilting Ladle
    const craneGroup = new THREE.Group();
    const craneBeam = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 1.2), steelMat);
    craneBeam.position.y = 10;
    craneGroup.add(craneBeam);

    // Hanging Ladle Bucket
    const ladleCable = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5, 6), steelMat);
    ladleCable.position.set(0, 7.5, 0);
    craneGroup.add(ladleCable);

    const ladleBucket = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.2, 2.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x1c1917, metalness: 0.9 })
    );
    ladleBucket.position.set(0, 5, 0);
    craneGroup.add(ladleBucket);

    const ladleMoltenEdge = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1.4, 16),
      moltenMat
    );
    ladleMoltenEdge.position.set(0, 6.11, 0);
    ladleMoltenEdge.rotation.x = -Math.PI / 2;
    ladleBucket.add(ladleMoltenEdge);

    scene.add(craneGroup);

    // 7. Spark & Ember Particle Fountain
    const sparkCount = 600;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel: number[] = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3 + 0] = (Math.random() - 0.5) * 4;
      sparkPos[i * 3 + 1] = -1.7 + Math.random() * 0.5;
      sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 4;

      sparkVel.push(
        (Math.random() - 0.5) * 0.06,
        0.08 + Math.random() * 0.12,
        (Math.random() - 0.5) * 0.06
      );
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.18,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const sparkParticles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkParticles);

    // 8. 3D Foundry Technician in Thermal Suit
    const operator = new THREE.Group();
    const suitMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.7, roughness: 0.3 });
    const goldVisorMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.1 });

    const opTorso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.5), suitMat);
    opTorso.position.y = 0.6;
    operator.add(opTorso);

    const opHead = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), suitMat);
    opHead.position.set(0, 1.4, 0);
    const opVisor = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.2), goldVisorMat);
    opVisor.position.set(0, 1.4, 0.22);
    opHead.add(opVisor);
    operator.add(opHead);

    // Arms holding railing
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.8, 8), suitMat);
    leftArm.position.set(-0.55, 0.7, 0.3);
    leftArm.rotation.x = Math.PI / 3;
    operator.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.8, 8), suitMat);
    rightArm.position.set(0.55, 0.7, 0.3);
    rightArm.rotation.x = Math.PI / 3;
    operator.add(rightArm);

    // Safety Catwalk Platform for Operator
    const catwalk = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 3), steelMat);
    catwalk.position.set(0, -0.2, 0.8);
    operator.add(catwalk);

    operator.position.set(-7, -1.8, 5);
    operator.lookAt(0, -1.8, 0);
    scene.add(operator);

    // 9. Mouse Parallax
    let targetCamX = 0;
    let targetCamY = 5;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetCamX = nx * 5;
      targetCamY = 5 + ny * 2.5;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 10. Observer
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 11. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Camera Lerp
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Crane Horizontal Traverse & Ladle Tilt
      craneGroup.position.x = Math.sin(time * 0.4) * 3.5;
      ladleBucket.rotation.z = Math.sin(time * 0.8) * 0.18;

      // Animate Sparks
      const sPos = sparkGeo.attributes.position;
      for (let i = 0; i < sparkCount; i++) {
        let py = sPos.getY(i) + sparkVel[i * 3 + 1];
        let px = sPos.getX(i) + sparkVel[i * 3 + 0];
        let pz = sPos.getZ(i) + sparkVel[i * 3 + 2];

        sparkVel[i * 3 + 1] -= 0.0035; // gravity

        if (py < -1.8 || py > 12) {
          py = -1.8 + Math.random() * 0.4;
          px = (Math.random() - 0.5) * 3.5;
          pz = (Math.random() - 0.5) * 3.5;
          sparkVel[i * 3 + 1] = 0.08 + Math.random() * 0.12;
        }
        sPos.setX(i, px);
        sPos.setY(i, py);
        sPos.setZ(i, pz);
      }
      sparkGeo.attributes.position.needsUpdate = true;

      // Dynamic Molten Light Flicker
      moltenLight.intensity = 5.5 + Math.sin(time * 12) * 0.8 + Math.cos(time * 18) * 0.5;
      crucibleGlow.intensity = 4.0 + Math.cos(time * 10) * 0.6;

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
