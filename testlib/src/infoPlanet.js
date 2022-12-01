import { useEffect, memo, useState } from "react";
import InfoTable from "./table";

const InfoPlanet = memo(function InfoPlanet({ id }) {
  const [dataDepartures, setDataDepartures] = useState([]);
  const [dataArrivals, setDataArrivales] = useState([]);

  const planetsList = [
    "Earth",
    "Mars",
    "Saturn",
    "Mercury",
    "Jupiter",
    "Uranus",
    "Neptune",
    "Venus",
  ];

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
            parseInt(journeyA.departure_hour) -
            parseInt(journeyB.departure_hour)
        );
      let dataArrivalsFetched = dataFetched
        .filter((journey) => journey.destination === planetsList[id])
        .sort(
          (journeyA, journeyB) =>
            parseInt(journeyA.arrival_hour) - parseInt(journeyB.arrival_hour)
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