import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import { ThemeProvider, createTheme } from "@mui/material";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./Routes/ProtectedRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ef5350",
    },
    secondary: {
      main: "#525252",
    },
  },
});
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route element={<ProtectedRoute />}>
            <Route path="*" Component={App}></Route>
          </Route>
        </Routes>
      </ThemeProvider>
      {/* <App /> */}
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
