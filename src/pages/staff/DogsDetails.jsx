import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";

const StaffDogsDetails = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDogDetails = async () => {
      try {
        const response = await axios.get(`/api/dogs/${id}`);
        setDog(response.data);
      } catch (error) {
        console.error("Error fetching dog details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDogDetails();
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
                          src={dog.imageUrl || "/path/to/default/dog.jpg"}
                          alt={dog.name}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h4 className="card-title">{dog.name}</h4>
                        <p className="card-description">{dog.dogBreedName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-9">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Dog Information</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Owner Name</label>
                              <p className="form-control-static">
                                {dog.ownerName}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Date of Birth</label>
                              <p className="form-control-static">
                                {dog.dateOfBirth}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Gender</label>
                              <p className="form-control-static">
                                {dog.gender === 1 ? "Male" : "Female"}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Status</label>
                              <p className="form-control-static">
                                {dog.status === 1 ? (
                                  <span className="text-success">Active</span>
                                ) : (
                                  <span className="text-warning">Inactive</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Registration Time</label>
                              <p className="form-control-static">
                                {dog.registrationTime.split(" ")[0]}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Breed</label>
                              <p className="form-control-static">
                                {dog.dogBreedName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-9 offset-md-3">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Enrolled Classes</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table">
                            <thead className="text-primary">
                              <tr>
                                <th>Class Name</th>
                                <th>Start Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td colSpan="3" className="text-center">
                                  No classes enrolled
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-9 offset-md-3">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Certificates</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table">
                            <thead className="text-primary">
                              <tr>
                                <th>Certificate</th>
                                <th>Issue Date</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td colSpan="3" className="text-center">
                                  No certificates available
                                </td>
                              </tr>
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

export default StaffDogsDetails;
