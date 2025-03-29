import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";

const StaffDashboard = () => {
  const [counts, setCounts] = useState({
    classes: 0,
    accounts: 0,
    dogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [upcomingClasses, setUpcomingClasses] = useState([]);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [classesRes, accountsRes, dogsRes] = await Promise.all([
        axios.get("/api/class"),
        axios.get("/api/accounts"),
        axios.get("/api/dogs"),
      ]);

      // Set counts as before
      setCounts({
        classes: classesRes.data.objectList?.length || 0,
        accounts: accountsRes.data?.length || 0,
        dogs: dogsRes.data?.length || 0,
      });

      // Process upcoming classes
      const now = new Date();
      const oneMonthFromNow = new Date(now.setMonth(now.getMonth() + 1));

      const upcoming =
        classesRes.data.objectList?.filter((classItem) => {
          const startDate = new Date(classItem.startingDate);
          return startDate > new Date() && startDate <= oneMonthFromNow;
        }) || [];

      setUpcomingClasses(upcoming);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

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
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">class</i>
                        </div>
                        <p className="card-category">Total Classes</p>
                        <h3 className="card-title">{counts.classes}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">group</i>
                        </div>
                        <p className="card-category">Total Accounts</p>
                        <h3 className="card-title">{counts.accounts}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">pets</i>
                        </div>
                        <p className="card-category">Total Dogs</p>
                        <h3 className="card-title">{counts.dogs}</h3>
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
                  <div className="col-lg-8 col-md-8">
                    <div className="card">
                      <div className="card-header card-header-warning">
                        <h4 className="card-title">Today's Classes</h4>
                        <p className="card-category">
                          Classes scheduled for today
                        </p>
                      </div>
                      <div className="card-body table-responsive">
                        <table className="table table-hover">
                          <thead className="text-warning">
                            <tr>
                              <th>Class Name</th>
                              <th>Time</th>
                              <th>Trainer</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan="4" className="text-center">
                                Data will be implemented later
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="card">
                      <div className="card-header card-header-info">
                        <h4 className="card-title">Upcoming Classes</h4>
                        <p className="card-category">
                          Next scheduled classes within 1 month
                        </p>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table">
                            <tbody>
                              {upcomingClasses.length === 0 ? (
                                <tr>
                                  <td className="text-center">
                                    No upcoming classes
                                  </td>
                                </tr>
                              ) : (
                                upcomingClasses.map((classItem) => (
                                  <tr key={classItem.id}>
                                    <td>
                                      <p className="mb-0">
                                        <strong>{classItem.name}</strong>
                                      </p>
                                      <small className="text-muted">
                                        {classItem.courseName}
                                      </small>
                                      <br />
                                      <small className="text-info">
                                        Starts:{" "}
                                        {new Date(
                                          classItem.startingDate
                                        ).toLocaleDateString()}
                                      </small>
                                    </td>
                                  </tr>
                                ))
                              )}
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

export default StaffDashboard;
