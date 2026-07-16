import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedSphere() {
  const sphereRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    sphereRef.current.position.y = Math.sin(time / 2) * 0.2;
    sphereRef.current.rotation.y = time / 4;
  });

  return (
    <Sphere ref={sphereRef} args={[1.5, 64, 64]}>
      <MeshDistortMaterial
        color="#8B5CF6"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
        emissive="#4c1d95"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
}

function FloatingRing({ position, rotation, speed, color }) {
  const ringRef = useRef();

  useFrame((state) => {
    ringRef.current.rotation.x += speed.x;
    ringRef.current.rotation.y += speed.y;
    ringRef.current.rotation.z += speed.z;
  });

  return (
    <mesh position={position} rotation={rotation} ref={ringRef}>
      <torusGeometry args={[3, 0.05, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

export default function AuthAnimation() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#6366F1" />
      <directionalLight position={[-5, -5, -5]} intensity={1} color="#06B6D4" />
      
      <AnimatedSphere />
      
      <FloatingRing 
        position={[0, 0, -2]} 
        rotation={[Math.PI / 4, 0, 0]} 
        speed={{ x: 0.005, y: 0.01, z: 0 }} 
        color="#3B82F6" 
      />
      <FloatingRing 
        position={[0, 0, -1]} 
        rotation={[0, Math.PI / 4, 0]} 
        speed={{ x: 0, y: 0.005, z: 0.01 }} 
        color="#06B6D4" 
      />
    </Canvas>
  );
}
