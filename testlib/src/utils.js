import * as THREE from "three";
import dayjs from "dayjs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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

export async function fetchDataForPlanet(id) {
  let dataFetched = await fetch("journeys.json");
  dataFetched = await dataFetched.json();
  dataFetched = dataFetched.data;

  dataFetched.forEach((journey) => {
    journey.origin = planetsList[journey.origin];

    journey.destination = planetsList[journey.destination];
  });
  let dataDeparturesFetched = dataFetched
    .filter((journey) => journey.origin === planetsList[id])
    .sort(
      (journeyA, journeyB) =>
        parseInt(journeyA.departure_hour) - parseInt(journeyB.departure_hour)
    );
  let dataArrivalsFetched = dataFetched
    .filter((journey) => journey.destination === planetsList[id])
    .sort(
      (journeyA, journeyB) =>
        parseInt(journeyA.arrival_hour) - parseInt(journeyB.arrival_hour)
    );

  return [dataDeparturesFetched, dataArrivalsFetched];
}

export async function fetchDepartureJourneysByPlanetId(id, setDataDepartures) {
  let dataFetched = await fetch("journeys.json");
  dataFetched = await dataFetched.json();
  dataFetched = dataFetched.data;

  dataFetched.forEach((journey) => {
    journey.origin = planetsList[journey.origin];

    journey.destination = planetsList[journey.destination];
  });

  const dataDeparturesFetched = dataFetched
    .filter((journey) => journey.origin === planetsList[id])
    .sort(
      (journeyA, journeyB) =>
        parseInt(journeyA.departure_hour) - parseInt(journeyB.departure_hour)
    );
  setDataDepartures(dataDeparturesFetched);
}

export function timerToSeconds(timer) {
  return timer.hour() * 3600 + timer.minute() * 60 + timer.second();
}

export function progressiveTrajectory(spaceshipName, scene, timer) {
  const spaceshipObject = scene.getObjectByProperty("name", spaceshipName);
  let line = scene.getObjectByProperty(
    "name",
    spaceshipName + spaceshipObject.origin + spaceshipObject.destination
  );

  if (spaceshipObject) {
    const spaceshipVector = new THREE.Vector3();

    const originPlanetObject = scene.getObjectByProperty(
      "name",
      planetsList[spaceshipObject.origin]
    );
    const destinationPlanetObject = scene.getObjectByProperty(
      "name",
      planetsList[spaceshipObject.destination]
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

    if (spaceshipObject.factor > 0.995) {
      scene.remove(spaceshipObject);
      scene.remove(line);
    } else {
      spaceshipObject.lookAt(destinationPlanetVector);

      const dayjsDepartureHour = dayjs(
        spaceshipObject.departure_hour,
        "HH:mm:ss"
      );
      const dayjsArrivalHour = dayjs(spaceshipObject.arrival_hour, "HH:mm:ss");

      const factor =
        (timerToSeconds(timer) -
          timerToSeconds(dayjsDepartureHour) -
          spaceshipObject.delay) /
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
