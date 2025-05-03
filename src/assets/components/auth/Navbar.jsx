import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top text-white">
      <div className="container">
        <div className="navbar-wrapper">
          <Link className="navbar-brand d-flex align-items-center" to="#">
            <img
              src="/pawicon.png"
              alt="PAW Logo"
              style={{
                height: "60px",
                marginRight: "10px",
              }}
            />
            <span>PUPPY ADVANCEMENT WORKSHOP</span>
          </Link>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          aria-controls="navigation-index"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="navbar-toggler-icon icon-bar"></span>
          <span className="navbar-toggler-icon icon-bar"></span>
          <span className="navbar-toggler-icon icon-bar"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li
              className={`nav-item ${location.pathname === "/login" ? "active" : ""}`}
            >
              <Link to="/login" className="nav-link">
                <i className="material-icons">fingerprint</i> Login
              </Link>
            </li>
            <li
              className={`nav-item ${location.pathname === "/forgot-password" ? "active" : ""}`}
            >
              <Link to="/forgot-password" className="nav-link">
                <i className="material-icons">lock_open</i> Forgot Password
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
