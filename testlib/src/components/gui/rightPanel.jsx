import { PlanetList } from "./planetList";
import { Timer } from "./timer";

export function RightPanel() {
  return (
    <div className="rightPanel">
      <Timer />
      <PlanetList />
    </div>
  );
}
