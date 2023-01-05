import { memo } from "react";
import { timeStringToSeconds } from "../../utils";
import InfoTable from "./table";

const InfoPlanet = memo(function Info({ id }) {
  const { data: dataDepartures } = useQuery("departures" + id, () =>
    fetch("localhost:3000/voyageByGareDepart/" + id)
      .then((data) => data.json())
      .then((data) =>
        data.sort(
          (journeyA, journeyB) =>
            timeStringToSeconds(journeyA.departure_hour) -
            timeStringToSeconds(journeyB.departure_hour)
        )
      )
  );
  const { data: dataArrivals } = useQuery("arrivals" + id, () =>
    fetch("localhost:3000/voyageByGareArrivee/" + id)
      .then((data) => data.json())
      .then((data) =>
        data.sort(
          (journeyA, journeyB) =>
            timeStringToSeconds(journeyA.departure_hour) -
            timeStringToSeconds(journeyB.departure_hour)
        )
      )
  );

  return (
    <div className="infoPlanet">
      <InfoTable type={"Departures"} rows={dataDepartures} />
      <InfoTable type={"Arrivals"} rows={dataArrivals} />
    </div>
  );
});
export default InfoPlanet;
