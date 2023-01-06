import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { SolarSystem } from "./solarSystem";

import * as THREE from "three";

export function MyCanvas() {
  return (
    <Canvas
      onWheel={(event) => {
        event.stopPropagation();
        // setZoomFactor((state) => (state += event.deltaY));
      }}
    >
      <ambientLight args={[0xffffff, 30]} />
      <PerspectiveCamera
        makeDefault
        position={[17000, 4400, 1.8]}
        fov={45}
        far={10000000}
        near={0.5}
        aspect={window.innerWidth / window.innerHeight}
      />
      <OrbitControls makeDefault target={new THREE.Vector3(0, 0, 0)} />
      <SolarSystem />
    </Canvas>
  );
}
