
"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import {
    getLabelFontSize,
    getLabelScreenScale,
} from "@/lib/labelProjection";
import {
    getStellarLabelOffset,
    getStellarVisualScale,
    getCameraAwareLabelOffset,
} from "@/lib/stellarLabel";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

import { getLabelLines } from "@/lib/labelLayout";

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
    labelOffsetsRef: React.RefObject<Map<string, number>>;
    labelShiftXRef: React.RefObject<Map<string, number>>;
};

export default function ConstellationLabel({
    node,
    hovered,
    selected,
    connected,
    hasSelection,
    hiddenLabelsRef,
    labelOffsetsRef,
    labelShiftXRef,
}: ConstellationLabelProps) {
    const { size } = useThree();

    const labelLines = getLabelLines(
        node,
        size.width
    );

    const displayLabel = labelLines.join("\n");
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);
    const billboardRef = useRef<THREE.Group>(null);
    const worldPosition = useRef(new THREE.Vector3());
    const textRef = useRef<THREE.Mesh>(null);
    const cameraSpaceRef = useRef(new THREE.Vector3());

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
        selected
            ? "#ffffff"
            : hovered
                ? "#f4f8ff"
                : isConnectedLabel
                    ? "#b8cbe5"
                    : "#a7b9d2";


    const emphasizedLabelSize =
        selected
            ? labelSize * 1.12
            : hovered
                ? labelSize * 1.06
                : labelSize;

    useFrame(({ camera, size }, delta) => {
        const material = materialRef.current;
        const billboard = billboardRef.current;
        const text = textRef.current;

        if (text && camera instanceof THREE.PerspectiveCamera) {
            const offsetPx =
                labelOffsetsRef.current.get(node.id) ?? 0;

            const cameraSpace = cameraSpaceRef.current
                .set(...node.position)
                .applyMatrix4(camera.matrixWorldInverse);

            const depth = -cameraSpace.z;

            if (depth > 0) {
                const verticalFov =
                    THREE.MathUtils.degToRad(camera.fov);

                const worldUnitsPerPixel =
                    (
                        2 *
                        depth *
                        Math.tan(verticalFov / 2)
                    ) /
                    size.height;

                const cameraAwareY = getCameraAwareLabelOffset(
                    node,
                    visualScale,
                    worldUnitsPerPixel
                );

                const targetY =
                    cameraAwareY -
                    offsetPx * worldUnitsPerPixel;

                text.position.y = targetY;

                const shiftPx =
                    labelShiftXRef.current.get(node.id) ?? 0;

                text.position.x =
                    shiftPx * worldUnitsPerPixel;


                const screenScale = getLabelScreenScale(
                    node,
                    depth,
                    camera,
                    size.height,
                    selected ? 1.12 : hovered ? 1.06 : 1
                );

                text.scale.setScalar(screenScale);
            }
        }

        if (!material || !billboard) return;

        billboard.getWorldPosition(worldPosition.current);

        const distance = camera.position.distanceTo(
            worldPosition.current
        );

        let targetOpacity = 0;

        if (selected) {
            targetOpacity = 1;
        } else if (hovered) {
            targetOpacity = 1;
        } else if (isConnectedLabel) {
            targetOpacity = 0.82;
        } else if (!hasSelection && isOverviewLabel) {
            targetOpacity = 0.9;
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
                lineHeight={1.2}
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
                {displayLabel}

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
