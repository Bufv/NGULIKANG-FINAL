import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, Stars } from '@react-three/drei';

const AbstractShape = (props) => {
    const mesh = useRef();

    useFrame((state) => {
        mesh.current.rotation.x += 0.005;
        mesh.current.rotation.y += 0.005;
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh ref={mesh} {...props}>
                <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={5}
                    thickness={2}
                    roughness={0}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={0.4} // This gives the "premium" rainbow edge look
                    anisotropy={0.5}
                    distortion={0.5}
                    distortionScale={0.5}
                    temporalDistortion={0.2}
                    color="#FF8C42" // Orange tint
                />
            </mesh>
        </Float>
    );
};

const ConnectingOrbs = () => {
    return (
        <group>
            {[...Array(5)].map((_, i) => (
                <Float key={i} speed={1.5} rotationIntensity={1} floatIntensity={3} position={[
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 5,
                    (Math.random() - 0.5) * 5 - 2
                ]}>
                    <mesh scale={0.2 + Math.random() * 0.3}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color={Math.random() > 0.5 ? "#FF8C42" : "#ffffff"} emissive={Math.random() > 0.5 ? "#DA5500" : "#555555"} emissiveIntensity={2} roughness={0.2} metalness={0.8} />
                    </mesh>
                </Float>
            ))}
        </group>
    )
}

const Scene3D = () => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <color attach="background" args={['#1a1a1a']} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#FF8C42" />

                {/* Content */}
                <group position={[2, 0, 0]}> {/* Offset to the right slightly */}
                    <AbstractShape scale={1.2} />
                </group>

                <ConnectingOrbs />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Environment for reflections */}
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default Scene3D;
