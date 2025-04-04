import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // Adjust the import path as needed
import axios from "../../../utils/axiosConfig";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const location = useLocation();

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    try {
      await logout();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get(`/api/accounts/${user.unique_name}`);
        setAccountInfo(response.data);
      } catch (error) {
        console.error("Error fetching account info:", error);
      }
    };

    if (user?.unique_name) {
      fetchAccountInfo();
    }
  }, [user]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/staff")) {
      const subPath = path.replace("/staff/", "").split("/")[0];
      switch (subPath) {
        case "dashboard":
          return "STAFF/DASHBOARD";
        case "classes":
          return location.pathname.includes("/create")
            ? "STAFF/CLASSES/CREATE"
            : location.pathname.includes("/edit")
              ? "STAFF/CLASSES/EDIT"
              : location.pathname.includes("/details")
                ? "STAFF/CLASSES/DETAILS"
                : "STAFF/CLASSES";
        case "courses":
          return location.pathname.includes("/details")
            ? "STAFF/COURSES/DETAILS"
            : "STAFF/COURSES";
        case "trainers":
          return location.pathname.includes("/details")
            ? "STAFF/TRAINERS/DETAILS"
            : "STAFF/TRAINERS";
        case "customers":
          return location.pathname.includes("/details")
            ? "STAFF/CUSTOMERS/DETAILS"
            : "STAFF/CUSTOMERS";
        case "dogs":
          return location.pathname.includes("/details")
            ? "STAFF/DOGS/DETAILS"
            : "STAFF/DOGS";
        case "profile":
          return "STAFF/PROFILE";
        case "settings":
          return "STAFF/SETTINGS";
        case "notifications":
          return "STAFF/NOTIFICATIONS";
        default:
          return "STAFF";
      }
    }
    return "STAFF";
  };

  const toggleProfileDropdown = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotificationsDropdown = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute">
      <div className="container-fluid">
        <div className="navbar-wrapper d-flex align-items-center">
          <div className="navbar-minimize">
            {/* Commented out minimize button */}
          </div>
          <a className="navbar-brand" href="#">
            {getPageTitle()}
          </a>
        </div>
        <button
          aria-controls="navigation-index"
          aria-expanded="false"
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-toggle="collapse"
          type="button"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="navbar-toggler-icon icon-bar" />
          <span className="navbar-toggler-icon icon-bar" />
          <span className="navbar-toggler-icon icon-bar" />
        </button>
        <div className="collapse navbar-collapse justify-content-end">
          {accountInfo && (
            <span className="ml-3 text-dark">
              Welcome back, {accountInfo.username}
            </span>
          )}
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                className="nav-link"
                onClick={toggleProfileDropdown}
                href="#"
                id="navbarDropdownProfile"
              >
                <i className="material-icons">person</i>
                <p className="d-lg-none d-md-block">Account</p>
              </a>
              {isProfileOpen && (
                <div
                  aria-labelledby="navbarDropdownProfile"
                  className="dropdown-menu dropdown-menu-right show"
                >
                  <Link className="dropdown-item" to="/admin/profile">
                    Profile
                  </Link>
                  <Link className="dropdown-item" to="/admin/settings">
                    Settings
                  </Link>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    Log out
                  </a>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
