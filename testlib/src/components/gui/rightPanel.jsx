import { PlanetList } from "./planetList";

export function RightPanel({ dataPlanets, setFocusedObject, timer }) {
  return (
    <div className="rightPanel">
      <span>Timer: {timer.format("HH:mm:ss")}</span>
      <PlanetList
        dataPlanets={dataPlanets}
        setFocusedObject={setFocusedObject}
      />
    </div>
  );
}
