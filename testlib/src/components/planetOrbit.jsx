import React, { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Planet } from "./planet";

export function PlanetOrbit({
  planetName,
  size,
  position,
  planetRotationSpeed,
  orbitRotationSpeed,
}) {
  const mesh = useRef();

  // Animation for the rotation of the planet around the Sun
  useFrame(
    (state, delta) => (mesh.current.rotation.y += orbitRotationSpeed / 600)
  );

  return (
    <mesh ref={mesh}>
      <Planet
        planetName={planetName}
        size={size}
        position={position}
        planetRotationSpeed={planetRotationSpeed}
      />
    </mesh>
  );
}

export const MemoPlanetOrbit = memo(PlanetOrbit);
