
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import {
    calculateCameraFraming,
} from "@/lib/cameraFraming";

import {
    calculateFocusDestination,
} from "@/lib/cameraFocus";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

type Props = {
    nodes: ConstellationNodeData[];
    selectedId: string | null;
    controlsRef: React.RefObject<OrbitControlsImpl | null>;
};

const TRANSITION_SPEED = 3.5;
const POSITION_EPSILON = 0.015;

export default function CinematicCameraController({
    nodes,
    selectedId,
    controlsRef,
}: Props) {
    const { camera, size } = useThree();

    const destinationPosition = useRef(new THREE.Vector3());
    const destinationTarget = useRef(new THREE.Vector3());

    const animating = useRef(false);
    const initialized = useRef(false);

    const framing = useMemo(
        () =>
            calculateCameraFraming(
                nodes.map((node) => node.position),
                size.width / Math.max(size.height, 1),
                55,
                1.25
            ),
        [nodes, size.width, size.height]
    );

    const selectedNode = useMemo(
        () => nodes.find((node) => node.id === selectedId),
        [nodes, selectedId]
    );

    // Initialize or change the camera destination.
    useEffect(() => {
        const controls = controlsRef.current;

        if (!controls) return;

        const destination = selectedNode
            ? calculateFocusDestination(selectedNode)
            : framing;

        const nextPosition = new THREE.Vector3(
            ...destination.position
        );

        const nextTarget = new THREE.Vector3(
            ...destination.target
        );

        if (!initialized.current) {
            camera.position.copy(nextPosition);
            controls.target.copy(nextTarget);
            controls.update();

            initialized.current = true;
            return;
        }

        destinationPosition.current.copy(nextPosition);
        destinationTarget.current.copy(nextTarget);

        animating.current = true;
    }, [selectedNode, framing, camera, controlsRef]);


    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        const interruptAnimation = () => {
            animating.current = false;
        };

        controls.addEventListener("start", interruptAnimation);

        return () => {
            controls.removeEventListener("start", interruptAnimation);
        };
    }, [controlsRef]);


    // Smooth camera movement.
    useFrame((_, delta) => {
        const controls = controlsRef.current;

        if (!controls || !animating.current) return;

        const smoothing =
            1 - Math.exp(-TRANSITION_SPEED * delta);

        camera.position.lerp(
            destinationPosition.current,
            smoothing
        );

        controls.target.lerp(
            destinationTarget.current,
            smoothing
        );

        controls.update();

        const positionReached =
            camera.position.distanceTo(
                destinationPosition.current
            ) < POSITION_EPSILON;

        const targetReached =
            controls.target.distanceTo(
                destinationTarget.current
            ) < POSITION_EPSILON;

        if (positionReached && targetReached) {
            camera.position.copy(
                destinationPosition.current
            );

            controls.target.copy(
                destinationTarget.current
            );

            controls.update();

            animating.current = false;
        }
    });

    return null;
}
