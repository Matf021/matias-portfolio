
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import ConnectionTrail from "./ConnectionTrail";
import EnergyParticle from "./EnergyParticle";

import { emitNodeArrival } from "@/lib/constellationEvents";
import type { Position3D } from "@/types/constellation";

type ConnectionPulseProps = {
    start: Position3D;
    end: Position3D;
    startRadius: number;
    endRadius: number;
    destinationId: string;
    active: boolean;
    delay?: number;
    duration?: number;
};

export default function ConnectionPulse({
    start,
    end,
    startRadius,
    endRadius,
    destinationId,
    active,
    delay = 0,
    duration = 2.4,
}: ConnectionPulseProps) {
    // Particle refs
    const particleGroupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // Trail refs
    const trailMeshRef = useRef<THREE.Mesh>(null);
    const trailMaterialRef =
        useRef<THREE.ShaderMaterial>(null);

    // Animation lifecycle
    const elapsedRef = useRef(0);
    const completedCyclesRef = useRef(0);

    // Reusable objects to avoid allocations every frame
    const temp = useMemo(() => ({
        trailStart: new THREE.Vector3(),
        trailCenter: new THREE.Vector3(),
        perpendicular: new THREE.Vector3(),
        rotationMatrix: new THREE.Matrix4(),
        cameraForward: new THREE.Vector3(),
        trailNormal: new THREE.Vector3(),
    }), []);

    // Cache the path geometry
    const path = useMemo(() => {
        const startVector = new THREE.Vector3(...start);
        const endVector = new THREE.Vector3(...end);

        const direction = endVector
            .clone()
            .sub(startVector)
            .normalize();

        const centerDistance =
            startVector.distanceTo(endVector);

        const totalRadius =
            startRadius + endRadius;

        const radiusScale =
            totalRadius > 0
                ? Math.min(
                    1,
                    Math.max(0, centerDistance - 0.05) /
                        totalRadius
                )
                : 1;

        const pulseStart = startVector
            .clone()
            .addScaledVector(
                direction,
                startRadius * radiusScale
            );

        const pulseEnd = endVector
            .clone()
            .addScaledVector(
                direction,
                -endRadius * radiusScale
            );

        const travelVector = pulseEnd
            .clone()
            .sub(pulseStart);

        const travelLength = travelVector.length();

        const travelDirection =
            travelLength > 0
                ? travelVector.clone().normalize()
                : new THREE.Vector3(1, 0, 0);

        return {
            pulseStart,
            pulseEnd,
            travelLength,
            travelDirection,
        };
    }, [start, end, startRadius, endRadius]);

    // Restart animation when the destination changes
    useEffect(() => {
        elapsedRef.current = 0;
        completedCyclesRef.current = 0;

        if (meshRef.current) {
            meshRef.current.visible = false;
        }

        if (trailMeshRef.current) {
            trailMeshRef.current.visible = false;
        }
    }, [destinationId]);

    useFrame(({ camera }, delta) => {
        const mesh = meshRef.current;
        const material = materialRef.current;
        const particleGroup = particleGroupRef.current;

        if (!mesh || !material || !particleGroup) return;

        // Stop and reset when the connection is inactive
        if (!active) {
            elapsedRef.current = 0;
            completedCyclesRef.current = 0;

            mesh.visible = false;

            if (trailMeshRef.current) {
                trailMeshRef.current.visible = false;
            }

            return;
        }

        // Advance animation time
        elapsedRef.current += Math.min(delta, 0.05);

        const cycle = duration + 0.7;
        const animationTime = elapsedRef.current - delay;

        // Count completed journeys
        const completedJourneys =
            animationTime >= duration
                ? Math.floor(
                    (animationTime - duration) / cycle
                ) + 1
                : 0;

        // Emit one event when a new journey completes
        if (
            completedJourneys >
            completedCyclesRef.current
        ) {
            completedCyclesRef.current =
                completedJourneys;

            emitNodeArrival(destinationId);
        }

        // Position within the current animation cycle
        const localTime =
            ((animationTime % cycle) + cycle) % cycle;

        // Hide during initial delay or between journeys
        if (
            animationTime < 0 ||
            localTime >= duration
        ) {
            mesh.visible = false;

            if (trailMeshRef.current) {
                trailMeshRef.current.visible = false;
            }

            return;
        }

        mesh.visible = true;

        const progress = localTime / duration;

        // Move the particle's outer group
        particleGroup.position.lerpVectors(
            path.pulseStart,
            path.pulseEnd,
            progress
        );

        // Animate shader opacity and particle size
        const fade = Math.sin(Math.PI * progress);

        material.uniforms.uOpacity.value = fade;

        const scale = 0.16 + fade * 0.08;
        mesh.scale.setScalar(scale);

        // Animate the trail
        const trailMesh = trailMeshRef.current;
        const trailMaterial = trailMaterialRef.current;

        if (trailMesh && trailMaterial) {
            const trailLength = Math.min(
                0.7,
                path.travelLength * progress
            );

            const trailEnd = particleGroup.position;

            temp.trailStart
                .copy(trailEnd)
                .addScaledVector(
                    path.travelDirection,
                    -trailLength
                );

            temp.trailCenter
                .copy(temp.trailStart)
                .add(trailEnd)
                .multiplyScalar(0.5);

            trailMesh.position.copy(temp.trailCenter);

            // Get the camera's viewing direction
            camera.getWorldDirection(
                temp.cameraForward
            );

            // Calculate a normal perpendicular
            // to the connection
            temp.trailNormal
                .copy(temp.cameraForward)
                .addScaledVector(
                    path.travelDirection,
                    -temp.cameraForward.dot(
                        path.travelDirection
                    )
                );

            // Handle nearly parallel directions
            if (temp.trailNormal.lengthSq() < 0.0001) {
                temp.trailNormal.set(0, 1, 0);

                if (
                    Math.abs(path.travelDirection.y) >
                    0.99
                ) {
                    temp.trailNormal.set(1, 0, 0);
                }

                temp.trailNormal.addScaledVector(
                    path.travelDirection,
                    -temp.trailNormal.dot(
                        path.travelDirection
                    )
                );
            }

            temp.trailNormal.normalize();

            // Construct the width axis
            temp.perpendicular
                .crossVectors(
                    temp.trailNormal,
                    path.travelDirection
                )
                .normalize();

            // Align trail plane with connection
            temp.rotationMatrix.makeBasis(
                path.travelDirection,
                temp.perpendicular,
                temp.trailNormal
            );

            trailMesh.quaternion.setFromRotationMatrix(
                temp.rotationMatrix
            );

            // Trail appearance
            trailMesh.scale.set(
                trailLength,
                0.15,
                1
            );

            trailMaterial.uniforms.uOpacity.value =
                fade * 1.2;

            trailMesh.visible = true;
        }
    });

    return (
        <>
            <EnergyParticle
                groupRef={particleGroupRef}
                meshRef={meshRef}
                materialRef={materialRef}
                color="#b8ddff"
            />

            <ConnectionTrail
                meshRef={trailMeshRef}
                materialRef={trailMaterialRef}
                color="#8ab8ff"
            />
        </>
    );
}
