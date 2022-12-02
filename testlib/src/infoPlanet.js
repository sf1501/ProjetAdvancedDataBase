import { useEffect, memo, useState } from "react";
import { planetsList } from "./const";
import InfoTable from "./table";
import { timerToSeconds } from "./utils";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const InfoPlanet = memo(function InfoPlanet({ id }) {
  const [dataDepartures, setDataDepartures] = useState([]);
  const [dataArrivals, setDataArrivales] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let dataFetched = await fetch("journeys.json");
      dataFetched = await dataFetched.json();
      dataFetched = dataFetched.data;

      dataFetched.forEach((journey) => {
        journey.origin = planetsList[journey.origin];

        journey.destination = planetsList[journey.destination];
      });
      let dataDeparturesFetched = dataFetched
        .filter((journey) => journey.origin === planetsList[id])
        .sort(
          (journeyA, journeyB) =>
            timerToSeconds(dayjs(journeyA.departure_hour, "HH:mm:ss")) -
            timerToSeconds(dayjs(journeyB.departure_hour, "HH:mm:ss"))
        );
      let dataArrivalsFetched = dataFetched
        .filter((journey) => journey.destination === planetsList[id])
        .sort(
          (journeyA, journeyB) =>
            timerToSeconds(dayjs(journeyA.arrival_hour, "HH:mm:ss")) -
            timerToSeconds(dayjs(journeyB.arrival_hour, "HH:mm:ss"))
        );

      setDataDepartures(dataDeparturesFetched);
      setDataArrivales(dataArrivalsFetched);
    }
    fetchData();
  }, [id]);

  return (
    <div className="infoPlanet">
      <InfoTable type={"Departures"} rows={dataDepartures} />
      <InfoTable type={"Arrivals"} rows={dataArrivals} />
    </div>
  );
});
export default InfoPlanet;
