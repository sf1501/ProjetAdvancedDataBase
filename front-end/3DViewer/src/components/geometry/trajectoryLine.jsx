import React, { useRef } from "react";
import * as THREE from "three";

export function TrajectoryLine({
  spaceshipName,
  spaceshipOrigin,
  spaceshipDestination,
}) {
  const mesh = useRef();

  let geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
  ]);

  return (
    <line
      ref={mesh}
      geometry={geometry}
      name={spaceshipName + spaceshipOrigin + spaceshipDestination}
    >
      <lineDashedMaterial
        color={"white"}
        linewidth={1}
        scale={1}
        dashSize={50}
        gapSize={50}
      />
    </line>
  );
}
