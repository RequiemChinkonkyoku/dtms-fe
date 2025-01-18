import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

import Login from "../pages/Login";
import DogTable from "../pages/DogManagement";
import DogBreedTable from "../pages/DogBreedManagement";
import DogDocumentTable from "../pages/DogDocumentManagement";

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
  {
    path: "/DogBreedTable",
    element: (
      <AuthProvider>
        <DogBreedTable />
      </AuthProvider>
    ),
  },
  {
    path: "/DogDocumentTable",
    element: (
      <AuthProvider>
        <DogDocumentTable />
      </AuthProvider>
    ),
  },
]);
