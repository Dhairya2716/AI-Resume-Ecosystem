// import React, { useRef, useMemo } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { Float, Environment } from '@react-three/drei';
// import * as THREE from 'three';

// function Particles({ count = 400 }) {
//   const mesh = useRef();

//   // Generate random positions, colors, and initial rotation for particles
//   const particles = useMemo(() => {
//     const temp = [];
//     const colorOptions = [
//       new THREE.Color('#8B5CF6'), // Purple
//       new THREE.Color('#3B82F6'), // Blue
//       new THREE.Color('#06B6D4'), // Cyan
//       new THREE.Color('#EC4899')  // Pink
//     ];

//     for (let i = 0; i < count; i++) {
//       const x = (Math.random() - 0.5) * 15;
//       const y = (Math.random() - 0.5) * 15;
//       const z = (Math.random() - 0.5) * 15;

//       const speed = 0.01 + Math.random() * 0.02;
//       const factor = Math.random() * 100;

//       const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];

//       temp.push({ 
//         position: new THREE.Vector3(x, y, z), 
//         originalPosition: new THREE.Vector3(x, y, z),
//         rotation: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, 0),
//         speed,
//         factor,
//         color
//       });
//     }
//     return temp;
//   }, [count]);

//   const dummy = useMemo(() => new THREE.Object3D(), []);
//   const colorArray = useMemo(() => new Float32Array(count * 3), [count]);

//   // Set initial colors
//   useMemo(() => {
//     particles.forEach((p, i) => {
//       p.color.toArray(colorArray, i * 3);
//     });
//   }, [particles, colorArray]);

//   useFrame((state) => {
//     // Mouse interaction
//     const mouseX = (state.mouse.x * state.viewport.width) / 2;
//     const mouseY = (state.mouse.y * state.viewport.height) / 2;

//     particles.forEach((particle, i) => {
//       const t = state.clock.elapsedTime * particle.speed;

//       // Gentle floating animation
//       particle.position.x = particle.originalPosition.x + Math.sin(t + particle.factor) * 1.5;
//       particle.position.y = particle.originalPosition.y + Math.cos(t + particle.factor) * 1.5;
//       particle.position.z = particle.originalPosition.z + Math.sin(t + particle.factor) * 1.5;

//       // Slight repelling from mouse
//       const dx = particle.position.x - mouseX;
//       const dy = particle.position.y - mouseY;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       if (dist < 3) {
//         particle.position.x += dx * 0.02;
//         particle.position.y += dy * 0.02;
//       }

//       particle.rotation.x += particle.speed;
//       particle.rotation.y += particle.speed;

//       dummy.position.copy(particle.position);
//       dummy.rotation.set(particle.rotation.x, particle.rotation.y, particle.rotation.z);

//       // Vary scale slightly based on time
//       const scale = 0.5 + Math.sin(t * 10) * 0.2;
//       dummy.scale.set(scale, scale, scale);

//       dummy.updateMatrix();
//       mesh.current.setMatrixAt(i, dummy.matrix);
//     });

//     mesh.current.instanceMatrix.needsUpdate = true;

//     // Rotate entire system slowly
//     mesh.current.rotation.y += 0.001;
//     mesh.current.rotation.x += 0.0005;
//   });

//   return (
//     <instancedMesh ref={mesh} args={[null, null, count]}>
//       {/* Abstract geometric shards */}
//       <icosahedronGeometry args={[0.2, 0]} />
//       <meshStandardMaterial 
//         roughness={0.1}
//         metalness={0.8}
//         envMapIntensity={1}
//       >
//         <instancedBufferAttribute attach="color" args={[colorArray, 3]} />
//       </meshStandardMaterial>
//     </instancedMesh>
//   );
// }

// export default function HeroAnimation() {
//   return (
//     <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
//       <ambientLight intensity={0.8} />
//       <directionalLight position={[10, 10, 5]} intensity={1.5} color="#8B5CF6" />
//       <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#06B6D4" />
//       <Environment preset="city" />
//       <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
//         <Particles count={250} />
//       </Float>
//     </Canvas>
//   );
// }

//
//
//
//
//

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * A field of small glass-like shards drifting behind the redline card.
 * Colors are pulled straight from the manuscript palette (redline, verified,
 * ink, gold) so the scene reads as part of the same design system rather
 * than a generic "AI particles" background.
 */
function Shards({ count = 160 }) {
  const mesh = useRef();
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const shards = useMemo(() => {
    const palette = [
      new THREE.Color("#c81e3d"), // redline
      new THREE.Color("#1f8a70"), // verified
      new THREE.Color("#1a2130"), // ink
      new THREE.Color("#b5872e"), // gold
    ];
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 3.2 + Math.random() * 3.4;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 6;

      temp.push({
        origin: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius - 1.5
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          0
        ),
        speed: 0.15 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        scale: 0.28 + Math.random() * 0.34,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    shards.forEach((s, i) => s.color.toArray(arr, i * 3));
    return arr;
  }, [shards, count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;

    // Gentle parallax toward the cursor — a whisper, not a swing.
    const targetX = state.mouse.x * 0.4;
    const targetY = state.mouse.y * 0.25;
    mesh.current.rotation.y += (targetX - mesh.current.rotation.y) * 0.02;
    mesh.current.rotation.x += (targetY - mesh.current.rotation.x) * 0.02;

    if (!reducedMotion) {
      mesh.current.rotation.y += 0.0006;
    }

    shards.forEach((shard, i) => {
      const drift = reducedMotion ? 0 : Math.sin(t * shard.speed + shard.phase);
      dummy.position.set(
        shard.origin.x,
        shard.origin.y + drift * 0.5,
        shard.origin.z
      );
      dummy.rotation.set(
        shard.rotation.x + (reducedMotion ? 0 : t * shard.speed * 0.1),
        shard.rotation.y + (reducedMotion ? 0 : t * shard.speed * 0.08),
        0
      );
      dummy.scale.setScalar(shard.scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <octahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial roughness={0.35} metalness={0.15}>
        <instancedBufferAttribute attach="color" args={[colorArray, 3]} />
      </meshStandardMaterial>
    </instancedMesh>
  );
}

/** Caps the device pixel ratio so the scene stays smooth on retina laptops. */
function PerfGuard() {
  const { gl } = useThree();
  React.useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }, [gl]);
  return null;
}

export default function HeroAnimation() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <PerfGuard />
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 6, 4]} intensity={1.1} color="#fbfaf6" />
      <directionalLight position={[-6, -3, -4]} intensity={0.5} color="#c81e3d" />
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.6}>
        <Shards count={140} />
      </Float>
    </Canvas>
  );
}
