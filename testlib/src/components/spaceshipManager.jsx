import { useFrame, useThree } from "@react-three/fiber";
import dayjs from "dayjs";
import { useRecoilValue } from "recoil";

import { timerState } from "../atoms";
import { progressiveTrajectory, timerToSeconds } from "../utils";
import { MemoModel } from "./spaceship";

export function SpaceshipManager({ journey }) {
  const { scene } = useThree();
  const timer = useRecoilValue(timerState);

  useFrame((state) => {
    const dayjsDepartureHour = dayjs(journey.departure_hour, "HH:mm:ss");
    if (timerToSeconds(dayjsDepartureHour) < timerToSeconds(timer)) {
      progressiveTrajectory(journey.spaceship_number, scene, timer);
    }
  });

  return (
    <MemoModel
      idJourney={journey.id}
      name={journey.spaceship_number}
      spaceship_number={journey.spaceship_number}
      origin={journey.origin}
      destination={journey.destination}
      departure_hour={journey.departure_hour}
      arrival_hour={journey.arrival_hour}
      delay={journey.delay}
    />
  );
}
