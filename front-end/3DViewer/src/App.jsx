import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";

import { MyCanvas } from "./components/canvas";
import { DisplayFocusedObject } from "./components/gui/displayFocusedObject";
import { InfoPlanet } from "./components/gui/infoPlanet";
import { RightPanel } from "./components/gui/rightPanel";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div style={{ width: "100vw", height: "100vh" }}>
          <InfoPlanet />
          <DisplayFocusedObject />
          <RightPanel />
          <MyCanvas />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
