import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const SeaArch3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x2a103c, 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 32);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 3. Lighting (Radiant Dawn Sunrise)
    const ambientLight = new THREE.AmbientLight(0x4a184c, 1.5);
    scene.add(ambientLight);

    const sunDawnLight = new THREE.DirectionalLight(0xffedd5, 3.5);
    sunDawnLight.position.set(0, 4, -40);
    scene.add(sunDawnLight);

    const skyWarmLight = new THREE.DirectionalLight(0xf97316, 1.8);
    skyWarmLight.position.set(0, 20, 10);
    scene.add(skyWarmLight);

    // 4. Luminous 3D Sun Sphere on Horizon with Atmospheric Halo
    const sunSphere = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffedd5 })
    );
    sunSphere.position.set(0, 2.5, -55);
    scene.add(sunSphere);

    // Sun Corona Rings
    const coronaRing = new THREE.Mesh(
      new THREE.RingGeometry(7.0, 15.0, 32),
      new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    coronaRing.position.set(0, 2.5, -54);
    scene.add(coronaRing);

    // 5. Massive 3D Geological Sea Arch Rock Formation
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x3b1c40,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });

    const archGroup = new THREE.Group();

    // Arch Left Pier
    const leftPierGeo = new THREE.CylinderGeometry(3.5, 5.5, 18, 12);
    const leftPier = new THREE.Mesh(leftPierGeo, rockMat);
    leftPier.position.set(-8, 5, -15);
    leftPier.rotation.z = -0.12;
    archGroup.add(leftPier);

    // Arch Right Pier
    const rightPierGeo = new THREE.CylinderGeometry(3.8, 6.0, 18, 12);
    const rightPier = new THREE.Mesh(rightPierGeo, rockMat);
    rightPier.position.set(8, 5, -15);
    rightPier.rotation.z = 0.12;
    archGroup.add(rightPier);

    // Arch Bridge Span
    const archSpanGeo = new THREE.TorusGeometry(8.5, 3.2, 12, 24, Math.PI);
    const archSpan = new THREE.Mesh(archSpanGeo, rockMat);
    archSpan.position.set(0, 9, -15);
    archGroup.add(archSpan);

    // Coastal Cliffs Foreground Framing
    const fgCliffLeft = new THREE.Mesh(new THREE.ConeGeometry(7, 16, 7), rockMat);
    fgCliffLeft.position.set(-18, 2, 5);
    archGroup.add(fgCliffLeft);

    const fgCliffRight = new THREE.Mesh(new THREE.ConeGeometry(7.5, 18, 8), rockMat);
    fgCliffRight.position.set(18, 3, 5);
    archGroup.add(fgCliffRight);

    scene.add(archGroup);

    // 6. Expansive 3D Ocean Surface with Dynamic Wave Displacements
    const oceanGeo = new THREE.PlaneGeometry(90, 90, 64, 64);
    oceanGeo.rotateX(-Math.PI / 2);

    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0c1b33,
      emissive: 0x075985,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.85,
      flatShading: true,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.set(0, -3.5, -10);
    scene.add(ocean);

    // 7. Ancient Beacon / Sanctum Pillar with Brazier Fire
    const beaconGroup = new THREE.Group();
    const beaconBase = new THREE.Mesh(new THREE.BoxGeometry(2.5, 6, 2.5), rockMat);
    beaconGroup.add(beaconBase);

    const brazier = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 0.6, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.9 })
    );
    brazier.position.y = 3.6;
    beaconGroup.add(brazier);

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 1.8, 8),
      new THREE.MeshBasicMaterial({ color: 0xf97316 })
    );
    flame.position.y = 4.8;
    beaconGroup.add(flame);

    const flameLight = new THREE.PointLight(0xf97316, 3.5, 18);
    flameLight.position.y = 5.0;
    beaconGroup.add(flameLight);

    beaconGroup.position.set(-13, 1, 8);
    scene.add(beaconGroup);

    // 8. Soaring Sea Gulls in 3D
    const gullGroup = new THREE.Group();
    scene.add(gullGroup);

    const gullData: Array<{
      mesh: THREE.Group;
      leftWing: THREE.Mesh;
      rightWing: THREE.Mesh;
      angle: number;
      speed: number;
      radius: number;
      height: number;
    }> = [];

    const gullMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, side: THREE.DoubleSide });

    for (let i = 0; i < 10; i++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.9, 4), gullMat);
      body.rotateX(Math.PI / 2);
      g.add(body);

      const lWingGeo = new THREE.BufferGeometry();
      lWingGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0.1, -1.0, 0, -0.3, 0, 0, -0.3]), 3));
      lWingGeo.computeVertexNormals();
      const lWing = new THREE.Mesh(lWingGeo, gullMat);
      g.add(lWing);

      const rWingGeo = new THREE.BufferGeometry();
      rWingGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0.1, 1.0, 0, -0.3, 0, 0, -0.3]), 3));
      rWingGeo.computeVertexNormals();
      const rWing = new THREE.Mesh(rWingGeo, gullMat);
      g.add(rWing);

      gullGroup.add(g);
      gullData.push({
        mesh: g,
        leftWing: lWing,
        rightWing: rWing,
        angle: (i / 10) * Math.PI * 2,
        speed: 0.007 + Math.random() * 0.005,
        radius: 12 + Math.random() * 8,
        height: 6 + Math.random() * 7,
      });
    }

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
      camera.lookAt(0, 3, -15);

      // Animate Ocean Waves
      const oceanPos = oceanGeo.attributes.position;
      for (let i = 0; i < oceanPos.count; i++) {
        const u = oceanPos.getX(i);
        const v = oceanPos.getZ(i);
        const wave = Math.sin(v * 0.25 + time * 2.0) * 0.28 + Math.cos(u * 0.3 + time * 1.6) * 0.18;
        oceanPos.setY(i, wave);
      }
      oceanPos.needsUpdate = true;

      // Animate Sea Gulls
      gullData.forEach((gull) => {
        gull.angle += gull.speed;
        const x = Math.sin(gull.angle) * gull.radius;
        const z = Math.cos(gull.angle) * (gull.radius * 1.3) - 15;
        const y = gull.height + Math.sin(gull.angle * 2) * 1.5;

        gull.mesh.position.set(x, y, z);
        const nextX = Math.sin(gull.angle + 0.05) * gull.radius;
        const nextZ = Math.cos(gull.angle + 0.05) * (gull.radius * 1.3) - 15;
        gull.mesh.lookAt(nextX, y, nextZ);

        const flap = Math.sin(time * 10 + gull.angle * 4) * 0.45;
        gull.leftWing.rotation.z = flap;
        gull.rightWing.rotation.z = -flap;
      });

      // Animate Brazier Flame
      flame.scale.y = 1.0 + Math.sin(time * 12) * 0.2;
      flameLight.intensity = 3.2 + Math.sin(time * 14) * 0.8;

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
