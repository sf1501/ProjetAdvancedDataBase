import { useRecoilValue } from "recoil";
import { focusedObjectState } from "../../atoms";

export function DisplayFocusedObject() {
  const focusedObject = useRecoilValue(focusedObjectState);
  return (
    <span id="focusedObject" className="planetName">
      {focusedObject}
    </span>
  );
}
