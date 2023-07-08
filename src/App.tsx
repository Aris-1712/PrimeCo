import React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MiniDrawer from "./Components/Drawer";
import { ThemeProvider, createTheme } from "@mui/material";
import { Routing } from "./Routes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";



function App() {
  return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <MiniDrawer>
          <Routing />
        </MiniDrawer>
      </LocalizationProvider>
  );
}

export default App;
