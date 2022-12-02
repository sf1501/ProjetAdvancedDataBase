import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { planetsList } from "./const";
dayjs.extend(customParseFormat);

export function orbitLine(radius, y = 0) {
  let geometry = new THREE.BufferGeometry().setFromPoints(
    new THREE.Path().absarc(0, 0, radius, 0, Math.PI * 2).getSpacedPoints(5000)
  );

  let material = new THREE.LineBasicMaterial({ color: "white" });

  let line = new THREE.Line(geometry, material);
  line.rotation.x = Math.PI / 2;

  return line;
}

export function createPlanetarySystem(dataPlanets) {
  const solarSystem = new THREE.Object3D();

  for (let plt of dataPlanets) {
    const planetTexture = new THREE.TextureLoader().load(plt.texture_url);
    const planetMaterial = new THREE.MeshBasicMaterial({
      map: planetTexture,
    });
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(1), //size = radius
      planetMaterial
    );
    const randomAngle = Math.random() * 2 * Math.PI;
    planet.name = plt.name;
    planet.position.x = plt.position * Math.sin(randomAngle);
    planet.position.y = 0;
    planet.position.z = plt.position * Math.cos(randomAngle);
    planet.scale.setScalar(plt.size * 50);

    const planetOrbit = new THREE.Mesh();
    planetOrbit.add(planet);

    solarSystem.add(planetOrbit);
  }

  return solarSystem;
}

export function createPlanetaryOrbits(dataPlanets) {
  const orbitSystem = new THREE.Object3D();

  for (let plt of dataPlanets) {
    const circle = orbitLine(plt.position);
    orbitSystem.add(circle);
  }

  return orbitSystem;
}

export function createCamera() {
  return new THREE.PerspectiveCamera(
    45, // FOV
    window.innerWidth / window.innerHeight, // Aspect
    0.5, // near
    10000000 // far
  );
}

export async function createSpaceshipsList(scene) {
  const loader = new GLTFLoader();
  let spaceshipObject = new THREE.Group();

  loader.load(
    "free_spaceship.glb",
    (gltf) => {
      spaceshipObject = gltf.scene;
      spaceshipObject.scale.setScalar(10);

      fetch("journeys.json")
        .then((data) => data.json())
        .then((journeys) => {
          journeys = journeys.data;

          // Generate all spaceships 3D objects
          for (let i = 0; i < journeys.length - 99; i++) {
            const newSpaceship = spaceshipObject.clone();

            newSpaceship.idJourney = journeys[i].id;
            newSpaceship.name = journeys[i].spaceship_number;
            newSpaceship.origin = journeys[i].origin;
            newSpaceship.destination = journeys[i].destination;
            newSpaceship.departure_hour = journeys[i].departure_hour;
            newSpaceship.arrival_hour = journeys[i].arrival_hour;
            newSpaceship.delay = journeys[i].delay;
            newSpaceship.factor = 0;
            scene.add(newSpaceship);
          }
        });
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );
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

export function computeLine(line, originVector, destinationVector) {
  const points = [];
  points.push(originVector);
  points.push(destinationVector);

  line.geometry.setFromPoints(points);
  line.computeLineDistances();
}

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
