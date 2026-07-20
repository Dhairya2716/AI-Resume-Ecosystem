import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSphere(props) {
  const ref = useRef();
  
  // Generate random points in a sphere
  const sphere = useMemo(() => {
    const points = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000 * 3; i += 3) {
      const radius = 1.8;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      points[i] = radius * Math.sin(phi) * Math.cos(theta);
      points[i+1] = radius * Math.sin(phi) * Math.sin(theta);
      points[i+2] = radius * Math.cos(phi);
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#06B6D4"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      {/* Inner glowing core */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#7C3AED" transparent opacity={0.1} wireframe />
      </Sphere>
    </group>
  );
}

export default function AIOrb() {
  return (
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ParticleSphere />
      </Canvas>
    </div>
  );
}
