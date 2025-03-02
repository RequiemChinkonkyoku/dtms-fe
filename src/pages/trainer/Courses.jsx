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
  const [imgUrl, setImgUrl] = useState("");
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [showBreedsModal, setShowBreedsModal] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lessonSearchTerm, setLessonSearchTerm] = useState("");
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    durationInWeeks: "",
    daysPerWeek: "",
    slotsPerDay: "",
    price: "",
    minTrainers: "",
    maxTrainers: "",
    categoryId: "",
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [breedSearchTerm, setBreedSearchTerm] = useState("");
  const [trainerId, setTrainerId] = useState(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get("/api/dogBreeds");
        if (response.data) {
          setBreeds(response.data);
        }
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };

    fetchBreeds();
  }, []);

  const getAccountIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));

      return payload.unique_name;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchTrainerProfile = async () => {
      try {
        const accountId = getAccountIdFromToken();
        console.log("Account ID:", accountId);
        if (!accountId) {
          console.error("No account ID found in token");
          return;
        }

        const response = await axios.get(`/api/trainerProfile/${accountId}`);
        console.log("Trainer profile response:", response.data);
        if (response.data) {
          setTrainerId(response.data.id);
        }
      } catch (error) {
        console.error("Error fetching trainer profile:", error);
      }
    };

    fetchTrainerProfile();
  }, []);

  const handleBreedSelection = (breedId) => {
    setSelectedBreeds((prev) => {
      if (prev.includes(breedId)) {
        return prev.filter((id) => id !== breedId);
      } else {
        return [...prev, breedId];
      }
    });
  };

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

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get("api/lessons");
        if (response.data.success && response.data.objectList) {
          setLessons(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
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

  const handleLessonSelection = (lessonId) => {
    setSelectedLessons((prev) => {
      if (prev.includes(lessonId)) {
        return prev.filter((id) => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const courseData = {
        name: newCourse.name,
        description: newCourse.description,
        status: 0,
        imageUrl: imgUrl,
        durationInWeeks: parseInt(newCourse.durationInWeeks),
        daysPerWeek: parseInt(newCourse.daysPerWeek),
        slotsPerDay: parseInt(newCourse.slotsPerDay),
        price: parseInt(newCourse.price),
        minDogs: 1,
        maxDogs: 5,
        minTrainers: parseInt(newCourse.minTrainers),
        maxTrainers: parseInt(newCourse.maxTrainers),
        complexity: 1,
        createdTrainerId: trainerId,
        categoryId: newCourse.categoryId,
        lessonIds: selectedLessons,
        dogBreedIds: selectedBreeds,
      };

      const response = await axios.post("/api/courses", courseData);
      if (response.data) {
        // Refresh the courses list
        const coursesResponse = await axios.get("/api/courses");
        if (coursesResponse.data.success && coursesResponse.data.objectList) {
          setCourses(coursesResponse.data.objectList);
          setFilteredCourses(coursesResponse.data.objectList);
        }

        // Close modal and reset form
        handleModalClose();
        // You might want to add a success notification here
      }
    } catch (error) {
      console.error("Error creating course:", error);
      // You might want to add an error notification here
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://localhost:7256/api/uploadFile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const imageUrl = await response.text();
      setImgUrl(imageUrl);
      // Update formData with the new imageUrl
      setFormData((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error appropriately
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
                              position: "fixed",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 1050,
                            }}
                          >
                            <div
                              className="modal-dialog modal-lg"
                              style={{
                                maxWidth: "800px",
                                margin: 0,
                                maxHeight: "90vh",
                                overflowY: "auto",
                              }}
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
                                            className="form-control"
                                            type="text"
                                            name="name"
                                            value={newCourse.name}
                                            onChange={handleInputChange}
                                            required
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
                                            name="durationInWeeks"
                                            value={newCourse.durationInWeeks}
                                            onChange={handleInputChange}
                                            required
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
                                            name="daysPerWeek"
                                            value={newCourse.daysPerWeek}
                                            onChange={handleInputChange}
                                            required
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
                                            name="slotsPerDay"
                                            value={newCourse.slotsPerDay}
                                            onChange={handleInputChange}
                                            required
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col-md-12">
                                        <label>Description </label>
                                        <div class="form-group bmd-form-group">
                                          <TextField
                                            id="outlined-multiline-flexible"
                                            multiline
                                            maxRows={4}
                                            fullWidth
                                            name="description"
                                            value={newCourse.description}
                                            onChange={handleInputChange}
                                            style={{ width: "100%" }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col-md-6">
                                        <label>
                                          Min Trainers{" "}
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
                                            name="minTrainers"
                                            value={newCourse.minTrainers}
                                            onChange={handleInputChange}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <label>
                                          Max Trainers{" "}
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
                                            name="maxTrainers"
                                            value={newCourse.maxTrainers}
                                            onChange={handleInputChange}
                                            required
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
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            style={{
                                              width: "100%",
                                              height: "36px",
                                              opacity: "1",
                                              position: "unset",
                                              pointerEvents: "auto",
                                              zIndex: "auto",
                                              cursor: "pointer",
                                            }}
                                          />
                                          {/* {imgUrl && (
                                            <img
                                              src={imgUrl}
                                              alt="Preview"
                                              style={{
                                                maxWidth: "100%",
                                                maxHeight: "100px",
                                                marginTop: "10px",
                                              }}
                                            />
                                          )} */}
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
                                            name="price"
                                            value={newCourse.price}
                                            onChange={handleInputChange}
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
                                    <div class="row">
                                      <div class="col-md-6">
                                        <label>
                                          Lessons{" "}
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
                                          <button
                                            type="button"
                                            className="btn btn-outline-primary w-100"
                                            onClick={() =>
                                              setShowLessonsModal(true)
                                            }
                                          >
                                            Select Lessons (
                                            {selectedLessons.length} selected)
                                          </button>
                                        </div>
                                        {showLessonsModal && (
                                          <div
                                            className="modal show"
                                            style={{
                                              display: "block",
                                              backgroundColor:
                                                "rgba(0,0,0,0.5)",
                                            }}
                                          >
                                            <div className="modal-dialog">
                                              <div className="modal-content">
                                                <div className="modal-header">
                                                  <h5 className="modal-title">
                                                    Select Lessons
                                                  </h5>
                                                  <button
                                                    type="button"
                                                    className="close"
                                                    onClick={() =>
                                                      setShowLessonsModal(false)
                                                    }
                                                  >
                                                    <span>&times;</span>
                                                  </button>
                                                </div>
                                                <div className="modal-body">
                                                  <input
                                                    type="text"
                                                    className="form-control mb-3"
                                                    placeholder="Search lessons..."
                                                    value={lessonSearchTerm}
                                                    onChange={(e) =>
                                                      setLessonSearchTerm(
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <div
                                                    style={{
                                                      maxHeight: "400px",
                                                      overflowY: "auto",
                                                    }}
                                                  >
                                                    {lessons
                                                      .filter((lesson) =>
                                                        lesson.lessonTitle
                                                          .toLowerCase()
                                                          .includes(
                                                            lessonSearchTerm.toLowerCase()
                                                          )
                                                      )
                                                      .map((lesson) => (
                                                        <div
                                                          key={lesson.id}
                                                          className="form-check"
                                                          style={{
                                                            padding: "12px",
                                                            borderBottom:
                                                              "1px solid #e0e0e0",
                                                            backgroundColor:
                                                              selectedLessons.includes(
                                                                lesson.id
                                                              )
                                                                ? "#e3f2fd"
                                                                : "transparent",
                                                            transition:
                                                              "background-color 0.2s ease",
                                                            marginBottom: "4px",
                                                            borderRadius: "4px",
                                                          }}
                                                        >
                                                          <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={selectedLessons.includes(
                                                              lesson.id
                                                            )}
                                                            onChange={() =>
                                                              handleLessonSelection(
                                                                lesson.id
                                                              )
                                                            }
                                                            id={`lesson-${lesson.id}`}
                                                          />
                                                          <label
                                                            className="form-check-label"
                                                            htmlFor={`lesson-${lesson.id}`}
                                                            style={{
                                                              cursor: "pointer",
                                                              marginLeft:
                                                                "10px",
                                                              fontWeight:
                                                                selectedLessons.includes(
                                                                  lesson.id
                                                                )
                                                                  ? "500"
                                                                  : "normal",
                                                            }}
                                                          >
                                                            {lesson.lessonTitle}
                                                          </label>
                                                        </div>
                                                      ))}
                                                  </div>
                                                </div>
                                                <div className="modal-footer">
                                                  <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                      setShowLessonsModal(false)
                                                    }
                                                  >
                                                    Done (
                                                    {selectedLessons.length}{" "}
                                                    selected)
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div class="col-md-6">
                                        <label>
                                          Dog Breeds{" "}
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
                                          <button
                                            type="button"
                                            className="btn btn-outline-primary w-100"
                                            onClick={() =>
                                              setShowBreedsModal(true)
                                            }
                                          >
                                            Select Dog Breeds (
                                            {selectedBreeds.length} selected)
                                          </button>
                                        </div>
                                      </div>
                                      {showBreedsModal && (
                                        <div
                                          className="modal show"
                                          style={{
                                            display: "block",
                                            backgroundColor: "rgba(0,0,0,0.5)",
                                          }}
                                        >
                                          <div className="modal-dialog">
                                            <div className="modal-content">
                                              <div className="modal-header">
                                                <h5 className="modal-title">
                                                  Select Dog Breeds
                                                </h5>
                                                <button
                                                  type="button"
                                                  className="close"
                                                  onClick={() =>
                                                    setShowBreedsModal(false)
                                                  }
                                                >
                                                  <span>&times;</span>
                                                </button>
                                              </div>
                                              <div className="modal-body">
                                                <input
                                                  type="text"
                                                  className="form-control mb-3"
                                                  placeholder="Search breeds..."
                                                  value={breedSearchTerm}
                                                  onChange={(e) =>
                                                    setBreedSearchTerm(
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                <div
                                                  style={{
                                                    maxHeight: "400px",
                                                    overflowY: "auto",
                                                  }}
                                                >
                                                  {breeds
                                                    .filter((breed) =>
                                                      breed.name
                                                        .toLowerCase()
                                                        .includes(
                                                          breedSearchTerm.toLowerCase()
                                                        )
                                                    )
                                                    .map((breed) => (
                                                      <div
                                                        key={breed.id}
                                                        className="form-check"
                                                        style={{
                                                          padding: "12px",
                                                          borderBottom:
                                                            "1px solid #e0e0e0",
                                                          backgroundColor:
                                                            selectedBreeds.includes(
                                                              breed.id
                                                            )
                                                              ? "#e3f2fd"
                                                              : "transparent",
                                                          transition:
                                                            "background-color 0.2s ease",
                                                          marginBottom: "4px",
                                                          borderRadius: "4px",
                                                        }}
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          className="form-check-input"
                                                          checked={selectedBreeds.includes(
                                                            breed.id
                                                          )}
                                                          onChange={() =>
                                                            handleBreedSelection(
                                                              breed.id
                                                            )
                                                          }
                                                          id={`breed-${breed.id}`}
                                                        />
                                                        <label
                                                          className="form-check-label"
                                                          htmlFor={`breed-${breed.id}`}
                                                          style={{
                                                            cursor: "pointer",
                                                            marginLeft: "10px",
                                                            fontWeight:
                                                              selectedBreeds.includes(
                                                                breed.id
                                                              )
                                                                ? "500"
                                                                : "normal",
                                                          }}
                                                        >
                                                          {breed.name}
                                                        </label>
                                                      </div>
                                                    ))}
                                                </div>
                                              </div>
                                              <div className="modal-footer">
                                                <button
                                                  type="button"
                                                  className="btn btn-primary"
                                                  onClick={() =>
                                                    setShowBreedsModal(false)
                                                  }
                                                >
                                                  Done ({selectedBreeds.length}{" "}
                                                  selected)
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
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
