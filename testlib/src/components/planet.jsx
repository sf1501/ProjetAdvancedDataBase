import React, { useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useRecoilValue } from "recoil";
import { timerState } from "../atoms";
import { useEffect } from "react";
import { planetsList } from "../const";
import {
  fetchDepartureJourneysByPlanetId,
  progressiveTrajectory,
} from "../utils";
import * as THREE from "three";

export function Planet({ planetName, size, position, planetRotationSpeed }) {
  const mesh = useRef();
  const planetTexture = useLoader(
    TextureLoader,
    planetName.toLowerCase() + ".jpg"
  );
  const { scene } = useThree();
  const [dataDepartures, setDataDepartures] = useState([]);
  const [travelingSpaceshipsList, setTravelingSpaceshipList] = useState([]);
  const timer = useRecoilValue(timerState);

  useEffect(() => {
    fetchDepartureJourneysByPlanetId(
      planetsList.indexOf(planetName),
      setDataDepartures
    );
  }, [planetName]);

  // Animation for the spaceships which departed from the planet
  useFrame((state, delta) => {
    for (let departure of dataDepartures) {
      if (timer.format("HH:mm:ss") === departure.departure_hour) {
        setTravelingSpaceshipList((state) => {
          let newTab = state;
          newTab.push(departure.spaceship_number);
          return newTab;
        });
      }
    }
    travelingSpaceshipsList.forEach((spaceshipName) =>
      progressiveTrajectory(spaceshipName, scene, timer)
    );
  });

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
    </mesh>
  );
}
