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
import Footer from "../assets/components/auth/Footer";

const Login = () => {
  const { loading, setLoading } = useLoading();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       // Your API calls here
  //       await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
  //     } catch (error) {
  //       console.error("Error:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [setLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        setIsLoggedIn(true);
      } else {
        message.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                  <form
                    className="form"
                    method=""
                    action=""
                    autoComplete="off"
                    onSubmit={handleSubmit}
                  >
                    <div className="card card-login">
                      <div className="card-header card-header-warning text-center">
                        <h4 className="card-title">DTMS STAFF PORTAL</h4>
                        <div className="social-line">
                          <i className="material-icons">pets</i>
                        </div>
                      </div>
                      <div className="card-body">
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
                              value={formData.email}
                              onChange={handleChange}
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
                              value={formData.password}
                              onChange={handleChange}
                            />
                          </div>
                        </span>
                      </div>
                      <div className="card-footer justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-warning btn-link btn-lg"
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </body>
    </div>
  );
};

export default Login;
