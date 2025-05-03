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

import { showToast, dismissToast } from "../utils/toastConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { loading, setLoading } = useLoading();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = showToast.loading("Sending OTP to your email...");
    try {
      const response = await axios.post(
        `/api/accounts/forgotPassword?email=${email}`
      );
      if (response.status === 200) {
        showToast.success("OTP has been sent to your email", { id: toastId });
        setTimeout(() => {
          dismissToast();
          navigate("/reset-password");
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast.error(error.response?.data?.message || "Failed to send OTP", {
        id: toastId,
      });
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
                  <form className="form" method="" action="" autoComplete="off">
                    <div className="card card-login">
                      <div className="card-header card-header-warning text-center">
                        <h4 className="card-title">DTMS STAFF PORTAL</h4>
                        <div class="social-line">
                          <i class="material-icons">pets</i>
                        </div>
                      </div>
                      <div className="card-body ">
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
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </span>
                      </div>
                      <div className="card-footer justify-content-center">
                        <button
                          className="btn btn-warning btn-link btn-lg"
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          {loading ? "SENDING..." : "SEND"}
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

export default ForgotPassword;
