import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { MemoPlanetOrbit } from "./planetOrbit";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useRecoilValue } from "recoil";
import * as THREE from "three";
import { useQuery } from "react-query";

import { focusedObjectState } from "../atoms";
import { TrajectoryLine } from "./geometry/trajectoryLine";
import { PlanetOrbitLine } from "./geometry/planetOrbitLine";
import { SpaceshipManager } from "./spaceshipManager";
import { planetsInfo } from "../const";

export function SolarSystem() {
  const mesh = useRef();
  const { scene, controls, gl } = useThree();
  const sceneTexture = useLoader(TextureLoader, "milky_way.jpg");
  scene.background = sceneTexture;

  const {
    data: journeys,
    isLoading,
    error,
  } = useQuery(
    "journeys",
    () =>
      fetch(import.meta.env.VITE_BACKEND + "/voyage").then((data) =>
        data.json()
      ),
    { refetchInterval: 10000 }
  );
  const focusedObject = useRecoilValue(focusedObjectState);
  console.log(focusedObject);
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

  if (error || isLoading) return <mesh></mesh>;

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
      {planetsInfo.map((planet, index) => {
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
      {planetsInfo.map((planet, index) => {
        return <PlanetOrbitLine key={index} radius={planet.position} />;
      })}
    </mesh>
  );
}
