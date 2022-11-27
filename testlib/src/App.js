import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import data from "./data.json";
import {
  createCamera,
  createPlanetaryOrbits,
  createPlanetarySystem,
  createSpaceshipsList,
  doggyCurveTrajectory,
} from "./utils";

// ^ Y
// |
// |
// |
// |
// |
// ---------> X
function App() {
  let refContainer = useRef();
  const [displayedFrame, setDisplayedFrame] = useState(1);

  const dataPlanets = data.planets;

  useEffect(() => {
    const { current: container } = refContainer;
    let frame = 1;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.TextureLoader().load("milky_way.jpg");

    const ambientLight = new THREE.AmbientLight(0xffffff, 30);
    scene.add(ambientLight);

    const camera = createCamera();
    scene.add(camera);

    const planetarySystem = createPlanetarySystem(dataPlanets);
    scene.add(planetarySystem);

    const orbitSystem = createPlanetaryOrbits(dataPlanets);
    scene.add(orbitSystem);

    const target = new THREE.Vector3(0, 0, 0);
    camera.position.x = 17000;
    camera.position.y = 4400;
    camera.position.z = 8900;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = target;

    let spaceshipsList = createSpaceshipsList();

    let travelingSpaceshipsList = [];

    let focusedObject = "";
    let zoomOutFactor = 0;

    //Bind
    for (let plt of dataPlanets) {
      document.getElementById(plt.name).addEventListener("click", () => {
        document.getElementById("focusedObject").innerHTML = plt.name;
        focusedObject = plt.name;
      });
    }
    document.addEventListener("wheel", (event) => {
      zoomOutFactor += event.deltaY / 50;
    });

    const spaceshipList = document.getElementById("spaceshipList");

    // Animation
    renderer.setAnimationLoop(() => {
      // Planets animation
      for (let i = 0; i < planetarySystem.children.length; i++) {
        planetarySystem.children[i].rotation.y +=
          dataPlanets[i].orbit_rotation_speed / 60;
        planetarySystem.children[i].children[0].rotation.y +=
          dataPlanets[i].self_rotation_speed / 10;
      }

      // Spaceships launch
      spaceshipsList.forEach((spaceship) => {
        if (spaceship.launch_date === frame) {
          const originMesh = scene.getObjectByProperty(
            "name",
            spaceship.origin
          );
          const originPosition = new THREE.Vector3();
          originMesh.getWorldPosition(originPosition);

          spaceship.mesh.position.x = originPosition.x;
          spaceship.mesh.position.y = originPosition.y;
          spaceship.mesh.position.z = originPosition.z;
          spaceship.mesh.updateMatrixWorld();
          spaceship.mesh.updateWorldMatrix();

          scene.add(spaceship.mesh);

          travelingSpaceshipsList.push(spaceship);
        }
      });

      // Spaceships animation
      travelingSpaceshipsList.forEach((spaceship) =>
        doggyCurveTrajectory(spaceship, scene)
      );
      spaceshipList.innerHTML = "";
      for (let spaceship of travelingSpaceshipsList) {
        spaceshipList.innerHTML +=
          "<span class='item' id='" +
          spaceship.name +
          "'>" +
          spaceship.name +
          "</span>";
        document
          .getElementById(spaceship.name)
          .addEventListener("mousedown", () => {
            document.getElementById("focusedObject").innerHTML = spaceship.name;
            focusedObject = spaceship.name;
          });
      }

      // Delete spaceships when they arrived at destination
      travelingSpaceshipsList = travelingSpaceshipsList.filter(
        (spaceship) =>
          scene.getObjectByProperty("uuid", spaceship.mesh.uuid) !== undefined
      );

      if (focusedObject !== "") {
        const objectOnScene = scene.getObjectByProperty("name", focusedObject);
        if (objectOnScene) {
          const vector = new THREE.Vector3();
          const scale = new THREE.Vector3();

          objectOnScene.getWorldPosition(vector);
          objectOnScene.getWorldScale(scale);

          controls.target = vector;
          camera.position.x =
            vector.x + objectOnScene.scale.x * 10 + zoomOutFactor;
          camera.position.y =
            vector.y + objectOnScene.scale.y * 10 + zoomOutFactor;
          camera.position.z =
            vector.z + objectOnScene.scale.z * 10 + zoomOutFactor;

          controls.update();
        }
      }

      setDisplayedFrame((state) => (state += 1));
      renderer.render(scene, camera);

      frame += 1;
    });

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ display: "flex" }} ref={refContainer}>
      <span id="focusedObject" className="planetName"></span>
      <div className="rightPanel">
        <span>Temps d'execution: {Math.ceil(displayedFrame / 60)} s</span>
        <div className="planetList">
          {dataPlanets.map((planet) => (
            <span id={planet.name} className="item">
              {planet.name}
            </span>
          ))}
        </div>
        <div id="spaceshipList" className="planetList"></div>
      </div>
    </div>
  );
}

export default App;
