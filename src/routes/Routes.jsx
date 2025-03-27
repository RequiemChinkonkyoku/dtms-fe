import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/Login";
import DogManagement from "../pages/staff/DogManagement";
import DogBreedTable from "../pages/staff/DogBreedManagement";
import DogDocumentTable from "../pages/staff/DogDocumentManagement";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/staff/Dashboard";
import Accounts from "../pages/staff/Accounts";
import AdminDashboard from "../pages/admin/Dashboard";
import StaffDashboard from "../pages/staff/Dashboard";
import TrainerDashboard from "../pages/trainer/Dashboard";
import TrainerLessons from "../pages/trainer/Lessons";
import TrainerCourses from "../pages/trainer/Courses";
import TrainerCoursesDetails from "../pages/trainer/CoursesDetails";
import Blogs from "../pages/staff/Blogs";
import StaffClasses from "../pages/staff/Classes";
import StaffClassesCreate from "../pages/staff/ClassesCreate";

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
    path: "/staff",
    element: (
      <AuthProvider>
        <PrivateRoute />
      </AuthProvider>
    ),
    children: [
      {
        path: "dogs-management",
        element: <DogManagement />,
      },
      {
        path: "accounts",
        element: <Accounts />,
      },
      {
        path: "dashboard",
        element: <StaffDashboard />,
      },
      {
        path: "blogs",
        element: <Blogs />,
      },
      {
        path: "classes",
        element: <StaffClasses />,
      },
      {
        path: "classes/create",
        element: <StaffClassesCreate />,
      },
    ],
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
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <PrivateRoute />
      </AuthProvider>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: "/trainer",
    element: (
      <AuthProvider>
        <PrivateRoute />
      </AuthProvider>
    ),
    children: [
      {
        path: "dashboard",
        element: <TrainerDashboard />,
      },
      {
        path: "lessons",
        element: <TrainerLessons />,
      },
      {
        path: "courses",
        element: <TrainerCourses />,
      },
      {
        path: "courses/details/:id",
        element: <TrainerCoursesDetails />,
      },
    ],
  },
]);
