import * as THREE from "three";

export function createPlanetarySystem(dataPlanets) {
  const solarSystem = new THREE.Object3D();

  for (let plt of dataPlanets) {
    const planetTexture = new THREE.TextureLoader().load(plt.texture_url);
    const planetMaterial = new THREE.MeshBasicMaterial({
      map: planetTexture,
    });
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(plt.size), //size = radius
      planetMaterial
    );

    planet.name = plt.name;
    planet.position.x = plt.position.x;
    planet.position.y = plt.position.y;
    planet.position.z = plt.position.z;

    const planetOrbit = new THREE.Mesh();

    planetOrbit.add(planet);

    solarSystem.add(planetOrbit);
  }

  return solarSystem;
}

export function createCamera() {
  return new THREE.PerspectiveCamera(
    45, // FOV
    window.innerWidth / window.innerHeight, // Aspect
    0.5, // near
    10000 // far
  );
}

export function createSpaceshipsList() {
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

  for (let i = 0; i < 100; i++) {
    queue.push({
      mesh: new THREE.Mesh(
        new THREE.SphereGeometry(10),
        new THREE.MeshBasicMaterial({
          color: "orange",
        })
      ),
      origin: planetsList[Math.floor(Math.random() * planetsList.length)],
      target: planetsList[Math.floor(Math.random() * planetsList.length)],
      speed: 2,
      launch_date: Math.floor(Math.random() * 10000 + 1),
    });
  }
  queue.sort(
    (spaceshipA, spaceshipB) => spaceshipA.launch_date - spaceshipB.launch_date
  );
  return queue;
}

export function doggyCurveTrajectory(spaceship, scene) {
  const targetVector = new THREE.Vector3().setFromMatrixPosition(
    scene.getObjectByProperty("name", spaceship.target).matrixWorld
  );
  const directionVector = new THREE.Vector3();

  directionVector.subVectors(
    targetVector,
    new THREE.Vector3().setFromMatrixPosition(spaceship.mesh.matrixWorld)
  );

  if (Math.abs(directionVector.x) < 5 && Math.abs(directionVector.y) < 5) {
    const parent = spaceship.mesh.parent;
    const object = scene.getObjectByProperty("uuid", spaceship.mesh.uuid);
    object.geometry.dispose();
    object.material.dispose();
    parent.remove(object);
  }
  directionVector.normalize();
  if (spaceship) {
    spaceship.mesh.position.x += directionVector.x * spaceship.speed;
    spaceship.mesh.position.y += directionVector.y * spaceship.speed;
  }
}

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
