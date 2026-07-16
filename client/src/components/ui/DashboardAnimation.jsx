import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const mousePos = { x: 0, y: 0 };

function InteractiveSwarm({ count = 500 }) {
  const mesh = useRef();
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 20 - 5;
      
      const speed = 0.002 + Math.random() * 0.008;
      const factor = Math.random() * 100;
      const colorPalette = ['#6366F1', '#8B5CF6', '#06B6D4', '#3B82F6', '#EC4899'];
      const color = new THREE.Color(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
      
      temp.push({ 
        position: new THREE.Vector3(x, y, z), 
        originalPosition: new THREE.Vector3(x, y, z),
        speed,
        factor,
        color
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorArray = useMemo(() => {
    const array = new Float32Array(count * 3);
    particles.forEach((p, i) => p.color.toArray(array, i * 3));
    return array;
  }, [particles, count]);

  useFrame((state) => {
    // Map mouse position to world space target
    const target = new THREE.Vector3(mousePos.x * 25, mousePos.y * 15, 0);
    
    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime * particle.speed;
      
      // Base wander
      const wanderX = Math.sin(t + particle.factor) * 2;
      const wanderY = Math.cos(t + particle.factor) * 2;
      const wanderZ = Math.sin(t * 0.5 + particle.factor) * 2;
      
      const idealX = particle.originalPosition.x + wanderX;
      const idealY = particle.originalPosition.y + wanderY;
      const idealZ = particle.originalPosition.z + wanderZ;
      
      const dist = particle.originalPosition.distanceTo(target);
      const influence = Math.max(0, 1 - dist / 12); 
      
      if (influence > 0) {
        // Attract strongly to mouse if nearby
        particle.position.lerp(target, influence * 0.08);
      } else {
        // Return to ideal wander position
        particle.position.lerp(new THREE.Vector3(idealX, idealY, idealZ), 0.03);
      }

      dummy.position.copy(particle.position);
      // Pulsing scale
      const s = 1 + Math.sin(t * 3 + particle.factor) * 0.8;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshBasicMaterial 
        transparent 
        opacity={0.45} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors
      />
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
}

export default function DashboardAnimation() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <fog attach="fog" args={['#F0F4FF', 12, 38]} />
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <InteractiveSwarm count={400} />
        </Float>
      </Canvas>
    </div>
  );
}
