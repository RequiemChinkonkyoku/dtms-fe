import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import Accounts from "../pages/staff/Accounts";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminAccounts from "../pages/admin/Accounts";
import AdminAccountsCustomerDetails from "../pages/admin/AccountsCustomerDetails";
import AccountsTrainerDetails from "../pages/admin/AccountsTrainerDetails";
import AdminDog from "../pages/admin/Dogs";
import AdminDogsDetails from "../pages/admin/DogsDetails";
import AdminClasses from "../pages/admin/Classes";
import AdminClassesDetails from "../pages/admin/ClassesDetails";
import AdminCages from "../pages/admin/Cages";
import AdminBlogs from "../pages/admin/Blogs";
import AdminBlogsDetails from "../pages/admin/BlogsDetails";
import AdminSkills from "../pages/admin/Skills";
import AdminEquipments from "../pages/admin/Equipment";
import AdminTransactions from "../pages/admin/Transactions";
import StaffDashboard from "../pages/staff/Dashboard";
import TrainerDashboard from "../pages/trainer/Dashboard";
import TrainerLessons from "../pages/trainer/Lessons";
import TrainerCourses from "../pages/trainer/Courses";
import TrainerCoursesDetails from "../pages/trainer/CoursesDetails";
import Blogs from "../pages/staff/Blogs";
import StaffClassesCreate from "../pages/staff/ClassesCreate";
import StaffClassesDetails from "../pages/staff/ClassesDetails";
import StaffDogs from "../pages/staff/Dogs";
import StaffAccountsCustomerDetails from "../pages/staff/AccountsCustomerDetails";
import StaffAccountsTrainerDetails from "../pages/staff/AccountsTrainerDetails";
import StaffClasses from "../pages/staff/Classes";
import TrainerCoursesCreate from "../pages/trainer/CoursesCreate";
import TrainerLessonsCreate from "../pages/trainer/LessonsCreate";
import TrainerClasses from "../pages/trainer/Classes";
import TrainerLessonsDetails from "../pages/trainer/LessonsDetails";
import StaffDogsDetails from "../pages/staff/DogsDetails";
import StaffCages from "../pages/staff/Cages";
import StaffBlogsCreate from "../pages/staff/BlogsCreate";
import StaffBlogsDetails from "../pages/staff/BlogsDetails";
import StaffSkills from "../pages/staff/Skills";
import StaffEquipments from "../pages/staff/Equipment";
import StaffStatistics from "../pages/staff/Statistics";
import StaffTransactions from "../pages/staff/Transactions";
import TrainerClassesDetails from "../pages/trainer/ClassesDetails";
import ResetPassword from "../pages/ResetPassword";
import StaffProfile from "../pages/staff/Profile";
import { AdbOutlined } from "@mui/icons-material";

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
    path: "/reset-password",
    element: (
      <AuthProvider>
        <ResetPassword />
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
        path: "profile",
        element: <StaffProfile />,
      },
      {
        path: "statistics",
        element: <StaffStatistics />,
      },
      {
        path: "transactions",
        element: <StaffTransactions />,
      },
      {
        path: "dogs",
        element: <StaffDogs />,
      },
      {
        path: "dogs/details/:id",
        element: <StaffDogsDetails />,
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
        path: "blogs/details/:id",
        element: <StaffBlogsDetails />,
      },
      {
        path: "blogs/create",
        element: <StaffBlogsCreate />,
      },
      {
        path: "classes",
        element: <StaffClasses />,
      },
      {
        path: "classes/create",
        element: <StaffClassesCreate />,
      },
      {
        path: "classes/details/:id",
        element: <StaffClassesDetails />,
      },
      {
        path: "accounts/customer/details/:id",
        element: <StaffAccountsCustomerDetails />,
      },
      {
        path: "accounts/trainer/details/:id",
        element: <StaffAccountsTrainerDetails />,
      },
      {
        path: "cages",
        element: <StaffCages />,
      },
      {
        path: "skills",
        element: <StaffSkills />,
      },
      {
        path: "equipments",
        element: <StaffEquipments />,
      },
    ],
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
      {
        path: "accounts",
        element: <AdminAccounts />,
      },
      {
        path: "dogs",
        element: <AdminDog />,
      },
      {
        path: "dogs/details/:id",
        element: <AdminDogsDetails />,
      },
      {
        path: "classes",
        element: <AdminClasses />,
      },
      {
        path: "classes/details/:id",
        element: <AdminClassesDetails />,
      },
      {
        path: "cages",
        element: <AdminCages />,
      },
      {
        path: "blogs",
        element: <AdminBlogs />,
      },
      {
        path: "blogs/details/:id",
        element: <AdminBlogsDetails />,
      },
      {
        path: "skills",
        element: <AdminSkills />,
      },
      {
        path: "equipments",
        element: <AdminEquipments />,
      },
      {
        path: "transactions",
        element: <AdminTransactions />,
      },
      {
        path: "accounts/customer/details/:id",
        element: <AdminAccountsCustomerDetails />,
      },
      {
        path: "accounts/trainer/details/:id",
        element: <AccountsTrainerDetails />,
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
        path: "lessons/details/:id",
        element: <TrainerLessonsDetails />,
      },
      {
        path: "lessons/create",
        element: <TrainerLessonsCreate />,
      },
      {
        path: "courses",
        element: <TrainerCourses />,
      },
      {
        path: "courses/create",
        element: <TrainerCoursesCreate />,
      },
      {
        path: "courses/details/:id",
        element: <TrainerCoursesDetails />,
      },
      {
        path: "classes",
        element: <TrainerClasses />,
      },
      {
        path: "classes/details/:id",
        element: <TrainerClassesDetails />,
      },
    ],
  },
]);
