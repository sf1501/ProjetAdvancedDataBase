import { useFrame, useThree } from "@react-three/fiber";
import dayjs from "dayjs";
import { useRef } from "react";
import { timer } from "../const";

import { progressiveTrajectory, timerToSeconds } from "../utils";
import { MemoModel } from "./spaceship";

export function SpaceshipManager({ journey }) {
  const { scene } = useThree();

  useFrame((state) => {
    const dayjsDepartureHour = dayjs(journey.depart, "HH:mm:ss");

    timer.add(state.clock.elapsedTime * 100);
    if (timerToSeconds(dayjsDepartureHour) < timerToSeconds(timer)) {
      progressiveTrajectory(journey.nom_voyage, scene, timer);
    }
  });

  return (
    <MemoModel
      idJourney={journey.id}
      name={journey.nom_voyage}
      nom_voyage={journey.nom_voyage}
      gare_depart={journey.gare_depart}
      gare_arrive={journey.gare_arrive}
      depart={journey.depart}
      arrive={journey.arrive}
      delai={journey.delai}
    />
  );
}
