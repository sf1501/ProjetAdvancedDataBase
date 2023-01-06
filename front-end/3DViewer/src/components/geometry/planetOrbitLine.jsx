import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function PlanetOrbitLine({ radius }) {
  const mesh = useRef();

  let geometry = new THREE.BufferGeometry().setFromPoints(
    new THREE.Path().absarc(0, 0, radius, 0, Math.PI * 2).getSpacedPoints(5000)
  );

  useEffect(() => {
    mesh.current.rotation.x = Math.PI / 2;
  }, []);

  return (
    <line ref={mesh} geometry={geometry}>
      <lineBasicMaterial color={"white"} />
    </line>
  );
}
