import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { focusedObjectState, timerState } from "./atoms";
import { QueryClient, QueryClientProvider } from "react-query";

import { MemoCanvas } from "./components/canvas";
import { DisplayFocusedObject } from "./components/gui/displayFocusedObject";
import InfoPlanet from "./components/gui/infoPlanet";
import { RightPanel } from "./components/gui/rightPanel";
import { planetsInfo, planetsList } from "./const";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  const [focusedObject, setFocusedObject] = useRecoilState(focusedObjectState);
  const [dataPlanets, setDataPlanets] = useState([]);

  const [timer, setTimer] = useRecoilState(timerState);

  const queryClient = new QueryClient();

  useEffect(() => {
    setDataPlanets(planetsInfo);

    const interval = setInterval(() => {
      setTimer((state) => state.add(1, "s"));
    }, 10);

    return () => clearInterval(interval);
  }, [setTimer]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div style={{ width: "100vw", height: "100vh" }}>
          {dataPlanets.find((planet) => planet.name === focusedObject) ? (
            <InfoPlanet id={planetsList.indexOf(focusedObject)} />
          ) : null}
          <DisplayFocusedObject focusedObject={focusedObject} />
          <RightPanel
            timer={timer}
            dataPlanets={dataPlanets}
            setFocusedObject={setFocusedObject}
          />
          <MemoCanvas dataPlanets={dataPlanets} />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
