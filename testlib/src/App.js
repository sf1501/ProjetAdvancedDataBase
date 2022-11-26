import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import data from "./data.json";
import {
  createCamera,
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
  const [controls, setControls] = useState();
  const [camera, setCamera] = useState();
  const [scene, setScene] = useState();

  const dataPlanets = data.planets;

  const zoomInTimeline = (planetName, zoomOutFactor = 400) => {
    const mesh = scene.getObjectByProperty("name", planetName);
    const x = mesh.position.x;
    const y = mesh.position.y;
    const z = mesh.position.z;
    let tl = gsap
      .timeline({ defaults: { duration: 1.5, ease: "expo.out" } })
      .to(controls.target, { x, y, z })
      .to(camera.position, { x, y, z: z + zoomOutFactor }, 0);
  };

  useEffect(() => {
    const { current: container } = refContainer;
    let frame = 1;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.TextureLoader().load("milky_way.jpg");

    const camera = createCamera();
    scene.add(camera);
    const planetarySystem = createPlanetarySystem(dataPlanets);
    scene.add(planetarySystem);

    const target = new THREE.Vector3(0, 0, 0);
    camera.position.z = 3000;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.target = target;
    let spaceshipsList = createSpaceshipsList();
    let travelingSpaceshipsList = [];

    // Animation
    renderer.setAnimationLoop(() => {
      // Planets animation
      for (let i = 0; i < planetarySystem.children.length; i++) {
        // planetarySystem.children[i].rotation.z +=
        //   dataPlanets[i].rotation_speed / 60;
        planetarySystem.children[i].children[0].rotation.y += 0.01;
      }
      spaceshipsList.forEach((spaceship) => {
        if (spaceship.launch_date === frame) {
          const originMesh = planetarySystem.children.find(
            (orbit) => orbit.children[0].name === spaceship.origin
          ).children[0];
          const originPosition = new THREE.Vector3().setFromMatrixPosition(
            originMesh.matrixWorld
          );

          spaceship.mesh.position.x = originPosition.x;
          spaceship.mesh.position.y = originPosition.y;
          spaceship.mesh.position.Z = originPosition.z;

          scene.add(spaceship.mesh);
          travelingSpaceshipsList.push(spaceship);
        }
      });

      // Spaceships animation
      travelingSpaceshipsList.forEach((spaceship) =>
        doggyCurveTrajectory(spaceship, scene)
      );

      // Delete spaceships which arrived at destination
      travelingSpaceshipsList = travelingSpaceshipsList.filter(
        (spaceship) =>
          scene.getObjectByProperty("uuid", spaceship.mesh.uuid) !== undefined
      );

      frame += 1;

      setDisplayedFrame((state) => (state += 1));
      setControls(controls);
      setCamera(camera);
      setScene(scene);

      renderer.render(scene, camera);
    });

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ display: "flex" }} ref={refContainer}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "white",
        }}
      >
        <span>Temps d'execution: {Math.ceil(displayedFrame / 60)} s</span>
        <ul>
          {dataPlanets.map((planet) => (
            <li onClick={() => zoomInTimeline(planet.name)}>{planet.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
