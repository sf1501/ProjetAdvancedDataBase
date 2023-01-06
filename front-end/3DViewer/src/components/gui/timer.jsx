import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function Timer() {
  const [timer, setTimer] = useState(dayjs().hour(12).minute(0).second(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((state) => state.add(10, "s"));
    }, 100);
    return () => clearInterval(interval);
  }, [setTimer]);

  return <span>Timer: {timer.format("HH:mm:ss")}</span>;
}
