
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { getLabelFontSize } from "@/lib/labelProjection";
import {
    getStellarLabelOffset,
    getStellarVisualScale,
} from "@/lib/stellarLabel";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

const LABEL_DISTANCE = {
    project: {
        near: 8,
        far: 15,
    },
    technology: {
        near: 5,
        far: 10,
    },
} as const;

type ConstellationLabelProps = {
    node: ConstellationNodeData;
    hovered: boolean;
    selected: boolean;
    connected: boolean;
    hasSelection: boolean;
    hiddenLabelsRef: React.RefObject<Set<string>>;
};

export default function ConstellationLabel({
    node,
    hovered,
    selected,
    connected,
    hasSelection,
    hiddenLabelsRef,
}: ConstellationLabelProps) {
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);
    const billboardRef = useRef<THREE.Group>(null);
    const worldPosition = useRef(new THREE.Vector3());
    const textRef = useRef<THREE.Mesh>(null);

    const visualScale = getStellarVisualScale(
        selected,
        hovered
    );

    const targetLabelY = getStellarLabelOffset(
        node,
        visualScale
    );

    const isPriority = hovered || selected;

    const isConnectedLabel =
        hasSelection && connected && !selected;

    const isOverviewLabel =
        node.category === "identity" ||
        node.category === "discipline";

    const labelSize = getLabelFontSize(node);

    const labelColor =
        selected || hovered
            ? "#ffffff"
            : isConnectedLabel
                ? "#dce9ff"
                : "#c4d4eb";

    const emphasizedLabelSize =
        selected
            ? labelSize * 1.12
            : hovered
                ? labelSize * 1.06
                : labelSize;

    useFrame(({ camera }, delta) => {
        const material = materialRef.current;
        const billboard = billboardRef.current;

        if (!material || !billboard) return;

        billboard.getWorldPosition(worldPosition.current);

        const text = textRef.current;

        if (text) {
            const smoothing = 1 - Math.exp(-8 * delta);

            text.position.y = THREE.MathUtils.lerp(
                text.position.y,
                targetLabelY,
                smoothing
            );
        }

        const distance = camera.position.distanceTo(
            worldPosition.current
        );

        let targetOpacity = 0;

        if (isPriority) {
            targetOpacity = 1;
        } else if (isConnectedLabel) {
            targetOpacity = 0.9;
        } else if (!hasSelection && isOverviewLabel) {
            targetOpacity = 1;
        } else if (!hasSelection && node.category === "project") {
            const { near, far } = LABEL_DISTANCE.project;

            const distanceVisibility = THREE.MathUtils.clamp(
                (far - distance) / (far - near),
                0,
                1
            );

            targetOpacity = THREE.MathUtils.lerp(
                0.35,
                1,
                distanceVisibility
            );
        }

        if (
            hiddenLabelsRef.current.has(node.id) &&
            !selected &&
            !hovered
        ) {
            targetOpacity *= 0.08;
        }

        const smoothing = 1 - Math.exp(-7 * delta);

        material.opacity = THREE.MathUtils.lerp(
            material.opacity,
            targetOpacity,
            smoothing
        );
    });

    return (
        <Billboard
            ref={billboardRef}
            follow
            lockX={false}
            lockY={false}
            lockZ={false}
        >
            <Text
                ref={textRef}
                position={[0, targetLabelY, 0]}
                fontSize={emphasizedLabelSize}
                color={labelColor}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.004}
                outlineColor="#081120"
                raycast={() => null}
            >
                {node.label}

                <meshBasicMaterial
                    ref={materialRef}
                    color={labelColor}
                    transparent
                    opacity={
                        isPriority ||
                            isConnectedLabel ||
                            (!hasSelection && isOverviewLabel)
                            ? 1
                            : 0
                    }
                    depthWrite={false}
                    toneMapped={false}
                />
            </Text>
        </Billboard>
    );
}
