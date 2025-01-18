import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

import Login from "../pages/Login";
import DogManagement from "../pages/staff/DogManagement";
import DogBreedTable from "../pages/staff/DogBreedManagement";
import DogDocumentTable from "../pages/staff/DogDocumentManagement";
import ForgotPassword from "../pages/ForgotPassword";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/forgot-password",
    element: (
      <AuthProvider>
        <ForgotPassword />
      </AuthProvider>
    ),
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
    path: "/dogs/management",
    element: (
      <AuthProvider>
        <DogManagement />
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
