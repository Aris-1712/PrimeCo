import { Route, Routes } from "react-router-dom";
import Trips from "../Components/Trips";
import Trip from "../Components/Trips/Trip";
import Products from "../Components/Products";
import Individual from "../Components/Individual";
import Login from "../Components/Login";
import ProtectedRoute from "./ProtectedRoute";

export const Routing = () => {
  return (
    <Routes>
        <Route path="/dashboard" Component={Trips}></Route>
        <Route path="/trips" Component={Trips}></Route>
        <Route path="/trips/:id" Component={Trip}></Route>
        <Route path="/products" Component={Products}></Route>
        <Route path="/entity" Component={Individual}></Route>
    </Routes>
  );
};
