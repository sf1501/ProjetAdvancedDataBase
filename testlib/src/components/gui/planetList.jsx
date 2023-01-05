import React from "react";
import { useSetRecoilState } from "recoil";
import { focusedObjectState } from "../../atoms";
import { planetsInfo } from "../../const";

export function PlanetList() {
  const setFocusedObject = useSetRecoilState(focusedObjectState);
  return (
    <div className="planetList">
      {planetsInfo.map((planet, key) => (
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
