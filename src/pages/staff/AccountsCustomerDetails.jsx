import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { Link } from "react-router-dom";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";

import { TablePagination } from "@mui/material";
import CustomTable from "../../assets/components/common/CustomTable";
import CustomPagination from "../../assets/components/common/CustomPagination";

const StaffAccountsCustomerDetails = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dogs, setDogs] = useState([]);
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
          axios.get(`/api/dogs/by-customer/${id}`),
        ]);
        setAccount(accountResponse.data);
        setDogs(dogsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
                              ? "/path/to/default/avatar.jpg"
                              : account.imageUrl
                          }
                          alt={account?.fullName || "Customer"}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h4 className="card-title">{account.fullName}</h4>
                        <p className="card-description">
                          Customer - Individual
                        </p>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm mr-2"
                      >
                        Reset Password
                      </button>
                      {account.status === 1 ? (
                        <button type="button" className="btn btn-danger btn-sm">
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Customer Information</h4>
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
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Gender</label>
                              <p className="form-control-static">
                                {account.gender === 1
                                  ? "Male"
                                  : account.gender === 2
                                    ? "Female"
                                    : "Other"}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Membership Points</label>
                              <p className="form-control-static">
                                {account.membershipPoints}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
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
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Customer's Dogs</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <CustomTable
                            columns={[
                              {
                                key: "imageUrl",
                                label: "Image",
                                render: (value, row) => (
                                  <img
                                    src={value}
                                    alt={row.name}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ),
                              },
                              { key: "name", label: "Name" },
                              { key: "dateOfBirth", label: "Date of Birth" },
                              {
                                key: "gender",
                                label: "Gender",
                                render: (value) =>
                                  value === 0 ? "Male" : "Female",
                              },
                              {
                                key: "status",
                                label: "Status",
                                render: (value) =>
                                  value === 1 ? "Active" : "Inactive",
                              },
                              { key: "dogBreedName", label: "Breed" },
                              {
                                key: "registrationTime",
                                label: "Registered Time",
                                render: (value) => value.split(" ")[0],
                              },
                            ]}
                            data={dogs}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            renderActions={(row) => (
                              <Link
                                to={`/staff/dogs/details/${row.id}`}
                                className="btn btn-info btn-sm"
                                data-original-title="View Details"
                                title="View Details"
                              >
                                <i className="material-icons">more_vert</i>
                              </Link>
                            )}
                          />
                          <CustomPagination
                            count={dogs.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
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

export default StaffAccountsCustomerDetails;
