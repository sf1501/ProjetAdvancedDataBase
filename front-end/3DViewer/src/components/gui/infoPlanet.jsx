import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { focusedObjectState } from "../../atoms";
import { planetsInfo, planetsList } from "../../const";
import { timeStringToSeconds } from "../../utils";
import InfoTable from "./table";

export function InfoTables({ id }) {
  const {
    data: dataDepartures,
    isLoading: isLoadingDepartures,
    error: errorDepartures,
  } = useQuery(
    "departures" + id,
    () =>
      fetch(import.meta.env.VITE_BACKEND + "/voyageByGareDepart/" + id)
        .then((data) => data.json())
        .then((data) =>
          data.sort(
            (journeyA, journeyB) =>
              timeStringToSeconds(journeyA.depart) -
              timeStringToSeconds(journeyB.depart)
          )
        ),
    { refetchInterval: 5000 }
  );
  const {
    data: dataArrivals,
    isLoading: isLoadingArrivals,
    error: errorArrivals,
  } = useQuery(
    "arrivals" + id,
    () =>
      fetch(import.meta.env.VITE_BACKEND + "/voyageByGareArrive/" + id)
        .then((data) => data.json())
        .then((data) =>
          data.sort(
            (journeyA, journeyB) =>
              timeStringToSeconds(journeyA.arrive) -
              timeStringToSeconds(journeyB.arrive)
          )
        ),
    { refetchInterval: 5000 }
  );

  if (isLoadingDepartures || isLoadingArrivals)
    return <div className="infoPlanet">loading</div>;

  if (errorDepartures || errorArrivals)
    return <div className="infoPlanet">error</div>;

  return (
    <div className="infoPlanet">
      <InfoTable type={"Departures"} rows={dataDepartures} />
      <InfoTable type={"Arrivals"} rows={dataArrivals} />
    </div>
  );
}

export function InfoPlanet() {
  const focusedObject = useRecoilValue(focusedObjectState);

  return (
    planetsInfo.find((planet) => planet.name === focusedObject) && (
      <InfoTables id={planetsList.indexOf(focusedObject)} />
    )
  );
}
