import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

import Login from "../pages/Login";
import DogTable from "../pages/DogManagement";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
  {
    path: "/DogTable",
    element: (
      <AuthProvider>
        <DogTable />
      </AuthProvider>
    ),
  },
]);
