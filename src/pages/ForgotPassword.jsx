import axios from "../utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/material-dashboard.min.css";
import { useAuth } from "../contexts/AuthContext";
import Head from "../assets/components/common/Head";
import loginBg from "../assets/img/login.jpg";
import "../assets/css/background-pattern.css";
import { useLoading } from "../contexts/LoadingContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../assets/components/auth/Navbar";

const ForgotPassword = () => {
  const { loading, setLoading } = useLoading();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Your API calls here
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading]);

  return (
    <div>
      <div className="pattern-background"></div>
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
        <Navbar />
        <div className="wrapper wrapper-full-page">
          <div
            className="page-header login-page header-filter"
            filter-color="black"
            // style={{
            //   backgroundImage: `url(${loginBg})`,
            //   backgroundSize: "cover",
            //   backgroundPosition: "top center",
            // }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-8 ml-auto mr-auto">
                  <form className="form" method="" action="" autoComplete="off">
                    <div className="card card-login">
                      <div className="card-header card-header-warning text-center">
                        <h4 className="card-title">DTMS STAFF PORTAL</h4>
                        <div class="social-line">
                          <i class="material-icons">pets</i>
                        </div>
                      </div>
                      <div className="card-body ">
                        {/* <span className="bmd-form-group">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-icons">face</i>
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Username..."
                            />
                          </div>
                        </span> */}
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
                              autoComplete="new-email"
                              name="email"
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
                              autoComplete="new-password"
                              name="password"
                            />
                          </div>
                        </span>
                      </div>
                      <div className="card-footer justify-content-center">
                        <a
                          href="#pablo"
                          className="btn btn-warning btn-link btn-lg"
                        >
                          Login
                        </a>
                      </div>
                      <p className="card-description text-center">
                        Forgot Password? <Link to={"/"}>Click here</Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <footer className="footer">
              <div className="container">
                {/* <nav className="float-left">
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
                </nav> */}
                <div className="copyright float-right">
                  &copy; 2025, template made with{" "}
                  <i className="material-icons">favorite</i> by Creative Tim.
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </div>
  );
};

export default ForgotPassword;
