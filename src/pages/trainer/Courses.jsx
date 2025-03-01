import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useNavigate } from "react-router-dom";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";

const TrainerCourses = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); // Add this line
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    durationInWeeks: "",
    minTrainers: "",
    maxTrainers: "",
    categoryId: "", // Add this line
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Add this useEffect to fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.data.success && response.data.objectList) {
          setCategories(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

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

  // Add these new functions
  const handleModalClose = () => {
    setShowModal(false);
    setNewCourse({
      name: "",
      description: "",
      durationInWeeks: "",
      minTrainers: "",
      maxTrainers: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your API call here to create the course
    console.log("New course data:", newCourse);
    handleModalClose();
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
                      <div className="card-header card-header-icon card-header-warning">
                        <div className="card-icon">
                          <i className="material-icons">search</i>
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
                        <div className="col-md-6">
                          <button
                            type="button"
                            className="btn btn-fill btn-info"
                            onClick={() => setShowModal(true)}
                          >
                            CREATE NEW COURSE
                          </button>
                        </div>

                        {/* Add Modal */}
                        {showModal && (
                          <div
                            className="modal show"
                            style={{
                              display: "block",
                              backgroundColor: "rgba(0,0,0,0.5)",
                            }}
                          >
                            <div
                              className="modal-dialog modal-lg"
                              style={{ maxWidth: "800px" }}
                            >
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">
                                    Create New Course
                                  </h5>
                                  <button
                                    type="button"
                                    className="close"
                                    onClick={handleModalClose}
                                  >
                                    <span>&times;</span>
                                  </button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                  <div className="modal-body">
                                    <div class="row">
                                      <div class="col-md-6">
                                        <label>
                                          Name{" "}
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "12px",
                                              verticalAlign: "top",
                                            }}
                                          >
                                            *
                                          </span>
                                        </label>
                                        <div class="form-group bmd-form-group">
                                          <input
                                            class="form-control"
                                            type="text"
                                            name="required"
                                            required="true"
                                            aria-required="true"
                                            aria-invalid="true"
                                          />
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <label>
                                          Category{" "}
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "12px",
                                              verticalAlign: "top",
                                            }}
                                          >
                                            *
                                          </span>
                                        </label>
                                        <div className="form-group bmd-form-group">
                                          <Select
                                            name="categoryId"
                                            value={newCourse.categoryId || ""}
                                            onChange={handleInputChange}
                                            displayEmpty
                                            size="small"
                                            style={{
                                              height: "36px",
                                              width: "100%",
                                            }}
                                          >
                                            <MenuItem value="">
                                              <em>Select a category</em>
                                            </MenuItem>
                                            {categories.map((category) => (
                                              <MenuItem
                                                key={category.id}
                                                value={category.id}
                                              >
                                                {category.name}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col-md-4">
                                        <label>
                                          Week(s){" "}
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "12px",
                                              verticalAlign: "top",
                                            }}
                                          >
                                            *
                                          </span>
                                        </label>
                                        <div class="form-group bmd-form-group">
                                          <input
                                            class="form-control"
                                            type="number"
                                            name="required"
                                            required="true"
                                            aria-required="true"
                                            aria-invalid="true"
                                          />
                                        </div>
                                      </div>
                                      <div class="col-md-4">
                                        <label>
                                          Days per week{" "}
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "12px",
                                              verticalAlign: "top",
                                            }}
                                          >
                                            *
                                          </span>
                                        </label>
                                        <div class="form-group bmd-form-group">
                                          <input
                                            class="form-control"
                                            type="number"
                                            name="required"
                                            required="true"
                                            aria-required="true"
                                            aria-invalid="true"
                                          />
                                        </div>
                                      </div>
                                      <div class="col-md-4">
                                        <label>
                                          Slots per day{" "}
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "12px",
                                              verticalAlign: "top",
                                            }}
                                          >
                                            *
                                          </span>
                                        </label>
                                        <div class="form-group bmd-form-group">
                                          <input
                                            class="form-control"
                                            type="number"
                                            name="required"
                                            required="true"
                                            aria-required="true"
                                            aria-invalid="true"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col-md-12">
                                        {" "}
                                        <label>Description </label>
                                        <div class="form-group bmd-form-group">
                                          <TextField
                                            id="outlined-multiline-flexible"
                                            multiline
                                            maxRows={4}
                                            fullWidth
                                            style={{ width: "100%" }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div class="row">
                                      {" "}
                                      <div class="col-md-6">
                                        <label>
                                          Image{" "}
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "12px",
                                              verticalAlign: "top",
                                            }}
                                          >
                                            *
                                          </span>
                                        </label>
                                        <div class="form-group bmd-form-group">
                                          <input
                                            class="form-control"
                                            type="text"
                                            name="required"
                                            required="true"
                                            aria-required="true"
                                            aria-invalid="true"
                                          />
                                        </div>
                                      </div>{" "}
                                      <div class="col-md-6">
                                        <label>
                                          Price{" "}
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "12px",
                                              verticalAlign: "top",
                                            }}
                                          >
                                            *
                                          </span>
                                        </label>
                                        <div class="form-group bmd-form-group">
                                          <Input
                                            id="standard-adornment-weight"
                                            endAdornment={
                                              <InputAdornment position="end">
                                                VND
                                              </InputAdornment>
                                            }
                                            aria-describedby="standard-weight-helper-text"
                                            inputProps={{
                                              "aria-label": "weight",
                                            }}
                                            style={{ width: "100%" }}
                                            type="number"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      onClick={handleModalClose}
                                    >
                                      Close
                                    </button>
                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                    >
                                      Create Course
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        )}
                        <div class="col-md-3">
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
