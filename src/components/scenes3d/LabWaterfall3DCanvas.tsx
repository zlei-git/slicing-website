import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const LabWaterfall3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060f1e, 0.02);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 28);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f2744, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    keyLight.position.set(-10, 20, 15);
    scene.add(keyLight);

    const labCyanLight = new THREE.PointLight(0x06b6d4, 4.0, 30);
    labCyanLight.position.set(-6, 2, 4);
    scene.add(labCyanLight);

    const vatAmberLight = new THREE.PointLight(0xf59e0b, 3.5, 25);
    vatAmberLight.position.set(6, 3, 2);
    scene.add(vatAmberLight);

    // 4. Industrial Lab Architecture & Platforms
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
      flatShading: true,
    });
    const gantryFloor = new THREE.Mesh(new THREE.BoxGeometry(34, 1.2, 16), metalMat);
    gantryFloor.position.set(0, -3.5, 0);
    scene.add(gantryFloor);

    // Upper Balcony Platform
    const upperBalcony = new THREE.Mesh(new THREE.BoxGeometry(20, 0.8, 6), metalMat);
    upperBalcony.position.set(0, 5, -5);
    scene.add(upperBalcony);

    // Support Pillars & Railings
    for (let x of [-8, -3, 3, 8]) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 8.5, 8), metalMat);
      pillar.position.set(x, 0.75, -5);
      scene.add(pillar);
    }

    // 5. Volumetric 3D Waterfall & Splash Foam
    const waterfallGeo = new THREE.CylinderGeometry(1.6, 2.2, 28, 16, 32, true);
    const waterfallMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.4,
      side: THREE.DoubleSide,
    });
    const waterfall = new THREE.Mesh(waterfallGeo, waterfallMat);
    waterfall.position.set(-11, 7, -4);
    scene.add(waterfall);

    // Splash Particles at Waterfall Base
    const splashCount = 450;
    const splashGeo = new THREE.BufferGeometry();
    const splashPos = new Float32Array(splashCount * 3);
    const splashVel: number[] = [];

    for (let i = 0; i < splashCount; i++) {
      splashPos[i * 3 + 0] = -11 + (Math.random() - 0.5) * 4;
      splashPos[i * 3 + 1] = -3.2 + Math.random() * 2;
      splashPos[i * 3 + 2] = -4 + (Math.random() - 0.5) * 4;

      splashVel.push(
        (Math.random() - 0.5) * 0.08,
        0.06 + Math.random() * 0.1,
        (Math.random() - 0.5) * 0.08
      );
    }
    splashGeo.setAttribute('position', new THREE.BufferAttribute(splashPos, 3));
    const splashMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.22,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const splashParticles = new THREE.Points(splashGeo, splashMat);
    scene.add(splashParticles);

    // 6. Cylindrical Bio-Containment Vats (Cryo / Energy Specimen)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.5,
    });

    const createBioVat = (x: number, y: number, z: number) => {
      const vatGroup = new THREE.Group();
      // Base & Cap
      const capMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.6, 16), capMat);
      base.position.y = -2.2;
      vatGroup.add(base);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.4, 0.6, 16), capMat);
      cap.position.y = 2.2;
      vatGroup.add(cap);

      // Glass Cylinder
      const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 4, 20), glassMat);
      vatGroup.add(cylinder);

      // Rotating Crystalline Specimen Inside
      const crystalGeo = new THREE.OctahedronGeometry(0.85, 1);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.9,
        metalness: 0.3,
        roughness: 0.2,
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      vatGroup.add(crystal);

      vatGroup.position.set(x, y, z);
      return { vatGroup, crystal };
    };

    const vat1 = createBioVat(6, -0.8, 1);
    const vat2 = createBioVat(10.5, -0.8, -2);
    scene.add(vat1.vatGroup);
    scene.add(vat2.vatGroup);

    // 7. ARTICULATED 3D WORKING SCIENTISTS & ENGINEERS ("orang yg ngerjain sesuatu")
    const humanMatSuit = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5, metalness: 0.2 });
    const humanMatArmor = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.5 });
    const humanMatVisor = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.7 });

    // --- CHARACTER 1: Systems Operator at Holo Console (Typing Animation) ---
    const operatorGroup = new THREE.Group();
    // Torso
    const opTorso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.5), humanMatSuit);
    opTorso.position.y = 0.55;
    operatorGroup.add(opTorso);
    // Head & Helmet
    const opHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), humanMatSuit);
    opHead.position.set(0, 1.35, 0);
    const opVisor = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.2), humanMatVisor);
    opVisor.position.set(0, 1.35, 0.2);
    opHead.add(opVisor);
    operatorGroup.add(opHead);

    // Arms
    const opArmLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.7, 8), humanMatArmor);
    opArmLeft.position.set(-0.55, 0.7, 0.25);
    opArmLeft.rotation.x = Math.PI / 3;
    operatorGroup.add(opArmLeft);

    const opArmRight = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.7, 8), humanMatArmor);
    opArmRight.position.set(0.55, 0.7, 0.25);
    opArmRight.rotation.x = Math.PI / 3;
    operatorGroup.add(opArmRight);

    // Operator Desk & Hologram Display
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 0.8), metalMat);
    desk.position.set(0, -0.6, 0.7);
    operatorGroup.add(desk);

    // Floating Hologram Screens
    const holoScreen1 = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.7),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
    );
    holoScreen1.position.set(-0.4, 0.8, 0.8);
    holoScreen1.rotation.y = 0.25;
    operatorGroup.add(holoScreen1);

    const holoScreen2 = new THREE.Mesh(
      new THREE.PlaneGeometry(1.0, 0.6),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
    );
    holoScreen2.position.set(0.6, 0.85, 0.75);
    holoScreen2.rotation.y = -0.3;
    operatorGroup.add(holoScreen2);

    operatorGroup.position.set(-4.5, -2.1, 2);
    scene.add(operatorGroup);

    // --- CHARACTER 2: Field Scientist Scanning Specimen Vat with Laser Beam ---
    const scientistGroup = new THREE.Group();
    const sciTorso = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.1, 0.45), humanMatSuit);
    sciTorso.position.y = 0.55;
    scientistGroup.add(sciTorso);

    const sciHead = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), humanMatSuit);
    sciHead.position.set(0, 1.35, 0);
    const sciVisor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.18), humanMatVisor);
    sciVisor.position.set(0, 1.35, 0.18);
    sciHead.add(sciVisor);
    scientistGroup.add(sciHead);

    // Scanner Arm holding device
    const scannerArm = new THREE.Group();
    const armMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.7, 8), humanMatArmor);
    armMesh.rotation.x = Math.PI / 2.5;
    scannerArm.add(armMesh);

    // Handheld scanner tool
    const tool = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.45), metalMat);
    tool.position.set(0, 0.25, 0.5);
    scannerArm.add(tool);

    // Scanning Cone Laser (Cyan Light Fan)
    const scanLaserGeo = new THREE.ConeGeometry(0.9, 3.2, 16, 1, true);
    scanLaserGeo.rotateX(Math.PI / 2);
    const scanLaserMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const scanLaser = new THREE.Mesh(scanLaserGeo, scanLaserMat);
    scanLaser.position.set(0, 0.25, 2.2);
    scannerArm.add(scanLaser);

    scannerArm.position.set(0.4, 0.75, 0);
    scientistGroup.add(scannerArm);

    scientistGroup.position.set(3.2, -2.1, 1.5);
    scientistGroup.lookAt(6, -0.8, 1); // Look at Bio Vat 1
    scene.add(scientistGroup);

    // --- CHARACTER 3: Upper Balcony Maintenance Drone ---
    const droneGroup = new THREE.Group();
    const droneBody = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 8), metalMat);
    droneGroup.add(droneBody);

    const droneEye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    droneEye.position.set(0, 0, 0.4);
    droneGroup.add(droneEye);

    // 4 Rotors
    const rotorGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.02, 8);
    const rotorMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const rotors: THREE.Mesh[] = [];
    for (let [dx, dz] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 6), metalMat);
      arm.rotation.z = Math.PI / 2;
      arm.position.set(dx * 0.6, 0.1, dz * 0.6);
      droneGroup.add(arm);

      const rotor = new THREE.Mesh(rotorGeo, rotorMat);
      rotor.position.set(dx, 0.2, dz);
      droneGroup.add(rotor);
      rotors.push(rotor);
    }
    droneGroup.position.set(1, 6.5, -2);
    scene.add(droneGroup);

    // 8. Mouse Parallax
    let targetCamX = 0;
    let targetCamY = 4;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetCamX = nx * 4;
      targetCamY = 4 + ny * 2.5;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 9. Observer
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Camera Lerp
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 1, 0);

      // Rotate Specimens Inside Vats
      vat1.crystal.rotation.x = time * 0.8;
      vat1.crystal.rotation.y = time * 1.2;
      vat2.crystal.rotation.x = -time * 0.6;
      vat2.crystal.rotation.y = -time * 0.9;

      // Operator Typing Animation
      opArmLeft.rotation.x = Math.PI / 3 + Math.sin(time * 14) * 0.08;
      opArmRight.rotation.x = Math.PI / 3 + Math.cos(time * 16) * 0.08;
      opHead.rotation.y = Math.sin(time * 1.2) * 0.15;

      // Scientist Scanner Sweeping Up & Down
      const scanTilt = Math.sin(time * 2.5) * 0.25;
      scannerArm.rotation.x = scanTilt;
      sciHead.rotation.x = scanTilt * 0.6;
      scanLaser.scale.set(1 + Math.sin(time * 8) * 0.08, 1, 1 + Math.cos(time * 8) * 0.08);

      // Drone Hover & Rotor Spin
      droneGroup.position.y = 6.5 + Math.sin(time * 3) * 0.35;
      droneGroup.position.x = 1 + Math.cos(time * 1.5) * 0.5;
      rotors.forEach((r) => (r.rotation.y += 0.45));

      // Waterfall Fluid Texture Shift
      waterfall.rotation.y = time * 0.25;

      // Splash Particles Movement
      const sPos = splashGeo.attributes.position;
      for (let i = 0; i < splashCount; i++) {
        let py = sPos.getY(i) + splashVel[i * 3 + 1];
        let px = sPos.getX(i) + splashVel[i * 3 + 0];
        let pz = sPos.getZ(i) + splashVel[i * 3 + 2];

        // Gravity pull
        splashVel[i * 3 + 1] -= 0.003;

        if (py < -3.4) {
          py = -3.4 + Math.random() * 0.3;
          px = -11 + (Math.random() - 0.5) * 3.5;
          pz = -4 + (Math.random() - 0.5) * 3.5;
          splashVel[i * 3 + 1] = 0.06 + Math.random() * 0.1;
        }
        sPos.setX(i, px);
        sPos.setY(i, py);
        sPos.setZ(i, pz);
      }
      sPos.needsUpdate = true;

      // Dynamic Bioluminescent Light Pulse
      labCyanLight.intensity = 3.6 + Math.sin(time * 3) * 0.6;
      vatAmberLight.intensity = 3.0 + Math.cos(time * 2.5) * 0.5;

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
