import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ count = 400 }) {
  const mesh = useRef();
  
  // Generate random positions, colors, and initial rotation for particles
  const particles = useMemo(() => {
    const temp = [];
    const colorOptions = [
      new THREE.Color('#8B5CF6'), // Purple
      new THREE.Color('#3B82F6'), // Blue
      new THREE.Color('#06B6D4'), // Cyan
      new THREE.Color('#EC4899')  // Pink
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;
      
      const speed = 0.01 + Math.random() * 0.02;
      const factor = Math.random() * 100;
      
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      
      temp.push({ 
        position: new THREE.Vector3(x, y, z), 
        originalPosition: new THREE.Vector3(x, y, z),
        rotation: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        speed,
        factor,
        color
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorArray = useMemo(() => new Float32Array(count * 3), [count]);

  // Set initial colors
  useMemo(() => {
    particles.forEach((p, i) => {
      p.color.toArray(colorArray, i * 3);
    });
  }, [particles, colorArray]);

  useFrame((state) => {
    // Mouse interaction
    const mouseX = (state.mouse.x * state.viewport.width) / 2;
    const mouseY = (state.mouse.y * state.viewport.height) / 2;

    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime * particle.speed;
      
      // Gentle floating animation
      particle.position.x = particle.originalPosition.x + Math.sin(t + particle.factor) * 1.5;
      particle.position.y = particle.originalPosition.y + Math.cos(t + particle.factor) * 1.5;
      particle.position.z = particle.originalPosition.z + Math.sin(t + particle.factor) * 1.5;

      // Slight repelling from mouse
      const dx = particle.position.x - mouseX;
      const dy = particle.position.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 3) {
        particle.position.x += dx * 0.02;
        particle.position.y += dy * 0.02;
      }

      particle.rotation.x += particle.speed;
      particle.rotation.y += particle.speed;

      dummy.position.copy(particle.position);
      dummy.rotation.set(particle.rotation.x, particle.rotation.y, particle.rotation.z);
      
      // Vary scale slightly based on time
      const scale = 0.5 + Math.sin(t * 10) * 0.2;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    
    // Rotate entire system slowly
    mesh.current.rotation.y += 0.001;
    mesh.current.rotation.x += 0.0005;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      {/* Abstract geometric shards */}
      <icosahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial 
        roughness={0.1}
        metalness={0.8}
        envMapIntensity={1}
      >
        <instancedBufferAttribute attach="color" args={[colorArray, 3]} />
      </meshStandardMaterial>
    </instancedMesh>
  );
}

export default function HeroAnimation() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#8B5CF6" />
      <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#06B6D4" />
      <Environment preset="city" />
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <Particles count={250} />
      </Float>
    </Canvas>
  );
}
