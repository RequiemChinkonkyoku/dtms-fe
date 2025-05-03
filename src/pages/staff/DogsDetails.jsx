import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import CustomPagination from "../../assets/components/common/CustomPagination";
import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomFilter from "../../assets/components/common/CustomFilter";

const StaffDogsDetails = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [coursesData, setCoursesData] = useState({});
  const [classPage, setClassPage] = useState(0);
  const [classRowsPerPage, setClassRowsPerPage] = useState(5);
  const [classOrderBy, setClassOrderBy] = useState("startingDate");
  const [classOrder, setClassOrder] = useState("desc");

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

  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      try {
        const response = await axios.get(
          `/api/class/get-dog-enrolled-classes/${id}`
        );
        if (response.data.success) {
          const classes = response.data.objectList || [];
          setEnrolledClasses(classes);

          const coursePromises = classes.map((cls) =>
            axios.get(`/api/courses/${cls.courseId}`)
          );
          const courseResponses = await Promise.all(coursePromises);
          const courseData = {};
          courseResponses.forEach((response, index) => {
            if (response.data.success) {
              courseData[classes[index].courseId] = response.data.object.name;
            }
          });
          setCoursesData(courseData);
        }
      } catch (error) {
        console.error("Error fetching enrolled classes:", error);
      }
    };

    fetchEnrolledClasses();
  }, [id]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return <span className="text-warning">Inactive</span>;
      case 1:
        return <span className="text-success">Active</span>;
      case 2:
        return <span className="text-info">Ongoing</span>;
      case 3:
        return <span className="text-danger">Closed</span>;
      case 4:
        return <span className="text-primary">Completed</span>;
      default:
        return <span>Unknown</span>;
    }
  };

  const handleClassSort = (property) => {
    const isAsc = classOrderBy === property && classOrder === "asc";
    setClassOrder(isAsc ? "desc" : "asc");
    setClassOrderBy(property);
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
                          <CustomTable
                            columns={[
                              {
                                key: "name",
                                label: "Class Name",
                              },
                              {
                                key: "courseId",
                                label: "Course Name",
                                render: (value) =>
                                  coursesData[value] || "Loading...",
                              },
                              {
                                key: "startingDate",
                                label: "Starting Date",
                                render: (value) =>
                                  new Date(value).toLocaleDateString("en-GB"),
                              },
                              {
                                key: "createdTime",
                                label: "Enrolled Date",
                                render: (value) =>
                                  new Date(value).toLocaleDateString("en-GB"),
                              },
                              {
                                key: "status",
                                label: "Status",
                                render: (value) => getStatusLabel(value),
                              },
                            ]}
                            data={enrolledClasses}
                            page={classPage}
                            rowsPerPage={classRowsPerPage}
                            orderBy={classOrderBy}
                            order={classOrder}
                            onSort={handleClassSort}
                          />
                          <CustomPagination
                            count={enrolledClasses.length}
                            rowsPerPage={classRowsPerPage}
                            page={classPage}
                            onPageChange={(e, newPage) => setClassPage(newPage)}
                            onRowsPerPageChange={(e) => {
                              setClassRowsPerPage(parseInt(e.target.value, 10));
                              setClassPage(0);
                            }}
                          />
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
