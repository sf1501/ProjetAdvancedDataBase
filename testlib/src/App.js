import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dayjs from "dayjs";

import data from "./data.json";
import InfoPlanet from "./infoPlanet";
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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  let refContainer = useRef();
  const [globalTimer, setGlobalTimer] = useState(dayjs());
  const [globalFocusedObject, setGlobalFocusedObject] = useState("");
  const [spaceshipsList, setSpaceshipsList] = useState([]);

  const dataPlanets = data.planets;

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

  useEffect(() => {
    const { current: container } = refContainer;
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

    createSpaceshipsList(scene);
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
    document.getElementById("info")?.addEventListener("wheel", (event) => {
      event.stopPropagation();
    });
    document.getElementById("container").addEventListener("wheel", (event) => {
      event.stopPropagation();
      zoomOutFactor += event.deltaY / 50;
    });

    setGlobalTimer(dayjs().hour(7).minute(0).second(0));
    let timer = dayjs().hour(7).minute(0).second(0);

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
      // console.log(scene.getObjectByName("spaceshipsGroup"));
      scene.children.forEach((spaceship) => {
        if (spaceship.departure_hour === timer.format("HH:mm")) {
          console.log(
            "blast off !",
            timer.format("HH:mm"),
            spaceship.departure_hour
          );
          const originMesh = scene.getObjectByProperty(
            "name",
            planetsList[spaceship.origin]
          );
          const originPosition = new THREE.Vector3();
          originMesh.getWorldPosition(originPosition);

          spaceship.position.x = originPosition.x;
          spaceship.position.y = originPosition.y;
          spaceship.position.z = originPosition.z;
          spaceship.updateMatrixWorld();
          spaceship.updateWorldMatrix();
          console.log(spaceship.position);
          focusedObject = spaceship.name;
          // travelingSpaceshipsList.push(spaceship);
        }
      });

      // Spaceships animation
      travelingSpaceshipsList.forEach((spaceship) =>
        doggyCurveTrajectory(spaceship, scene)
      );

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
      setGlobalFocusedObject(focusedObject);

      timer = dayjs(timer).add(1, "s");
      setGlobalTimer(dayjs(timer).add(1, "s"));

      renderer.render(scene, camera);
    });

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {planetsList.find((planet) => planet === globalFocusedObject) ? (
        <InfoPlanet id={planetsList.indexOf(globalFocusedObject)} />
      ) : null}
      <span id="focusedObject" className="planetName"></span>
      <div className="rightPanel">
        <span>Timer: {globalTimer.format("HH:mm")}</span>
        <div className="planetList">
          {dataPlanets.map((planet) => (
            <span id={planet.name} className="item">
              {planet.name}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex" }} ref={refContainer} id="container"></div>
    </ThemeProvider>
  );
}

export default App;
