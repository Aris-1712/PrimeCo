import { Route, Routes } from "react-router-dom";
import Trips from "../Components/Trips";
import Trip from "../Components/Trips/Trip";
import Products from "../Components/Products";
import Individual from "../Components/Individual";

export const Routing = () => {
  return (
    <Routes>
      <Route path="/trips" Component={Trips}></Route>
      <Route path="/trips/:id" Component={Trip}></Route>
      <Route path="/products" Component={Products}></Route>
      <Route path="/entity" Component={Individual}></Route>
    </Routes>
  );  
};
