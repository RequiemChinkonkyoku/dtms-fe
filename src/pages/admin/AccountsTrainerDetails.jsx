import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { Link } from "react-router-dom";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/admin/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/admin/Navbar";
import { showToast, dismissToast } from "../../utils/toastConfig";

const AccountsTrainerDetails = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(`/api/accounts/${id}`);
        setAccount(response.data);
      } catch (error) {
        console.error("Error fetching account details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountResponse, dogsResponse] = await Promise.all([
          axios.get(`/api/accounts/${id}`),
        ]);
        setAccount(accountResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleResetPassword = async () => {
    try {
      showToast.loading("Sending reset password email...");
      await axios.post(`/api/accounts/forgotPassword?email=${account.email}`);
      dismissToast();
      showToast.success("Password reset email has been sent");
    } catch (error) {
      dismissToast();
      showToast.error("Failed to send password reset email");
      console.error("Error resetting password:", error);
    }
  };

  const handleDeactivate = async () => {
    try {
      await axios.delete(`/api/accounts/${id}`);

      const response = await axios.get(`/api/accounts/${id}`);
      setAccount(response.data);
      showToast.success("Account has been deactivated");
    } catch (error) {
      showToast.error("Failed to deactivate account");
      console.error("Error deactivating account:", error);
    }
  };

  const handleActivate = async () => {
    try {
      await axios.put(`/api/accounts/${id}/activate`);

      const response = await axios.get(`/api/accounts/${id}`);
      setAccount(response.data);
      showToast.success("Account has been activated");
    } catch (error) {
      showToast.error("Failed to activate account");
      console.error("Error activating account:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Head />
      <body>
        <div className="pattern-background" />
        <div className="wrapper">
          <Sidebar />
          <div className="main-panel ps-container ps-theme-default">
            <Navbar />
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-3">
                    <div className="card card-profile">
                      <div className="card-avatar">
                        <img
                          className="img"
                          src={
                            !account || account.imageUrl === "empty"
                              ? "/src/assets/img/noway.jpg"
                              : account.imageUrl
                          }
                          alt={account?.fullName || "Trainer"}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h4 className="card-title">{account.fullName}</h4>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm mr-2"
                        onClick={handleResetPassword}
                      >
                        Reset Password
                      </button>
                      {account.status === 1 ? (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={handleDeactivate}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={handleActivate}
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Trainer Information</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Username</label>
                              <p className="form-control-static">
                                {account.username}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Email</label>
                              <p className="form-control-static">
                                {account.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Phone Number</label>
                              <p className="form-control-static">
                                {account.phoneNumber}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Date of Birth</label>
                              <p className="form-control-static">
                                {new Date(
                                  account.dateOfBirth
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label>Address</label>
                              <p className="form-control-static">
                                {account.address}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Gender</label>
                              <p className="form-control-static">
                                {account.gender === 0
                                  ? "Male"
                                  : account.gender === 1
                                    ? "Female"
                                    : "Other"}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Status</label>
                              <p className="form-control-static">
                                {account.status === 1 ? (
                                  <span class="text-success">Active</span>
                                ) : account.status === 0 ? (
                                  <span class="text-warning">Inactive</span>
                                ) : (
                                  <span class="text-danger">Deactivated</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default AccountsTrainerDetails;
