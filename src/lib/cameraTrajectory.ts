
import * as THREE from "three";

/**
 * Creates a camera trajectory with a subtle
 * screen-space lateral arc.
 */
export function createCameraTrajectory(
    start: THREE.Vector3,
    end: THREE.Vector3,
    camera: THREE.Camera,
    curvature = 0.12
): THREE.QuadraticBezierCurve3 {
    const midpoint = start
        .clone()
        .add(end)
        .multiplyScalar(0.5);

    const direction = end.clone().sub(start);
    const distance = direction.length();

    // Camera-local right vector.
    const cameraRight = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(camera.quaternion);

    // Camera-local up vector.
    const cameraUp = new THREE.Vector3(0, 1, 0)
        .applyQuaternion(camera.quaternion);

    // Remove any component parallel to travel.
    const lateral = cameraRight.clone().addScaledVector(
        direction,
        -cameraRight.dot(direction) /
        Math.max(direction.lengthSq(), 0.000001)
    );

    // Fallback when movement is parallel to camera-right.
    if (lateral.lengthSq() < 0.000001) {
        lateral.copy(cameraUp).addScaledVector(
            direction,
            -cameraUp.dot(direction) /
            Math.max(direction.lengthSq(), 0.000001)
        );
    }

    if (lateral.lengthSq() < 0.000001) {
        lateral.set(0, 1, 0);
    }

    lateral.normalize();

    const offset = THREE.MathUtils.clamp(
        distance * curvature,
        0,
        3.0
    );

    const controlPoint = midpoint.addScaledVector(
        lateral,
        offset
    );

    return new THREE.QuadraticBezierCurve3(
        start.clone(),
        controlPoint,
        end.clone()
    );
}
