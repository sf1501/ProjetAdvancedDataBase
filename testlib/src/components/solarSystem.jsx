import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { memo, useEffect, useRef, useState } from "react";
import { PlanetOrbit } from "./planetOrbit";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { fetchJourneys } from "../utils";
import { Model } from "./spaceship";
import { useRecoilValue } from "recoil";
import { focusedObjectState } from "../atoms";
import * as THREE from "three";
import { TrajectoryLine } from "./geometry/trajectoryLine";
import { PlanetOrbitLine } from "./geometry/planetOrbitLine";

export function SolarSystem({ dataPlanets }) {
  const mesh = useRef();
  const { camera, scene, controls } = useThree();
  const sceneTexture = useLoader(TextureLoader, "milky_way.jpg");
  scene.background = sceneTexture;

  const [journeys, setJourneys] = useState([]);
  const focusedObject = useRecoilValue(focusedObjectState);

  useEffect(() => {
    fetchJourneys(setJourneys);
  }, []);

  useFrame((state, delta) => {
    if (focusedObject !== "") {
      const objectFromScene = scene.getObjectByProperty("name", focusedObject);
      if (objectFromScene.isObject3D) {
        const focusedObjectVector = new THREE.Vector3();
        objectFromScene.getWorldPosition(focusedObjectVector);

        let scaleFactor = objectFromScene.name.length > 10 ? 20 : 200;

        controls.target = focusedObjectVector;
        camera.position.x =
          focusedObjectVector.x + objectFromScene.scale.x * scaleFactor;
        camera.position.y =
          focusedObjectVector.y + objectFromScene.scale.y * scaleFactor;
        camera.position.z =
          focusedObjectVector.z + objectFromScene.scale.z * scaleFactor;

        controls.update();
      }
    }
  });

  return (
    <mesh ref={mesh}>
      {journeys.map((journey) => (
        <Model
          idJourney={journey.id}
          name={journey.spaceship_number}
          spaceship_number={journey.spaceship_number}
          origin={journey.origin}
          destination={journey.destination}
          departure_hour={journey.departure_hour}
          arrival_hour={journey.arrival_hour}
          delay={journey.delay}
        />
      ))}
      {journeys.map((journey) => (
        <TrajectoryLine
          spaceshipName={journey.spaceship_number}
          spaceshipOrigin={journey.origin}
          spaceshipDestination={journey.destination}
        />
      ))}
      {dataPlanets.map((planet, key) => {
        let position = [];
        const randomAngle = Math.random() * 2 * Math.PI;
        position.push(planet.position * Math.sin(randomAngle));
        position.push(0);
        position.push(planet.position * Math.cos(randomAngle));

        return (
          <PlanetOrbit
            key={key}
            planetName={planet.name}
            size={planet.size}
            position={position}
            orbitRotationSpeed={planet.orbit_rotation_speed}
            planetRotationSpeed={planet.self_rotation_speed}
          />
        );
      })}
      {dataPlanets.map((planet, key) => {
        return <PlanetOrbitLine key={key} radius={planet.position} />;
      })}
    </mesh>
  );
}

export const MemoSolarSystem = memo(SolarSystem);
