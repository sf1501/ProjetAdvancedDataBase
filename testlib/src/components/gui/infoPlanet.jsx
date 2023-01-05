import { memo } from "react";
import { timeStringToSeconds } from "../../utils";
import InfoTable from "./table";

const InfoPlanet = memo(function Info({ id }) {
  const { data: dataDepartures } = useQuery("departures" + id, () =>
    fetch(import.meta.env.VITE_BACKEND + "/voyageByGareDepart/" + id)
      .then((data) => data.json())
      .then((data) =>
        data.sort(
          (journeyA, journeyB) =>
            timeStringToSeconds(journeyA.depart) -
            timeStringToSeconds(journeyB.depart)
        )
      )
  );
  const { data: dataArrivals } = useQuery("arrivals" + id, () =>
    fetch(import.meta.env.VITE_BACKEND + "/voyageByGareArrivee/" + id)
      .then((data) => data.json())
      .then((data) =>
        data.sort(
          (journeyA, journeyB) =>
            timeStringToSeconds(journeyA.depart) -
            timeStringToSeconds(journeyB.depart)
        )
      )
  );
  
  if (isLoadingDepartures || isLoadingArrivals) return <div>loading</div>

  if (errorDepartures || errorArrivals) return<div>error</div> 

  return (
    <div className="infoPlanet">
      <InfoTable type={"Departures"} rows={dataDepartures} />
      <InfoTable type={"Arrivals"} rows={dataArrivals} />
    </div>
  );
});
export default InfoPlanet;
