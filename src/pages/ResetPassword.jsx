import axios from "../utils/axiosConfig";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/material-dashboard.min.css";
import Head from "../assets/components/common/Head";
import "../assets/css/background-pattern.css";
import Navbar from "../assets/components/auth/Navbar";
import Footer from "../assets/components/auth/Footer";
import { showToast, dismissToast } from "../utils/toastConfig";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    otpCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showToast.error("Passwords do not match");
      return;
    }

    const toastId = showToast.loading("Resetting password...");
    try {
      const response = await axios.put(
        `/api/accounts/forgotPassword?email=${encodeURIComponent(
          formData.email
        )}&otpCode=${encodeURIComponent(
          formData.otpCode
        )}&newPassword=${encodeURIComponent(formData.newPassword)}`
      );
      if (response.status === 200) {
        showToast.success("Password reset successfully", { id: toastId });
        setTimeout(() => {
          dismissToast();
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast.error(
        error.response?.data?.message || "Failed to reset password",
        {
          id: toastId,
        }
      );
    }
  };

  return (
    <div>
      <div className="pattern-background"></div>
      <Head />
      <body className="off-canvas-sidebar">
        <Navbar />
        <div className="wrapper wrapper-full-page">
          <div
            className="page-header login-page header-filter"
            filter-color="black"
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-8 ml-auto mr-auto">
                  <form className="form" onSubmit={handleSubmit}>
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
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </span>
                        <span className="bmd-form-group">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-icons">key</i>
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="OTP Code..."
                              name="otpCode"
                              value={formData.otpCode}
                              onChange={handleChange}
                              required
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
                              placeholder="New Password..."
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </span>
                        <span className="bmd-form-group">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-icons">lock_open</i>
                              </span>
                            </div>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Confirm Password..."
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </span>
                      </div>
                      <div className="card-footer justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-warning btn-link btn-lg"
                        >
                          RESET PASSWORD
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

export default ResetPassword;
