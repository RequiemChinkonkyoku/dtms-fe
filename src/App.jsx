import React from "react";
import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

const App = () => {
  return <RouterProvider router={AppRoutes} />;
};

export default App;
