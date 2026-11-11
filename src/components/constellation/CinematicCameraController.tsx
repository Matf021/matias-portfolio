
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { calculateCameraFraming } from "@/lib/cameraFraming";
import { calculateFocusDestination } from "@/lib/cameraFocus";
import { createCameraTrajectory } from "@/lib/cameraTrajectory";
import { easeInOutCubic } from "@/lib/cameraEasing";
import { getConnectedNodes } from "@/lib/graph";
import { getSelectionFramingPositions } from "@/lib/cameraSelection";
import { applyCameraSafeArea } from "@/lib/cameraComposition";
import type { ScreenRect } from "@/types/camera";

import type {
    ConstellationEdge,
} from "@/types/constellation";

import type {
    ConstellationNodeData,
} from "@/types/constellation";

type Props = {
    nodes: ConstellationNodeData[];
    edges: ConstellationEdge[];
    selectedId: string | null;
    controlsRef: React.RefObject<OrbitControlsImpl | null>;
    panelRect: ScreenRect | null;
    overviewRequest: number;
    cameraFlightActiveRef: React.RefObject<boolean>;
};

type CameraFlight = {
    curve: THREE.QuadraticBezierCurve3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    elapsed: number;
    duration: number;
};

const FLIGHT_DURATION = 1.35;

export default function CinematicCameraController({
    nodes,
    edges,
    selectedId,
    controlsRef,
    panelRect,
    overviewRequest,
    cameraFlightActiveRef,
}: Props) {
    const { camera, size } = useThree();

    const flight = useRef<CameraFlight | null>(null);

    const lastSelectionRef = useRef<string | null | undefined>(undefined);

    const lastOverviewRequestRef = useRef(overviewRequest);

    const lastViewportRef = useRef({
        width: 0,
        height: 0,
    });

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

    const overviewFraming = useMemo(() => {
        // Shift the constellation upward on screen,
        // leaving room for the interaction hint.
        const verticalOffset =
            size.width >= 640 ? 0.45 : 0;

        return {
            ...framing,
            target: [
                framing.target[0],
                framing.target[1] - verticalOffset,
                framing.target[2],
            ] as [number, number, number],
            position: [
                framing.position[0],
                framing.position[1] - verticalOffset,
                framing.position[2],
            ] as [number, number, number],
        };
    }, [framing, size.width]);

    const selectedNode = useMemo(
        () => nodes.find((node) => node.id === selectedId),
        [nodes, selectedId]
    );


    const selectionPositions = useMemo(() => {
        if (!selectedId) return [];

        const connectedIds = getConnectedNodes(
            selectedId,
            edges
        );

        return getSelectionFramingPositions(
            selectedId,
            nodes,
            connectedIds
        );
    }, [selectedId, nodes, edges]);



    // Calculate and begin a new camera flight.
    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        const selectionChanged =
            lastSelectionRef.current !== selectedId;

        const viewportChanged =
            lastViewportRef.current.width !== size.width ||
            lastViewportRef.current.height !== size.height;

        const overviewRequested =
            lastOverviewRequestRef.current !== overviewRequest;

        // Ignore panel-only changes after initialization.
        if (
            initialized.current &&
            !selectionChanged &&
            !viewportChanged &&
            !overviewRequested
        ) {
            return;
        }

        lastSelectionRef.current = selectedId;
        lastOverviewRequestRef.current = overviewRequest;

        lastViewportRef.current = {
            width: size.width,
            height: size.height,
        };

        const baseDestination = selectedNode
            ? calculateFocusDestination(
                selectedNode,
                camera.position,
                controls.target,
                camera as THREE.PerspectiveCamera,
                selectionPositions
            )
            : overviewFraming;

        const destination = selectedNode
            ? applyCameraSafeArea(
                baseDestination,
                camera as THREE.PerspectiveCamera,
                size,
                panelRect
            )
            : baseDestination;

        const endPosition = new THREE.Vector3(
            ...destination.position
        );

        const endTarget = new THREE.Vector3(
            ...destination.target
        );

        const positionDistance =
            camera.position.distanceTo(endPosition);

        const targetDistance =
            controls.target.distanceTo(endTarget);

        if (
            initialized.current &&
            positionDistance < 0.01 &&
            targetDistance < 0.01
        ) {
            flight.current = null;
            cameraFlightActiveRef.current = false;
            return;
        }

        if (!initialized.current) {
            camera.position.copy(endPosition);
            controls.target.copy(endTarget);
            controls.update();

            initialized.current = true;
            cameraFlightActiveRef.current = false;
            return;
        }

        const startPosition = camera.position.clone();
        const startTarget = controls.target.clone();

        flight.current = {
            curve: createCameraTrajectory(
                startPosition,
                endPosition,
                camera,
                0.4
            ),
            startTarget,
            endTarget,
            elapsed: 0,
            duration: FLIGHT_DURATION,
        };
        cameraFlightActiveRef.current = true;
    }, [
        selectedId,
        selectedNode,
        selectionPositions,
        overviewFraming,
        camera,
        controlsRef,
        panelRect,
        size,
        overviewRequest,
        cameraFlightActiveRef,
    ]);

    // Allow the visitor to interrupt the flight.
    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        const interruptFlight = () => {
            flight.current = null;
            cameraFlightActiveRef.current = false;
        };

        controls.addEventListener("start", interruptFlight);

        return () => {
            controls.removeEventListener("start", interruptFlight);
        };
    }, [controlsRef, cameraFlightActiveRef]);

    // Advance the camera flight each frame.
    useFrame((_, delta) => {
        const controls = controlsRef.current;
        const activeFlight = flight.current;

        if (!controls || !activeFlight) return;

        activeFlight.elapsed += Math.min(delta, 0.05);

        const progress = Math.min(
            activeFlight.elapsed / activeFlight.duration,
            1
        );

        const easedProgress = easeInOutCubic(progress);

        camera.position.copy(
            activeFlight.curve.getPoint(easedProgress)
        );

        controls.target.lerpVectors(
            activeFlight.startTarget,
            activeFlight.endTarget,
            easedProgress
        );

        controls.update();

        if (progress >= 1) {
            flight.current = null;
            cameraFlightActiveRef.current = false;
        }
    });

    return null;
}
