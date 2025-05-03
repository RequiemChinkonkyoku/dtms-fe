import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import "../../assets/css/course-details-custom.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";
import { showToast } from "../../utils/toastConfig";

import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableSortLabel,
  TablePagination,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import StarIcon from "@mui/icons-material/Star";

const TrainerCoursesDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const { loading, setLoading } = useLoading();
  const [trainerName, setTrainerName] = useState("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    name: "",
    description: "",
    status: 0,
    durationInWeeks: 1,
    daysPerWeek: 1,
    slotsPerDay: 1,
    price: 0,
    minDogs: 1,
    maxDogs: 5,
    minTrainers: 1,
    maxTrainers: 1,
    complexity: 1,
    categoryId: "",
    lessonIds: [],
    dogBreedIds: [],
  });
  const [categories, setCategories] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [complexityHover, setComplexityHover] = useState(-1);
  const complexityLabels = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
    4: "Expert",
    5: "Master",
  };
  const [openLessonModal, setOpenLessonModal] = useState(false);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [lessonPage, setLessonPage] = useState(0);
  const [lessonRowsPerPage, setLessonRowsPerPage] = useState(5);
  const [lessonOrderBy, setLessonOrderBy] = useState("lessonTitle");
  const [lessonOrder, setLessonOrder] = useState("asc");
  const [lessonSearchTerm, setLessonSearchTerm] = useState("");
  const [openBreedModal, setOpenBreedModal] = useState(false);
  const [availableBreeds, setAvailableBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [breedPage, setBreedPage] = useState(0);
  const [breedRowsPerPage, setBreedRowsPerPage] = useState(5);
  const [breedOrderBy, setBreedOrderBy] = useState("name");
  const [breedOrder, setBreedOrder] = useState("asc");
  const [breedSearchTerm, setBreedSearchTerm] = useState("");

  const handleBreedSort = (property) => {
    const isAsc = breedOrderBy === property && breedOrder === "asc";
    setBreedOrder(isAsc ? "desc" : "asc");
    setBreedOrderBy(property);
  };

  const handleSelectBreed = (breedId) => {
    setSelectedBreeds((prev) =>
      prev.includes(breedId)
        ? prev.filter((id) => id !== breedId)
        : [...prev, breedId]
    );
  };

  const sortedBreeds = React.useMemo(() => {
    const filtered = availableBreeds.filter((breed) =>
      breed.name.toLowerCase().includes(breedSearchTerm.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const isAsc = breedOrder === "asc";
      return isAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  }, [availableBreeds, breedOrderBy, breedOrder, breedSearchTerm]);

  const handleLessonSort = (property) => {
    const isAsc = lessonOrderBy === property && lessonOrder === "asc";
    setLessonOrder(isAsc ? "desc" : "asc");
    setLessonOrderBy(property);
  };

  const handleSelectLesson = (lessonId) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const sortedLessons = React.useMemo(() => {
    const filtered = availableLessons.filter((lesson) =>
      lesson.lessonTitle.toLowerCase().includes(lessonSearchTerm.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const isAsc = lessonOrder === "asc";
      if (lessonOrderBy === "lessonTitle") {
        return isAsc
          ? a.lessonTitle.localeCompare(b.lessonTitle)
          : b.lessonTitle.localeCompare(a.lessonTitle);
      }
      return isAsc
        ? a[lessonOrderBy] - b[lessonOrderBy]
        : b[lessonOrderBy] - a[lessonOrderBy];
    });
  }, [availableLessons, lessonOrderBy, lessonOrder, lessonSearchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.data.success) {
          setCategories(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`/api/courses/${id}`);
        if (response.data.success && response.data.object) {
          setCourse(response.data.object);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  useEffect(() => {
    if (course) {
      const fetchLessons = async () => {
        const lessonPromises = course.lessonIds.map(async (lessonId) => {
          try {
            const res = await axios.get(`/api/lessons/${lessonId}`);
            return res.data.object;
          } catch (error) {
            console.error(`Error fetching lesson ${lessonId}:`, error);
            return null;
          }
        });

        const lessonData = await Promise.all(lessonPromises);
        setLessons(lessonData.filter((lesson) => lesson !== null));
      };

      const fetchBreeds = async () => {
        const breedPromises = course.dogBreedIds.map(async (breedId) => {
          try {
            const res = await axios.get(`/api/dogBreeds/${breedId}`);
            return res.data;
          } catch (error) {
            console.error(`Error fetching breed ${breedId}:`, error);
            return null;
          }
        });

        const breedData = await Promise.all(breedPromises);
        setBreeds(breedData.filter((breed) => breed !== null));
      };

      const fetchCategory = async () => {
        try {
          const res = await axios.get(`/api/categories/${course.categoryId}`);
          setCategoryName(res.data.object.name);
        } catch (error) {
          console.error(`Error fetching category:`, error);
        }
      };
      const fetchTrainer = async () => {
        try {
          const res = await axios.get(
            `/api/accounts/${course.createdTrainerId}`
          );
          setTrainerName(res.data.fullName);
        } catch (error) {
          console.error(`Error fetching trainer:`, error);
        }
      };

      fetchTrainer();
      fetchCategory();
      fetchLessons();
      fetchBreeds();
    }
  }, [course]);

  useEffect(() => {
    if (course) {
      setUpdateFormData({
        id: course.id,
        name: course.name,
        description: course.description,
        status: course.status,
        durationInWeeks: course.durationInWeeks,
        daysPerWeek: course.daysPerWeek,
        slotsPerDay: course.slotsPerDay,
        price: course.price,
        minDogs: course.minDogs,
        maxDogs: course.maxDogs,
        minTrainers: course.minTrainers,
        maxTrainers: course.maxTrainers,
        complexity: course.complexity,
        categoryId: course.categoryId,
        lessonIds: course.courseLessons.map((lesson) => lesson.id),
        dogBreedIds: course.courseDogBreeds.map((breed) => breed.id),
      });
    }
  }, [course]);

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.put("/api/courses", updateFormData);
      if (response.data.success) {
        setOpenUpdateModal(false);
        showToast.success("Course updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating course:", error);
      showToast.error("Failed to update course. Please try again.");
    }
  };

  if (!course) return <p className="text-center">Course not found.</p>;

  return (
    <>
      <Head />
      <div className="pattern-background" />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel ps-container ps-theme-default">
          <Navbar />
          <div className="content">
            <div className="container-fluid">
              {loading ? (
                <div className="text-center p-5">
                  <Loader />
                </div>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-9">
                      <div className="card">
                        <div className="card-header card-header-primary">
                          <h4 className="card-title">Course Information</h4>
                          <p className="card-category">Basic Details</p>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <h6>Course Name</h6>
                              <p
                                className="text-primary"
                                style={{ fontSize: "1.25rem" }}
                              >
                                {course.name}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <h6>Category</h6>
                              <p
                                className="text-info"
                                style={{ fontSize: "1.25rem" }}
                              >
                                {categoryName || "Loading..."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-warning btn-block"
                        disabled={course.createdTrainerId !== user.unique_name}
                        onClick={() => setOpenUpdateModal(true)}
                      >
                        <i className="material-icons">edit</i> Update Course
                      </button>
                      {course.createdTrainerId !== user.unique_name && (
                        <p className="text-danger small mt-2 text-center">
                          You are not the creator of the course
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-9">
                      <div className="card">
                        <div className="card-header card-header-warning">
                          <h4 className="card-title">Course Details</h4>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12">
                              <h6>Description</h6>
                              <p>{course.description}</p>
                            </div>
                            <div className="col-md-4">
                              <h6>Duration</h6>
                              <p>{course.durationInWeeks} week(s)</p>
                            </div>
                            <div className="col-md-4">
                              <h6>Schedule</h6>
                              <p>
                                {course.daysPerWeek} days/week,{" "}
                                {course.slotsPerDay} slots/day
                              </p>
                            </div>
                            <div className="col-md-4">
                              <h6>Trainers Required</h6>
                              <p>
                                {course.minTrainers} - {course.maxTrainers}
                              </p>
                            </div>
                            <div className="col-md-4">
                              <h6>Complexity</h6>
                              <div style={{ verticalAlign: "middle" }}>
                                {[...Array(5)].map((_, index) => (
                                  <i
                                    key={index}
                                    className="material-icons"
                                    style={{ fontSize: "18px" }}
                                  >
                                    {index < course.complexity
                                      ? "star"
                                      : "star_border"}
                                  </i>
                                ))}
                              </div>
                            </div>
                            <div className="col-md-4">
                              <h6>Status</h6>
                              <p
                                className={
                                  course.status === 1
                                    ? "text-success"
                                    : "text-warning"
                                }
                              >
                                {course.status === 1 ? "Active" : "Inactive"}
                              </p>
                            </div>
                            <div className="col-md-4">
                              <h6>Price</h6>
                              <p>{course.price.toLocaleString()} VND</p>
                            </div>
                            <div className="col-md-12 text-right mt-3">
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => setOpenImageModal(true)}
                              >
                                <i className="material-icons">image</i> View
                                Image
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card">
                        <div className="card-header card-header-info">
                          <h4 className="card-title">Author</h4>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12">
                              <h6>Trainer:</h6>
                              <p className="text-primary">
                                {trainerName || "Loading..."}
                              </p>
                              <h6>Created:</h6>
                              <p className="text-muted">
                                {new Date(course.createdTime).toLocaleString()}
                              </p>
                              <h6>Last Updated:</h6>
                              <p className="text-muted">
                                {new Date(
                                  course.lastUpdatedTime
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third Row */}
                  <div className="row">
                    <div className="col-md-9">
                      <div className="card">
                        <div className="card-header card-header-rose">
                          <h4 className="card-title">Course Content</h4>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row mb-4">
                                <div className="col-md-12">
                                  <h6>Lessons</h6>
                                  {course.courseLessons.length > 0 ? (
                                    <div className="table-responsive">
                                      <table className="table">
                                        <thead className="text-primary">
                                          <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th className="text-right">
                                              Actions
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {course.courseLessons.map(
                                            (lesson, index) => (
                                              <tr key={lesson.id}>
                                                <td>{index + 1}</td>
                                                <td>{lesson.name}</td>
                                                <td className="text-right">
                                                  <button
                                                    className="btn btn-info btn-sm"
                                                    title="View Details"
                                                  >
                                                    <i className="material-icons">
                                                      visibility
                                                    </i>
                                                  </button>
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <p className="text-muted">
                                      No lessons assigned
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <h6>Dog Breeds</h6>
                              <div className="d-flex flex-wrap">
                                {course.courseDogBreeds.map((breed) => (
                                  <span
                                    key={breed.id}
                                    className="badge badge-pill badge-info"
                                    style={{
                                      fontSize: "12px",
                                      padding: "6px 10px",
                                      margin: "0 3px 3px 0",
                                    }}
                                  >
                                    <i
                                      className="material-icons"
                                      style={{
                                        fontSize: "12px",
                                        marginRight: "3px",
                                      }}
                                    >
                                      pets
                                    </i>
                                    {breed.name}
                                  </span>
                                ))}
                                {course.courseDogBreeds.length === 0 && (
                                  <p className="text-muted">
                                    No specific breed requirements
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Update Course</DialogTitle>
        <DialogContent>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={updateFormData.name}
                  onChange={handleUpdateInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label>Category</label>
              <FormControl fullWidth>
                <Select
                  name="categoryId"
                  value={updateFormData.categoryId}
                  onChange={handleUpdateInputChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              name="description"
              value={updateFormData.description}
              onChange={handleUpdateInputChange}
            />
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Duration (weeks)</label>
                <input
                  type="number"
                  className="form-control"
                  name="durationInWeeks"
                  value={updateFormData.durationInWeeks}
                  onChange={handleUpdateInputChange}
                  min="1"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Days per Week</label>
                <input
                  type="number"
                  className="form-control"
                  name="daysPerWeek"
                  value={updateFormData.daysPerWeek}
                  onChange={handleUpdateInputChange}
                  min="1"
                  max="7"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Slots per Day</label>
                <input
                  type="number"
                  className="form-control"
                  name="slotsPerDay"
                  value={updateFormData.slotsPerDay}
                  onChange={handleUpdateInputChange}
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Price (VND)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={updateFormData.price}
                  onChange={handleUpdateInputChange}
                  min="0"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Complexity</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  <Rating
                    name="complexity"
                    value={updateFormData.complexity}
                    precision={1}
                    max={5}
                    onChange={(event, newValue) => {
                      setUpdateFormData((prev) => ({
                        ...prev,
                        complexity: newValue,
                      }));
                    }}
                    onChangeActive={(event, newHover) => {
                      setComplexityHover(newHover);
                    }}
                    icon={
                      <StarIcon
                        style={{
                          fontSize: "2rem",
                          color: "#ffd700",
                        }}
                      />
                    }
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.6, fontSize: "2rem" }} />
                    }
                    sx={{
                      fontSize: "2rem",
                      "& .MuiRating-iconHover": {
                        color: "#ffd700",
                      },
                    }}
                  />
                  {updateFormData.complexity !== null && (
                    <Box sx={{ ml: 2, fontSize: "1rem" }}>
                      {
                        complexityLabels[
                          complexityHover !== -1
                            ? complexityHover
                            : updateFormData.complexity
                        ]
                      }
                    </Box>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Min Trainers</label>
                <input
                  type="number"
                  className="form-control"
                  name="minTrainers"
                  value={updateFormData.minTrainers}
                  onChange={handleUpdateInputChange}
                  min="1"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Max Trainers</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxTrainers"
                  value={updateFormData.maxTrainers}
                  onChange={handleUpdateInputChange}
                  min="1"
                />
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-info"
                  onClick={async () => {
                    try {
                      const response = await axios.get("/api/lessons");
                      if (response.data.success) {
                        setAvailableLessons(response.data.objectList);
                        setSelectedLessons(updateFormData.lessonIds);
                        setOpenLessonModal(true);
                      }
                    } catch (error) {
                      console.error("Error fetching lessons:", error);
                      showToast.error("Failed to fetch lessons");
                    }
                  }}
                >
                  <i className="material-icons">list</i> Manage Lessons
                </button>
                <button
                  className="btn btn-success"
                  onClick={async () => {
                    try {
                      const response = await axios.get("/api/dogBreeds");
                      if (response.data) {
                        setAvailableBreeds(response.data);
                        setSelectedBreeds(updateFormData.dogBreedIds);
                        setOpenBreedModal(true);
                      }
                    } catch (error) {
                      console.error("Error fetching dog breeds:", error);
                      showToast.error("Failed to fetch dog breeds");
                    }
                  }}
                >
                  <i className="material-icons">pets</i> Manage Dog Breeds
                </button>
                <button className="btn btn-primary">
                  <i className="material-icons">check_circle</i> Manage
                  Prerequisites
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-secondary"
            onClick={() => setOpenUpdateModal(false)}
          >
            Cancel
          </button>
          <button className="btn btn-warning" onClick={handleUpdateSubmit}>
            Update Course
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Course Image</DialogTitle>
        <DialogContent>
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course.name}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "contain",
              }}
            />
          ) : (
            <div className="text-center text-muted p-5">No image available</div>
          )}
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-secondary"
            onClick={() => setOpenImageModal(false)}
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openLessonModal}
        onClose={() => setOpenLessonModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Manage Course Lessons</DialogTitle>
        <DialogContent>
          {loading ? (
            <div className="text-center p-4">
              <Loader />
            </div>
          ) : (
            <div className="table-responsive">
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", gap: "16px" }}>
                  <TextField
                    label="Search lesson..."
                    variant="outlined"
                    size="small"
                    value={lessonSearchTerm}
                    onChange={(e) => setLessonSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          sortedLessons.length > 0 &&
                          sortedLessons.every((lesson) =>
                            selectedLessons.includes(lesson.id)
                          )
                        }
                        onChange={() => {
                          const allSelected =
                            sortedLessons.length > 0 &&
                            sortedLessons.every((lesson) =>
                              selectedLessons.includes(lesson.id)
                            );
                          setSelectedLessons(
                            allSelected
                              ? []
                              : sortedLessons.map((lesson) => lesson.id)
                          );
                        }}
                      />
                    </th>
                    {[
                      ["lessonTitle", "Title"],
                      ["environment", "Environment"],
                      ["duration", "Duration (slots)"],
                    ].map(([key, label]) => (
                      <th key={key}>
                        <TableSortLabel
                          active={lessonOrderBy === key}
                          direction={
                            lessonOrderBy === key ? lessonOrder : "asc"
                          }
                          onClick={() => handleLessonSort(key)}
                        >
                          {label}
                        </TableSortLabel>
                      </th>
                    ))}
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLessons
                    .slice(
                      lessonPage * lessonRowsPerPage,
                      lessonPage * lessonRowsPerPage + lessonRowsPerPage
                    )
                    .map((lesson) => (
                      <tr key={lesson.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedLessons.includes(lesson.id)}
                            onChange={() => handleSelectLesson(lesson.id)}
                          />
                        </td>
                        <td>{lesson.lessonTitle}</td>
                        <td>{lesson.environment}</td>
                        <td>{lesson.duration}</td>
                        <td className="td-actions text-right">
                          <button
                            type="button"
                            rel="tooltip"
                            className={`btn btn-sm mr-2 ${
                              selectedLessons.includes(lesson.id)
                                ? "btn-danger"
                                : "btn-info"
                            }`}
                            onClick={() => handleSelectLesson(lesson.id)}
                          >
                            <i className="material-icons">
                              {selectedLessons.includes(lesson.id)
                                ? "remove"
                                : "add"}
                            </i>
                          </button>
                          <button
                            type="button"
                            rel="tooltip"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              window.open(
                                `/trainer/lessons/${lesson.id}`,
                                "_blank"
                              );
                            }}
                          >
                            <i className="material-icons">info</i>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedLessons.length}
                rowsPerPage={lessonRowsPerPage}
                page={lessonPage}
                onPageChange={(event, newPage) => setLessonPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setLessonRowsPerPage(parseInt(event.target.value, 10));
                  setLessonPage(0);
                }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenLessonModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setUpdateFormData((prev) => ({
                ...prev,
                lessonIds: selectedLessons,
              }));
              setOpenLessonModal(false);
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openBreedModal}
        onClose={() => setOpenBreedModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Dog Breeds</DialogTitle>
        <DialogContent>
          {loading ? (
            <div className="text-center p-4">
              <Loader />
            </div>
          ) : (
            <div className="table-responsive">
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <TextField
                  label="Search breed..."
                  variant="outlined"
                  size="small"
                  value={breedSearchTerm}
                  onChange={(e) => setBreedSearchTerm(e.target.value)}
                />
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          sortedBreeds.length > 0 &&
                          sortedBreeds.every((breed) =>
                            selectedBreeds.includes(breed.id)
                          )
                        }
                        onChange={() => {
                          const allSelected =
                            sortedBreeds.length > 0 &&
                            sortedBreeds.every((breed) =>
                              selectedBreeds.includes(breed.id)
                            );
                          setSelectedBreeds(
                            allSelected
                              ? []
                              : sortedBreeds.map((breed) => breed.id)
                          );
                        }}
                      />
                    </th>
                    <th>
                      <TableSortLabel
                        active={breedOrderBy === "name"}
                        direction={breedOrderBy === "name" ? breedOrder : "asc"}
                        onClick={() => handleBreedSort("name")}
                      >
                        Name
                      </TableSortLabel>
                    </th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBreeds
                    .slice(
                      breedPage * breedRowsPerPage,
                      breedPage * breedRowsPerPage + breedRowsPerPage
                    )
                    .map((breed) => (
                      <tr key={breed.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedBreeds.includes(breed.id)}
                            onChange={() => handleSelectBreed(breed.id)}
                          />
                        </td>
                        <td>{breed.name}</td>
                        <td className="td-actions text-right">
                          <button
                            type="button"
                            rel="tooltip"
                            className={`btn btn-sm mr-2 ${
                              selectedBreeds.includes(breed.id)
                                ? "btn-danger"
                                : "btn-info"
                            }`}
                            onClick={() => handleSelectBreed(breed.id)}
                          >
                            <i className="material-icons">
                              {selectedBreeds.includes(breed.id)
                                ? "remove"
                                : "add"}
                            </i>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedBreeds.length}
                rowsPerPage={breedRowsPerPage}
                page={breedPage}
                onPageChange={(event, newPage) => setBreedPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setBreedRowsPerPage(parseInt(event.target.value, 10));
                  setBreedPage(0);
                }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenBreedModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setUpdateFormData((prev) => ({
                ...prev,
                dogBreedIds: selectedBreeds,
              }));
              setOpenBreedModal(false);
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TrainerCoursesDetails;
