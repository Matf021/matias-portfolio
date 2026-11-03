
export default function ConstellationLighting() {
    return (
        <>
            {/* Low-level illumination across all nodes */}
            <ambientLight
                color="#b8caff"
                intensity={0.35}
            />

            {/* Primary directional light */}
            <directionalLight
                position={[-6, 9, 12]}
                color="#e4eeff"
                intensity={1.1}
            />

            {/* Cooler, weaker secondary light */}
            <directionalLight
                position={[8, -4, -6]}
                color="#719dff"
                intensity={0.35}
            />
        </>
    );
}
