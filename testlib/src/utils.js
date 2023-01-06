import * as THREE from "three";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { planetsList } from "./const";
dayjs.extend(customParseFormat);

export function timeStringToSeconds(timeString) {
  let tab = timeString.split(":");
  return tab[0] * 3600 + tab[1] * 60 + tab[2];
}

export function computeLine(line, originVector, destinationVector) {
  const points = [];
  points.push(originVector);
  points.push(destinationVector);

  line.geometry.setFromPoints(points);
  line.computeLineDistances();
}

export function timerToSeconds(timer) {
  return timer.hour() * 3600 + timer.minute() * 60 + timer.second();
}

export function progressiveTrajectory(spaceshipName, scene, timer) {
  const spaceshipObject = scene.getObjectByProperty("name", spaceshipName);
  let line = scene.getObjectByProperty(
    "name",
    spaceshipName + spaceshipObject.gare_depart + spaceshipObject.gare_arrive
  );

  if (spaceshipObject) {
    const spaceshipVector = new THREE.Vector3();

    const originPlanetObject = scene.getObjectByProperty(
      "name",
      planetsList[spaceshipObject.gare_depart]
    );
    const destinationPlanetObject = scene.getObjectByProperty(
      "name",
      planetsList[spaceshipObject.gare_arrive]
    );

    const originPlanetVector = new THREE.Vector3();
    const destinationPlanetVector = new THREE.Vector3();

    spaceshipObject.getWorldPosition(spaceshipVector);
    originPlanetObject.getWorldPosition(originPlanetVector);
    destinationPlanetObject.getWorldPosition(destinationPlanetVector);

    const destinationPlanetSpaceshipVector = new THREE.Vector3();
    const directionVector = new THREE.Vector3();

    destinationPlanetSpaceshipVector.subVectors(
      destinationPlanetVector,
      spaceshipVector
    );
    directionVector.subVectors(destinationPlanetVector, originPlanetVector);

    if (spaceshipObject.factor > 0.95) {
      scene.remove(spaceshipObject);
      scene.remove(line);
    } else {
      spaceshipObject.lookAt(destinationPlanetVector);

      const dayjsDepartureHour = dayjs(spaceshipObject.depart, "HH:mm:ss");
      const dayjsArrivalHour = dayjs(spaceshipObject.arrive, "HH:mm:ss");

      const factor =
        (timerToSeconds(timer) -
          timerToSeconds(dayjsDepartureHour) -
          spaceshipObject.delai) /
        (timerToSeconds(dayjsArrivalHour) - timerToSeconds(dayjsDepartureHour));

      spaceshipObject.position.x =
        originPlanetVector.x + directionVector.x * factor;
      spaceshipObject.position.z =
        originPlanetVector.z + directionVector.z * factor;

      spaceshipObject.factor = factor;
      spaceshipObject.updateMatrixWorld();
      spaceshipObject.updateWorldMatrix();

      computeLine(line, originPlanetVector, destinationPlanetVector);
    }
  }
}
