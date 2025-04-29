import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import "../../assets/css/course-details-custom.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating course:", error);
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
                  {/* First Row */}
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

                  {/* Second Row */}
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
                              <button className="btn btn-info btn-sm">
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
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
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
                <Rating
                  name="complexity"
                  value={updateFormData.complexity}
                  onChange={(event, newValue) => {
                    setUpdateFormData((prev) => ({
                      ...prev,
                      complexity: newValue,
                    }));
                  }}
                />
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
    </>
  );
};

export default TrainerCoursesDetails;
