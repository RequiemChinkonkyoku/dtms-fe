import React from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/Routes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}

export default App;
