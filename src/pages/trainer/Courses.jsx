import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useNavigate } from "react-router-dom";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

const TrainerCourses = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");
        if (response.data.success && response.data.objectList) {
          setCourses(response.data.objectList);
          setFilteredCourses(response.data.objectList); // Initialize filteredCourses with all courses
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const [lastSearch, setLastSearch] = useState("");

  const handleSearch = () => {
    setLastSearch(searchTerm); // Store the last searched term
    if (searchTerm.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredCourses(courses);
    setLastSearch("");
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
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-icon card-header-rose">
                        <div className="card-icon">
                          <i className="material-icons">assignment</i>
                        </div>
                        <h4 className="card-title">Course List</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Search by name
                          </label>
                          <div className="col-sm-8">
                            <div className="form-group bmd-form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="courseName"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                aria-required="true"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button
                          type="button"
                          className="btn btn-fill btn-danger"
                          onClick={handleClear}
                        >
                          CLEAR
                        </button>
                        <button
                          type="button"
                          className="btn btn-fill btn-success"
                          onClick={handleSearch}
                        >
                          SEARCH
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {lastSearch !== "" && filteredCourses.length > 0 && (
                  <div className="row">
                    <div className="col-12 text-center">
                      <p className="font-weight-bold">
                        Displaying results for "{lastSearch}"
                      </p>
                    </div>
                  </div>
                )}
                <br /> <br />
                <div className="row">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <div key={course.id} className="col-md-4">
                        <div className="card card-chart">
                          <div
                            className="card-header card-header-warning"
                            data-header-animation="true"
                          >
                            <img
                              src={course.imageUrl}
                              alt={course.name}
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                          <div className="card-body">
                            <div class="card-actions">
                              <button
                                type="button"
                                class="btn btn-danger btn-link fix-broken-card"
                              >
                                <i class="material-icons">build</i> Fix Header!
                              </button>
                              <button
                                type="button"
                                className="btn btn-default btn-link"
                                onClick={() =>
                                  navigate(
                                    `/trainer/courses/details/${course.id}`
                                  )
                                }
                              >
                                <i className="material-icons">edit</i>
                              </button>
                            </div>
                            <h4 className="card-title">{course.name}</h4>
                            <p className="card-category">
                              Description: {course.description}
                            </p>
                          </div>
                          <div className="card-footer">
                            <div class="stats">
                              <i class="material-icons">group</i>{" "}
                              {course.minTrainers} - {course.maxTrainers}{" "}
                              trainer(s)
                            </div>
                            <div class="stats">
                              <i class="material-icons">schedule</i>{" "}
                              {course.durationInWeeks} week(s)
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : lastSearch !== "" ? ( // Show message only after searching
                    <p className="text-center w-100">
                      No courses found matching "{lastSearch}"
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default TrainerCourses;
