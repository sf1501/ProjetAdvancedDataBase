import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import * as THREE from "three";
import { PerspectiveCamera } from "@react-three/drei";

export function Planet({ planetName, size, position, planetRotationSpeed }) {
  const mesh = useRef();
  const planetTexture = useLoader(
    TextureLoader,
    planetName.toLowerCase() + ".jpg"
  );

  // Animation for the rotation of the planet
  useFrame((state, delta) => {
    mesh.current.rotation.y += planetRotationSpeed / 10;
  });
  return (
    <mesh
      ref={mesh}
      scale={new THREE.Vector3(size, size, size)}
      position={position}
      name={planetName}
    >
      <sphereGeometry args={[100]} />
      <meshBasicMaterial map={planetTexture} />
      <PerspectiveCamera
        name={"camera" + planetName}
        fov={45}
        far={10000000}
        near={0.5}
        aspect={window.innerWidth / window.innerHeight}
      />
    </mesh>
  );
}
