import { useEffect, memo, useState } from "react";
import { timeStringToSeconds } from "../../utils";
import InfoTable from "./table";

const InfoPlanet = memo(function InfoPlanet({ id }) {
  const [dataDepartures, setDataDepartures] = useState([]);
  const [dataArrivals, setDataArrivales] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let dataFetched = await fetch("journeys.json");
      dataFetched = await dataFetched.json();
      dataFetched = dataFetched.data;

      dataFetched.forEach((journey) => {
        if (journey.departure_hour.length === 7) {
          journey.departure_hour = "0" + journey.departure_hour;
        }
        if (journey.arrival_hour.length === 7) {
          journey.arrival_hour = "0" + journey.arrival_hour;
        }
      });

      let dataDeparturesFetched = dataFetched
        .filter((journey) => journey.origin === id)
        .sort(
          (journeyA, journeyB) =>
            timeStringToSeconds(journeyA.departure_hour) -
            timeStringToSeconds(journeyB.departure_hour)
        );
      let dataArrivalsFetched = dataFetched
        .filter((journey) => journey.destination === id)
        .sort(
          (journeyA, journeyB) =>
            timeStringToSeconds(journeyA.arrival_hour) -
            timeStringToSeconds(journeyB.arrival_hour)
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
