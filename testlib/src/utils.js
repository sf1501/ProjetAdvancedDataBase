import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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

    planet.name = plt.name;
    planet.position.x = plt.position.x;
    planet.position.y = plt.position.y;
    planet.position.z = plt.position.z;
    planet.scale.setScalar(plt.size);

    const planetOrbit = new THREE.Mesh();
    planetOrbit.add(planet);

    solarSystem.add(planetOrbit);
  }

  return solarSystem;
}

export function createPlanetaryOrbits(dataPlanets) {
  const orbitSystem = new THREE.Object3D();

  for (let plt of dataPlanets) {
    const circle = orbitLine(plt.position.x);
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

export function createSpaceshipsList() {
  const loader = new GLTFLoader();

  let spaceshipObject = new THREE.Group();

  let queue = [];
  const planetsList = [
    "Earth",
    "Mars",
    "Saturn",
    "Mercury",
    "Jupiter",
    "Uranus",
    "Neptune",
    "Venus",
  ];

  loader.load(
    "free_spaceship.glb",
    (gltf) => {
      spaceshipObject = gltf.scene;
      spaceshipObject.scale.setScalar(0.2);

      for (let i = 0; i < 10; i++) {
        const newSpaceship = spaceshipObject.clone();
        newSpaceship.name = "Orion" + i;

        queue.push({
          name: "Orion" + i,
          mesh: newSpaceship,
          origin: planetsList[Math.floor(Math.random() * planetsList.length)],
          target: planetsList[Math.floor(Math.random() * planetsList.length)],
          speed: 50,
          launch_date: Math.floor(Math.random() * 10000 + 1),
        });
      }
      queue.sort(
        (spaceshipA, spaceshipB) =>
          spaceshipA.launch_date - spaceshipB.launch_date
      );
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );

  return queue;
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
