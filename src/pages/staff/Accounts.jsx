import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    total: 0,
    customers: 0,
    trainers: 0,
    staff: 0,
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/api/accounts"); // Adjust the endpoint as needed
        const accountsData = response.data;
        setAccounts(accountsData);

        // Calculate counts
        const total = accountsData.length;
        const customers = accountsData.filter(
          (account) => account.profileType === 1
        ).length;
        const trainers = accountsData.filter(
          (account) => account.profileType === 2
        ).length;
        const staff = accountsData.filter(
          (account) => account.profileType === 3
        ).length;

        setCounts({ total, customers, trainers, staff });
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case -1:
        return "Disabled";
      case 0:
        return "Inactive";
      case 1:
        return "Active";
      default:
        return "Unknown";
    }
  };

  const getProfileTypeText = (profileType) => {
    switch (profileType) {
      case 1:
        return "Customer";
      case 2:
        return "Trainer";
      case 3:
        return "Staff";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case -1:
        return "text-danger";
      case 0:
        return "text-warning";
      case 1:
        return "text-success";
      default:
        return "";
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head />
      <body>
        <div className="wrapper">
          <Sidebar />
          <div className="main-panel ps-container ps-theme-default">
            <Navbar />
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">group</i>
                        </div>
                        <p className="card-category">Total accounts</p>
                        <h3 className="card-title">{counts.total}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">
                            <span className="material-symbols-outlined">
                              accessibility_new
                            </span>
                          </i>
                        </div>
                        <p className="card-category">Customers</p>
                        <h3 className="card-title">{counts.customers}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-success card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">person_add</i>
                        </div>
                        <p className="card-category">Trainers</p>
                        <h3 className="card-title">{counts.trainers}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">manage_accounts</i>
                        </div>
                        <p className="card-category">Staff</p>
                        <h3 className="card-title">{counts.staff}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">groups</i>
                        </div>
                        <h4 className="card-title">Account management</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Full Name</th>
                                <th>Phone Number</th>
                                <th>Status</th>
                                <th>Profile Type</th>
                                <th className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {accounts.map((account, index) => (
                                <tr key={account.id}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>{account.username}</td>
                                  <td>{account.email}</td>
                                  <td>{account.fullName}</td>
                                  <td>{account.phoneNumber}</td>
                                  <td
                                    className={getStatusClass(account.status)}
                                  >
                                    {getStatusText(account.status)}
                                  </td>
                                  <td>
                                    {getProfileTypeText(account.profileType)}
                                  </td>
                                  <td className="td-actions text-right">
                                    <button
                                      type="button"
                                      rel="tooltip"
                                      className="btn btn-info"
                                      data-original-title=""
                                      title=""
                                    >
                                      <i className="material-icons">person</i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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

export default Accounts;
