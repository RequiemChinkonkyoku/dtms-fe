import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ROLE_GROUPS = {
  ADMIN: ["Admin"],
  STAFF: ["Staff_Employee", "Staff_Manager"],
  TRAINER: ["Trainer_Member", "Trainer_Lead"],
};

// Define route access configurations
const ROUTE_ACCESS = {
  "/admin": ROLE_GROUPS.ADMIN,
  "/staff": ROLE_GROUPS.STAFF,
  "/trainer": ROLE_GROUPS.TRAINER,
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

  // Extract role from the JWT token
  const userRole = user.role;

  // Get the base path from the current location
  const basePath = "/" + location.pathname.split("/")[1];

  // Check if the user's role is allowed for the route
  const allowedRoles = ROUTE_ACCESS[basePath];
  if (!allowedRoles?.includes(userRole)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = (() => {
      if (ROLE_GROUPS.ADMIN.includes(userRole)) return "/admin/dashboard";
      if (ROLE_GROUPS.STAFF.includes(userRole)) return "/staff/dashboard";
      if (ROLE_GROUPS.TRAINER.includes(userRole)) return "/trainer/dashboard";
      return "/login";
    })();

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
