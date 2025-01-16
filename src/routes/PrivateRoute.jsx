import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ROLES = {
  CUSTOMER: "1",
  STAFF: "2",
  MANAGER: "3",
  ADMIN: "4",
};

// Define route access configurations
const ROUTE_ACCESS = {
  "/admin": [ROLES.ADMIN],
  "/customer": [ROLES.CUSTOMER],
  "/staff": [ROLES.STAFF],
  "/manager": [ROLES.MANAGER],
};

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Get the base path from the current location
  const basePath = "/" + location.pathname.split("/")[1];

  // Check if user has access to this route
  const allowedRoles = ROUTE_ACCESS[basePath];
  if (!allowedRoles?.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = (() => {
      switch (user.role) {
        case ROLES.ADMIN:
          return "/admin/dashboard";
        case ROLES.CUSTOMER:
          return "/customer/dashboard";
        case ROLES.STAFF:
          return "/staff/dashboard";
        case ROLES.MANAGER:
          return "/manager/dashboard";
        default:
          return "/login";
      }
    })();

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
