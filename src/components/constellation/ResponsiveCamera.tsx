
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import {
    calculateCameraFraming,
} from "@/lib/cameraFraming";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

type ResponsiveCameraProps = {
    nodes: ConstellationNodeData[];
    controlsRef: React.RefObject<{
        target: THREE.Vector3;
        update: () => void;
    } | null>;
};

export default function ResponsiveCamera({
    nodes,
    controlsRef,
}: ResponsiveCameraProps) {
    const { camera, size } = useThree();

    // const positions = useMemo(
    //     () => nodes.map((node) => node.position),
    //     [nodes]
    // );

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

    const initialized = useRef(false);
    const previousSize = useRef({
        width: size.width,
        height: size.height,
    });

    useEffect(() => {
        if (!controlsRef.current) return;

        const target = new THREE.Vector3(...framing.target);
        const position = new THREE.Vector3(...framing.position);

        camera.position.copy(position);
        controlsRef.current.target.copy(target);
        controlsRef.current.update();

        initialized.current = true;

        previousSize.current = {
            width: size.width,
            height: size.height,
        };
    }, [
        camera,
        framing,
        controlsRef,
        size.width,
        size.height,
    ]);

    return null;
}
