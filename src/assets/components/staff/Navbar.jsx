import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "../../../utils/axiosConfig";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const location = useLocation();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login");
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
      const segments = path.replace("/staff/", "").split("/");
      let title = [];

      segments.forEach((segment, index) => {
        switch (segment) {
          case "dashboard":
            title.push("DASHBOARD");
            break;
          case "classes":
            title.push("CLASSES");
            break;
          case "create":
            title.push("CREATE");
            break;
        }
      });

      return title.map((segment, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <i className="material-icons mx-1" style={{ fontSize: "30px" }}>
              navigate_next
            </i>
          )}
          <span>{segment}</span>
        </React.Fragment>
      ));
    }
    return "STAFF";
  };

  const toggleProfileDropdown = (e) => {
    e.preventDefault();
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotificationsDropdown = (e) => {
    e.preventDefault();
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute">
      <div className="container-fluid">
        <div className="navbar-brand d-flex align-items-center">
          <i className="material-icons mr-1">home</i>
          <i className="material-icons mx-1" style={{ fontSize: "30px" }}>
            navigate_next
          </i>
          {getPageTitle()}
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
