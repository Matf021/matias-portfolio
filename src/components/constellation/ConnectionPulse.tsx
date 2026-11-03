
"use client";

import { useRef } from "react";
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
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const trailMeshRef = useRef<THREE.Mesh>(null);
    const trailMaterialRef =
        useRef<THREE.ShaderMaterial>(null);

    const elapsedRef = useRef(0);
    const lastArrivalCycleRef = useRef(-1);


    const startVector = new THREE.Vector3(...start);
    const endVector = new THREE.Vector3(...end);

    // Direction from the starting node to the destination.
    const direction = endVector
        .clone()
        .sub(startVector)
        .normalize();

    // Start outside the selected node.
    const pulseStart = startVector
        .clone()
        .addScaledVector(direction, startRadius);

    // Stop before entering the destination node.
    const pulseEnd = endVector
        .clone()
        .addScaledVector(direction, -endRadius);


    useFrame(({ camera }, delta) => {
        const mesh = meshRef.current;
        const material = materialRef.current;

        if (!mesh || !material) return;

        if (!active) {
            elapsedRef.current = 0;
            mesh.visible = false;

            if (trailMeshRef.current) {
                trailMeshRef.current.visible = false;
            }

            return;
        }


        elapsedRef.current += Math.min(delta, 0.05);

        const cycle = duration + 0.7;
        const animationTime = elapsedRef.current - delay;

        const cycleIndex = Math.floor(
            animationTime / cycle
        );

        const localTime =
            ((animationTime % cycle) + cycle) % cycle;

        // Emit once when the pulse completes its journey.
        if (
            animationTime >= 0 &&
            cycleIndex >= 0 &&
            localTime >= duration &&
            lastArrivalCycleRef.current !== cycleIndex
        ) {
            lastArrivalCycleRef.current = cycleIndex;

            emitNodeArrival(destinationId);
        }


        if (localTime < 0 || localTime > duration) {
            mesh.visible = false;

            if (trailMeshRef.current) {
                trailMeshRef.current.visible = false;
            }

            return;
        }
        
        if (!active) {
            elapsedRef.current = 0;
            lastArrivalCycleRef.current = -1;

            mesh.visible = false;

            if (trailMeshRef.current) {
                trailMeshRef.current.visible = false;
            }

            return;
        }

        mesh.visible = true;

        const progress = localTime / duration;

        // Move along the connection.
        mesh.position.lerpVectors(
            pulseStart,
            pulseEnd,
            progress
        );


        // Fade in and out.
        const fade = Math.sin(Math.PI * progress);

        // Update the particle shader's opacity.
        material.uniforms.uOpacity.value = fade;

        // Slightly expand at the midpoint.
        const scale = 0.16 + fade * 0.08;

        mesh.scale.setScalar(scale);


        const trailMesh = trailMeshRef.current;
        const trailMaterial = trailMaterialRef.current;

        if (trailMesh && trailMaterial) {
            // Direction of the connection in 3D.
            const direction = pulseEnd
                .clone()
                .sub(pulseStart)
                .normalize();
            const connectionLength = pulseStart.distanceTo(pulseEnd);

            const trailLength = Math.min(
                0.7,
                connectionLength * progress
            );

            const trailEnd = mesh.position.clone();

            const trailStart = trailEnd
                .clone()
                .addScaledVector(direction, -trailLength);

            const trailCenter = trailStart
                .clone()
                .add(trailEnd)
                .multiplyScalar(0.5);

            trailMesh.position.copy(trailCenter);


            // Direction from the trail toward the camera.
            const viewDirection = camera.position
                .clone()
                .sub(trailCenter)
                .normalize();

            // Construct the trail's perpendicular axis.
            const perpendicular = new THREE.Vector3()
                .crossVectors(viewDirection, direction);

            // Handle near-parallel camera and connection directions.
            if (perpendicular.lengthSq() < 0.0001) {
                perpendicular.set(0, 1, 0);

                if (Math.abs(direction.y) > 0.99) {
                    perpendicular.set(1, 0, 0);
                }

                perpendicular.addScaledVector(
                    direction,
                    -perpendicular.dot(direction)
                );
            }

            perpendicular.normalize();

            const forward = new THREE.Vector3()
                .crossVectors(direction, perpendicular)
                .normalize();

            const rotationMatrix = new THREE.Matrix4().makeBasis(
                direction,
                perpendicular,
                forward
            );

            trailMesh.quaternion.setFromRotationMatrix(
                rotationMatrix
            );

            trailMesh.scale.set(
                trailLength,
                0.22,
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
