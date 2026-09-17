import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const FusionCore3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0314, 0.018);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 26);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x2e1065, 1.4);
    scene.add(ambientLight);

    const coreLightPurple = new THREE.PointLight(0xa855f7, 5.5, 35);
    coreLightPurple.position.set(0, 0, 0);
    scene.add(coreLightPurple);

    const coreLightCyan = new THREE.PointLight(0x06b6d4, 4.0, 30);
    coreLightCyan.position.set(0, 1, 2);
    scene.add(coreLightCyan);

    // 4. Tokamak Torus Structure (3D Magnetic Confinement Chamber)
    const tokamakGroup = new THREE.Group();
    scene.add(tokamakGroup);

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x1f1638,
      metalness: 0.9,
      roughness: 0.22,
      flatShading: true,
    });

    // Outer Toroidal Hull (with cutaway front)
    const hullGeo = new THREE.TorusGeometry(6.5, 1.8, 24, 64, Math.PI * 1.55);
    const hullMesh = new THREE.Mesh(hullGeo, hullMat);
    hullMesh.rotation.x = Math.PI / 2;
    hullMesh.rotation.z = Math.PI * 0.72;
    tokamakGroup.add(hullMesh);

    // Magnetic Poloidal Field Coils (12 Segment Rings)
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0x3b0764,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.3,
    });
    const coilCount = 12;
    for (let i = 0; i < coilCount; i++) {
      const angle = (i / coilCount) * Math.PI * 2;
      const coil = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.25, 12, 32), coilMat);
      coil.position.set(Math.cos(angle) * 6.5, 0, Math.sin(angle) * 6.5);
      coil.rotation.y = -angle;
      tokamakGroup.add(coil);
    }

    // High-Energy Central Solenoid Column
    const solenoidGeo = new THREE.CylinderGeometry(2.2, 2.2, 10, 24);
    const solenoidMat = new THREE.MeshStandardMaterial({
      color: 0x0f0b1e,
      metalness: 0.95,
      roughness: 0.15,
    });
    const solenoid = new THREE.Mesh(solenoidGeo, solenoidMat);
    tokamakGroup.add(solenoid);

    // Glowing Conductor Rings on Solenoid
    for (let y of [-3.5, -1.8, 0, 1.8, 3.5]) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.35, 0.12, 8, 32),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2;
      tokamakGroup.add(ring);
    }

    // 5. High-Energy Plasma Particle Swirl (Inside the Torus)
    const plasmaCount = 1800;
    const plasmaGeo = new THREE.BufferGeometry();
    const plasmaPositions = new Float32Array(plasmaCount * 3);
    const plasmaColors = new Float32Array(plasmaCount * 3);
    const plasmaSpeed: number[] = [];
    const plasmaRadius: number[] = [];
    const plasmaTheta: number[] = [];
    const plasmaPhi: number[] = [];

    const c1 = new THREE.Color(0xa855f7); // Neon Violet
    const c2 = new THREE.Color(0x38bdf8); // Electric Cyan
    const c3 = new THREE.Color(0xfbbf24); // Solar Gold

    for (let i = 0; i < plasmaCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const r = 6.5 + (Math.random() - 0.5) * 1.8;

      plasmaTheta.push(theta);
      plasmaPhi.push(phi);
      plasmaRadius.push(r);
      plasmaSpeed.push(0.02 + Math.random() * 0.03);

      const x = Math.cos(theta) * r;
      const y = Math.sin(phi) * 0.9;
      const z = Math.sin(theta) * r;

      plasmaPositions[i * 3 + 0] = x;
      plasmaPositions[i * 3 + 1] = y;
      plasmaPositions[i * 3 + 2] = z;

      // Color gradient
      const choice = Math.random();
      const col = choice < 0.45 ? c1 : choice < 0.85 ? c2 : c3;
      plasmaColors[i * 3 + 0] = col.r;
      plasmaColors[i * 3 + 1] = col.g;
      plasmaColors[i * 3 + 2] = col.b;
    }

    plasmaGeo.setAttribute('position', new THREE.BufferAttribute(plasmaPositions, 3));
    plasmaGeo.setAttribute('color', new THREE.BufferAttribute(plasmaColors, 3));

    const plasmaMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const plasmaSystem = new THREE.Points(plasmaGeo, plasmaMat);
    tokamakGroup.add(plasmaSystem);

    // Inner Glowing Core Sphere
    const innerCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.65 })
    );
    tokamakGroup.add(innerCore);

    // 6. Rotating Holographic Telemetry Rings
    const holoRing1 = new THREE.Mesh(
      new THREE.RingGeometry(9.2, 9.4, 64),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
    );
    holoRing1.rotation.x = Math.PI / 2;
    tokamakGroup.add(holoRing1);

    const holoRing2 = new THREE.Mesh(
      new THREE.RingGeometry(11.0, 11.15, 64),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
    );
    holoRing2.rotation.x = Math.PI / 2;
    tokamakGroup.add(holoRing2);

    // 7. Mouse Parallax
    let targetCamX = 0;
    let targetCamY = 3;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetCamX = nx * 5;
      targetCamY = 3 + ny * 3;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 8. Observer
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 9. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Camera Lerp
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Rotate Tokamak System
      tokamakGroup.rotation.y = time * 0.15;
      holoRing1.rotation.z = -time * 0.35;
      holoRing2.rotation.z = time * 0.2;

      // Pulse Inner Core
      const coreScale = 1.0 + Math.sin(time * 6) * 0.12;
      innerCore.scale.set(coreScale, coreScale, coreScale);

      // Swirl Plasma Particles Along Helical Toroidal Path
      const pPos = plasmaGeo.attributes.position;
      for (let i = 0; i < plasmaCount; i++) {
        plasmaTheta[i] += plasmaSpeed[i];
        plasmaPhi[i] += plasmaSpeed[i] * 3.5;

        const r = plasmaRadius[i] + Math.sin(plasmaPhi[i]) * 0.5;
        const x = Math.cos(plasmaTheta[i]) * r;
        const y = Math.cos(plasmaPhi[i]) * 1.1;
        const z = Math.sin(plasmaTheta[i]) * r;

        pPos.setX(i, x);
        pPos.setY(i, y);
        pPos.setZ(i, z);
      }
      pPos.needsUpdate = true;

      // Dynamic Core Light Intensity
      coreLightPurple.intensity = 5.0 + Math.sin(time * 5) * 1.2;
      coreLightCyan.intensity = 3.8 + Math.cos(time * 4) * 0.8;

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
