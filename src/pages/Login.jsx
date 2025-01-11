import axios from "../utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/material-dashboard.min.css";
import { useAuth } from "../contexts/AuthContext";
import Head from "../assets/components/common/Head";
import loginBg from "../assets/img/login.jpg";

const Login = () => {
  return (
    <div>
      <Head />
      <body className="off-canvas-sidebar">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NKDMSK6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top text-white">
          <div class="container">
            <div class="navbar-wrapper">
              <a class="navbar-brand" href="#pablo">
                LOGIN
              </a>
            </div>
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="sr-only">Toggle navigation</span>
              <span class="navbar-toggler-icon icon-bar"></span>
              <span class="navbar-toggler-icon icon-bar"></span>
              <span class="navbar-toggler-icon icon-bar"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a href="../dashboard.html" class="nav-link">
                    <i class="material-icons">dashboard</i> Dashboard
                  </a>
                </li>
                <li class="nav-item ">
                  <a href="../pages/register.html" class="nav-link">
                    <i class="material-icons">person_add</i> Register
                  </a>
                </li>
                <li class="nav-item  active ">
                  <a href="../pages/login.html" class="nav-link">
                    <i class="material-icons">fingerprint</i> Login
                  </a>
                </li>
                <li class="nav-item ">
                  <a href="../pages/lock.html" class="nav-link">
                    <i class="material-icons">lock_open</i> Lock
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="wrapper wrapper-full-page">
          <div
            className="page-header login-page header-filter"
            filter-color="black"
            style={{
              backgroundImage: `url(${loginBg})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
            }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-8 ml-auto mr-auto">
                  <form className="form" method="" action="">
                    <div className="card card-login">
                      <div className="card-header card-header-rose text-center">
                        <h4 className="card-title">Login</h4>
                        <div className="social-line">
                          <a
                            href="#pablo"
                            className="btn btn-just-icon btn-link btn-white"
                          >
                            <i className="fa fa-facebook-square"></i>
                          </a>
                          <a
                            href="#pablo"
                            className="btn btn-just-icon btn-link btn-white"
                          >
                            <i className="fa fa-twitter"></i>
                          </a>
                          <a
                            href="#pablo"
                            className="btn btn-just-icon btn-link btn-white"
                          >
                            <i className="fa fa-google-plus"></i>
                          </a>
                        </div>
                      </div>
                      <div className="card-body ">
                        <p className="card-description text-center">
                          Or Be Classical
                        </p>
                        <span className="bmd-form-group">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-icons">face</i>
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="First Name..."
                            />
                          </div>
                        </span>
                        <span className="bmd-form-group">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-icons">email</i>
                              </span>
                            </div>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email..."
                            />
                          </div>
                        </span>
                        <span className="bmd-form-group">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-icons">lock_outline</i>
                              </span>
                            </div>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Password..."
                            />
                          </div>
                        </span>
                      </div>
                      <div className="card-footer justify-content-center">
                        <a
                          href="#pablo"
                          className="btn btn-rose btn-link btn-lg"
                        >
                          Lets Go
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <footer className="footer">
              <div className="container">
                <nav className="float-left">
                  <ul>
                    <li>
                      <a href="https://www.creative-tim.com">Creative Tim</a>
                    </li>
                    <li>
                      <a href="https://creative-tim.com/presentation">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="http://blog.creative-tim.com">Blog</a>
                    </li>
                    <li>
                      <a href="https://www.creative-tim.com/license">
                        Licenses
                      </a>
                    </li>
                  </ul>
                </nav>
                <div className="copyright float-right">
                  &copy;
                  <script>document.write(new Date().getFullYear())</script>,
                  made with <i className="material-icons">favorite</i> by
                  <a href="https://www.creative-tim.com" target="_blank">
                    Creative Tim
                  </a>{" "}
                  for a better web.
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </div>
  );
};

export default Login;
