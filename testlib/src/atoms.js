import dayjs from "dayjs";
import { atom } from "recoil";

export const timerState = atom({
  key: "timerState",
  default: dayjs().hour(12).minute(0).second(0),
});

export const focusedObjectState = atom({
  key: "focusedObjectState",
  default: "",
});
