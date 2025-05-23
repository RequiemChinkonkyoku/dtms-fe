import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import sidebarBg from "../../../assets/img/sidebar.jpg";

const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      <div
        className="sidebar"
        data-background-color="black"
        data-color="azure"
        style={{
          backgroundImage: `url(${sidebarBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="logo">
          <a className="simple-text logo-mini">
            <img
              src="/pawicon.ico"
              alt="PAW"
              style={{ height: "40px", width: "40px" }}
            />
          </a>
          <a
            className="simple-text logo-normal"
            style={{ display: "flex", alignItems: "center", height: "50px" }}
          >
            P.A.W
          </a>
        </div>
        <div
          className="sidebar-wrapper ps-container ps-theme-default"
          data-ps-id="8e0dc3c4-0764-9be2-00bc-a242848f1e7e"
        >
          <div className="user">
            <div className="user-info">
              <div className="collapse show">
                <ul className="nav">
                  <li
                    className={`nav-item ${location.pathname === "/trainer/dashboard" ? "active" : ""}`}
                  >
                    <Link className="nav-link" to="/trainer/dashboard">
                      <i className="material-icons">dashboard</i>
                      <p> Dashboard </p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ul className="nav">
            <li
              className={`nav-item ${location.pathname === "/trainer/lessons" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/trainer/lessons">
                <i className="material-icons">book</i>
                <p>Lessons</p>
              </Link>
            </li>
            <li
              className={`nav-item ${location.pathname === "/trainer/courses" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/trainer/courses">
                <i className="material-icons">school</i>
                <p>Courses</p>
              </Link>
            </li>
            <li
              className={`nav-item ${location.pathname === "/trainer/classes" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/trainer/classes">
                <i className="material-icons">today</i>
                <p>Your Classes</p>
              </Link>
            </li>
          </ul>
          <div
            className="ps-scrollbar-x-rail"
            style={{
              bottom: "0px",
              left: "0px",
            }}
          >
            <div
              className="ps-scrollbar-x"
              style={{
                left: "0px",
                width: "0px",
              }}
              tabIndex="0"
            />
          </div>
          <div
            className="ps-scrollbar-y-rail"
            style={{
              right: "0px",
              top: "0px",
            }}
          >
            <div
              className="ps-scrollbar-y"
              style={{
                height: "0px",
                top: "0px",
              }}
              tabIndex="0"
            />
          </div>
        </div>
        <div
          className="sidebar-background"
          style={{
            backgroundImage: "url(../assets/img/sidebar-1.jpg)",
          }}
        />
      </div>
    </>
  );
};

export default Sidebar;
