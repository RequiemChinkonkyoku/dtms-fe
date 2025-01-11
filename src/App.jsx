import React from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import Loader from "./assets/components/common/Loader";

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <Loader />
        <RouterProvider router={routes} />
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
