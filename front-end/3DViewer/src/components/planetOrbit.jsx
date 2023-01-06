import React, { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Planet } from "./planet";
import { planetsInfo } from "../const";

export function PlanetOrbit({
  planetName,
  size,
  planetRotationSpeed,
  orbitRotationSpeed,
}) {
  const mesh = useRef();

  // Animation for the rotation of the planet around the Sun
  useFrame(
    (state, delta) => (mesh.current.rotation.y += orbitRotationSpeed / 600)
  );

  const currentPlanet = planetsInfo.find(
    (planet) => planet.name === planetName
  );

  let position = [];
  const randomAngle = Math.random() * 2 * Math.PI;
  position.push(currentPlanet.position * Math.sin(randomAngle));
  position.push(0);
  position.push(currentPlanet.position * Math.cos(randomAngle));

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
