import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { memo, useRef } from "react";
import { MemoPlanetOrbit } from "./planetOrbit";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useRecoilValue } from "recoil";
import * as THREE from "three";
import { useQuery } from "react-query";

import { focusedObjectState } from "../atoms";
import { TrajectoryLine } from "./geometry/trajectoryLine";
import { PlanetOrbitLine } from "./geometry/planetOrbitLine";
import { SpaceshipManager } from "./spaceshipManager";

export function SolarSystem({ dataPlanets }) {
  const mesh = useRef();
  const { scene, controls, gl } = useThree();
  const sceneTexture = useLoader(TextureLoader, "milky_way.jpg");
  scene.background = sceneTexture;

  const { data: journeys } = useQuery(
    "journeys",
    () =>
      fetch(process.env.VITE_BACKEND + "/voyages")
        .then((data) => data.json())
        .then((data) => data.slice(0, 20)),
    { refetchInterval: 10000 }
  );
  const focusedObject = useRecoilValue(focusedObjectState);

  useFrame((state, delta) => {
    if (focusedObject !== "") {
      const objectFromScene = scene.getObjectByProperty("name", focusedObject);
      if (objectFromScene.isObject3D) {
        const focusedObjectVector = new THREE.Vector3();
        objectFromScene.getWorldPosition(focusedObjectVector);
        gl.render(
          scene,
          objectFromScene.getObjectByProperty(
            "name",
            "camera" + objectFromScene.name
          )
        );
        controls.target = focusedObjectVector;
        controls.update();
      }
    }
  });

  return (
    <mesh ref={mesh}>
      {journeys.map((journey, index) => (
        <SpaceshipManager key={index} journey={journey} />
      ))}
      {journeys.map((journey, index) => (
        <TrajectoryLine
          key={index}
          spaceshipName={journey.nom_voyage}
          spaceshipOrigin={journey.gare_depart}
          spaceshipDestination={journey.gare_arrive}
        />
      ))}
      {dataPlanets.map((planet, index) => {
        return (
          <MemoPlanetOrbit
            key={index}
            planetName={planet.name}
            size={planet.size}
            orbitRotationSpeed={planet.orbit_rotation_speed}
            planetRotationSpeed={planet.self_rotation_speed}
          />
        );
      })}
      {dataPlanets.map((planet, index) => {
        return <PlanetOrbitLine key={index} radius={planet.position} />;
      })}
    </mesh>
  );
}

export const MemoSolarSystem = memo(SolarSystem);
