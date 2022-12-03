import * as THREE from "three";
import { planetsList } from "./const";

export function timeStringToSeconds(timeString) {
  let tab = timeString.split(":");
  return tab[0] * 3600 + tab[1] * 60 + tab[2];
}

export async function fetchJourneys(setJourneys) {
  fetch("journeys.json")
    .then((data) => data.json())
    .then((journeys) => {
      journeys.data.forEach((journey) => {
        if (journey.departure_hour.length === 7) {
          journey.departure_hour = "0" + journey.departure_hour;
        }
        if (journey.arrival_hour.length === 7) {
          journey.arrival_hour = "0" + journey.arrival_hour;
        }
      });
      setJourneys(journeys.data);
    });
}

export function doggyCurveTrajectory(spaceship, scene) {
  //TODO spaceship look at destination planet

  const targetObject = scene.getObjectByProperty("name", spaceship.target);
  const spaceshipObject = scene.getObjectByProperty("name", spaceship.name);

  const targetVector = new THREE.Vector3();
  const spaceshipVector = new THREE.Vector3();
  targetObject.getWorldPosition(targetVector);
  spaceshipObject.getWorldPosition(spaceshipVector);

  const directionVector = new THREE.Vector3();

  directionVector.subVectors(targetVector, spaceshipVector);

  if (Math.abs(directionVector.x) < 50 && Math.abs(directionVector.z) < 50) {
    scene.remove(spaceshipObject);
  }
  directionVector.normalize();

  if (spaceship) {
    spaceship.mesh.lookAt(targetVector);
    spaceship.mesh.position.x += directionVector.x * spaceship.speed;
    spaceship.mesh.position.z += directionVector.z * spaceship.speed;
  }
  // spaceship.mesh.updateMatrixWorld();
  // spaceship.mesh.updateWorldMatrix();
}

export function progressiveTrajectory(spaceshipName, scene, timer) {
  const spaceshipObject = scene.getObjectByProperty(
    "spaceship_number",
    spaceshipName
  );
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

    if (spaceshipObject.factor > 0.99) {
      scene.remove(spaceshipObject);
      scene.remove(line);
    } else {
      spaceshipObject.lookAt(destinationPlanetVector);

      const factor =
        (timeStringToSeconds(timer.format("HH:mm:ss")) -
          timeStringToSeconds(spaceshipObject.departure_hour) -
          spaceshipObject.delay) /
        (timeStringToSeconds(spaceshipObject.arrival_hour) -
          timeStringToSeconds(spaceshipObject.departure_hour));
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

  dataDeparturesFetched.forEach((journey) => {
    if (journey.departure_hour.length === 7) {
      journey.departure_hour = "0" + journey.departure_hour;
    }
    if (journey.arrival_hour.length === 7) {
      journey.arrival_hour = "0" + journey.arrival_hour;
    }
  });
  setDataDepartures(dataDeparturesFetched);
}

// export const zoomOnPlanet = (planetName) => {
//   const vector = new THREE.Vector3().setFromMatrixPosition(
//     scene.getObjectByProperty("name", planetName).matrixWorld
//   );
//   const zoomOutFactor = dataPlanets.find(
//     (planet) => planet.name === planetName
//   ).zoomout_factor;
//   const x = vector.x;
//   const y = vector.y;
//   const z = vector.z;
//   gsap
//     .timeline({ defaults: { duration: 1, ease: "expo.out" } })
//     .to(
//       camera.position,
//       { x: x + zoomOutFactor, y: y + zoomOutFactor, z: z + zoomOutFactor },
//       0
//     );
// };

// function addLine() {
//   const points = [];
//   const startPoint = new THREE.Vector3().setFromMatrixPosition(
//     earth.matrixWorld
//   );
//   const endPoint = new THREE.Vector3().setFromMatrixPosition(
//     mars.matrixWorld
//   );
//   points.push(startPoint);
//   points.push(endPoint);

//   lineGeometry.setFromPoints(points);
//   line.computeLineDistances();
// }

// function onDocumentMouseDown() {
// //On mouse down, creates a spaceship and pushes it in the list
// const spaceshipMaterial = new THREE.MeshBasicMaterial({
//   color: "orange",
// });
// const spaceship = new THREE.Mesh(
//   new THREE.SphereGeometry(10),
//   spaceshipMaterial
// );
// const startPosition = new THREE.Vector3().setFromMatrixPosition(
//   earth.matrixWorld
// );
// spaceship.position.x = startPosition.x;
// spaceship.position.y = startPosition.y;
// spaceship.position.z = startPosition.z;
// spaceshipsList.push({
//   mesh: spaceship,
//   target: mars,
//   speed: 2,
// });
// scene.add(spaceship);
// }

// function trajectoryComputing(spaceship_speed) {
//   let deltaPhi = 0.01;
//   let precision = 2;
//   let minimum = 1000;

//   for (let i = 0; i < 360; i += deltaPhi) {
//     for (let j = 0; j < 1000; j++) {
//       let x_mars = 1000 * Math.cos(mars_rotation_speed * (frame + j));
//       let y_mars = 1000 * Math.sin(mars_rotation_speed * (frame + j));

//       let x_spaceship =
//         200 * Math.cos(earth_rotation_speed * frame) +
//         spaceship_speed * j * Math.cos(i * (Math.PI / 180));
//       let y_spaceship =
//         200 * Math.sin(earth_rotation_speed * frame) +
//         spaceship_speed * j * Math.sin(i * (Math.PI / 180));

//       let distance = Math.sqrt(
//         (x_mars - x_spaceship) ** 2 + (y_mars - y_spaceship) ** 2
//       );
//       if (distance < minimum) {
//         minimum = distance;
//       }
//     }
//   }
//   return [minimum];
// }
