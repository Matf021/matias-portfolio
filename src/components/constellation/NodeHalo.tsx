
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type NodeHaloProps = {
  color: string;
  radius: number;
  intensity: number;
  selected: boolean;
};

export default function NodeHalo({
  color,
  radius,
  intensity,
  selected,
}: NodeHaloProps) {
  const haloRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }, delta) => {
    const halo = haloRef.current;
    const material = materialRef.current;

    if (!halo || !material) return;

    const time = clock.getElapsedTime();

    const pulse = selected
      ? 1 + Math.sin(time * 2.2) * 0.06
      : 1;

    const targetScale = radius * pulse;

    const smoothing = 1 - Math.exp(-6 * delta);

    halo.scale.lerp(
      new THREE.Vector3(
        targetScale,
        targetScale,
        targetScale
      ),
      smoothing
    );

    material.opacity = THREE.MathUtils.lerp(
      material.opacity,
      intensity,
      smoothing
    );
  });

  return (
    <mesh ref={haloRef} renderOrder={1}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
