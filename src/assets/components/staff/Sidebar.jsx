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
                    className={`nav-item ${location.pathname === "/staff/dashboard" ? "active" : ""}`}
                  >
                    <Link className="nav-link" to="/staff/dashboard">
                      <i className="material-icons">dashboard</i>
                      <p> Dashboard </p>
                    </Link>
                  </li>
                  <li
                    className={`nav-item ${location.pathname === "/staff/statistics" ? "active" : ""}`}
                  >
                    <Link className="nav-link" to="/staff/statistics">
                      <i className="material-icons">analytics</i>
                      <p> Statisics </p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ul className="nav">
            <li
              className={`nav-item ${location.pathname === "/staff/accounts" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/staff/accounts">
                <i className="material-icons">person</i>
                <p>Accounts</p>
              </Link>
            </li>
            <li
              className={`nav-item ${location.pathname === "/staff/dogs" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/staff/dogs">
                <i className="material-icons">pets</i>
                <p>Dogs</p>
              </Link>
            </li>
            <li
              className={`nav-item ${location.pathname === "/staff/classes" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/staff/classes">
                <i className="material-icons">school</i>
                <p>Classes</p>
              </Link>
            </li>
            <li
              className={`nav-item ${location.pathname === "/staff/cages" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/staff/cages">
                <i className="material-icons">house</i>
                <p>Cages</p>
              </Link>
            </li>
            <li
              className={`nav-item ${location.pathname === "/staff/blogs" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/staff/blogs">
                <i className="material-icons">article</i>
                <p>Blogs</p>
              </Link>
            </li>
            <li
              className={`nav-item ${location.pathname === "/staff/skills" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/staff/skills">
                <i className="material-icons">psychology</i>
                <p>Skills</p>
              </Link>
            </li>
            <li
              className={`nav-item ${location.pathname === "/staff/equipments" ? "active" : ""}`}
            >
              <Link className="nav-link" to="/staff/equipments">
                <i className="material-icons">fitness_center</i>
                <p>Equipments</p>
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
