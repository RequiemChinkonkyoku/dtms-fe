import React from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import Loader from "./assets/components/common/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "./utils/toastConfig";

function App() {
  return (
    <>
      <LoadingProvider>
        <AuthProvider>
          <Loader />
          <RouterProvider router={routes} />
        </AuthProvider>
      </LoadingProvider>
      <ToastContainer {...toastConfig} />
    </>
  );
}

export default App;
