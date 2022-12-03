import React from "react";

export function PlanetList({ dataPlanets, setFocusedObject }) {
  return (
    <div className="planetList">
      {dataPlanets.map((planet, key) => (
        <span
          key={key}
          className="item"
          onClick={() => setFocusedObject(planet.name)}
        >
          {planet.name}
        </span>
      ))}
    </div>
  );
}
