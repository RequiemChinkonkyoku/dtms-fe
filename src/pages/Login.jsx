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
import LoaderLogin from "../assets/components/auth/LoaderLogin";
import { showToast } from "../utils/toastConfig";

const Login = () => {
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [buttonState, setButtonState] = useState("initial");

  const ROLE_GROUPS = {
    ADMIN: "Admin",
    STAFF: ["Staff_Employee", "Staff_Manager"],
    TRAINER: ["Trainer_Member", "Trainer_Lead"],
  };

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user?.role === ROLE_GROUPS.ADMIN) {
        navigate("/admin/dashboard", { replace: true });
      } else if (ROLE_GROUPS.STAFF.includes(user?.role)) {
        navigate("/staff/dashboard", { replace: true });
      } else if (ROLE_GROUPS.TRAINER.includes(user?.role)) {
        navigate("/trainer/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true }); // Fallback
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    setLoading(true);
    setButtonState("authenticating");
    try {
      const success = await login(email, password);

      if (success) {
        setButtonState("authorizing");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setButtonState("authorized");
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsLoggedIn(true);
        showToast.success("Login successful!");
      } else {
        setButtonState("error");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setButtonState("initial");
        showToast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setButtonState("error");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setButtonState("initial");
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
                    autoComplete="off"
                    onSubmit={handleSubmit}
                  >
                    <div className="card card-login">
                      <div className="card-header card-header-info text-center">
                        <h4 className="card-title">P.A.W STAFF PORTAL</h4>
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
                          className="btn btn-info btn-link btn-lg"
                          disabled={buttonState !== "initial"}
                        >
                          {buttonState === "initial" && (
                            <span className="font-weight-bold">Login</span>
                          )}
                          {buttonState === "authenticating" && (
                            <div className="d-flex align-items-center font-weight-bold">
                              Authenticating...
                              <div
                                style={{
                                  marginLeft: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <LoaderLogin />
                              </div>
                            </div>
                          )}
                          {buttonState === "authorizing" && (
                            <div className="d-flex align-items-center font-weight-bold">
                              Authorizing...
                              <div
                                style={{
                                  marginLeft: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <LoaderLogin />
                              </div>
                            </div>
                          )}
                          {buttonState === "authorized" && (
                            <span className="text-success font-weight-bold">
                              Authorized!
                            </span>
                          )}
                          {buttonState === "error" && (
                            <span className="text-danger font-weight-bold">
                              Wrong credentials
                            </span>
                          )}
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
