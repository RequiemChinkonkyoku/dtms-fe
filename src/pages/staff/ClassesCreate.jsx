import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const StaffClassesCreate = () => {
  const [className, setClassName] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      if (response.data.success) {
        setCourses(response.data.objectList);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("/api/schedules");
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Add new state at the top with other states
  const [categoryName, setCategoryName] = useState("");
  const [lessonTitles, setLessonTitle] = useState([]);
  const [dogBreedNames, setDogBreedNames] = useState([]);

  // Add new function after other fetch functions
  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await axios.get(`/api/categories/${categoryId}`);
      if (response.data.success) {
        setCategoryName(response.data.object.name);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const fetchLessonNames = async (lessonIds) => {
    try {
      const names = await Promise.all(
        lessonIds.map(async (id) => {
          const response = await axios.get(`/api/lessons/${id}`);
          return response.data.success ? response.data.object.lessonTitle : id;
        })
      );
      setLessonTitle(names);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const fetchDogBreedNames = async (breedIds) => {
    try {
      const names = await Promise.all(
        breedIds.map(async (id) => {
          const response = await axios.get(`/api/dogBreeds/${id}`);
          return response.data.name;
        })
      );
      console.log("Dog breed names fetched:", names);
      setDogBreedNames(names);
    } catch (error) {
      console.error("Error fetching dog breeds:", error);
    }
  };

  // Modify fetchCourseDetails to include category fetch
  const fetchCourseDetails = async (courseId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/courses/${courseId}`);
      if (response.data.success) {
        setSelectedCourse(response.data.object);
        if (response.data.object.categoryId) {
          await fetchCategoryName(response.data.object.categoryId);
        }
        if (response.data.object.lessonIds?.length > 0) {
          await fetchLessonNames(response.data.object.lessonIds);
        }
        if (response.data.object.dogBreedIds?.length > 0) {
          await fetchDogBreedNames(response.data.object.dogBreedIds);
        }
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head />
      <body>
        <div class="wrapper">
          <Sidebar />
          <div class="main-panel ps-container ps-theme-default">
            <Navbar />
            <div class="content">
              <div class="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Class Information</h4>
                        <p className="card-category">
                          Enter basic class details
                        </p>
                      </div>
                      <div className="card-body">
                        <div className="form-group">
                          <label className="bmd-label-floating">
                            Class Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-info">
                        <h4 className="card-title">Course Selection</h4>
                        <p className="card-category">
                          Choose and view course details
                        </p>
                      </div>
                      <div className="card-body">
                        <br />
                        <div style={{ width: "50%" }}>
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="course-select-label">
                                Select Course
                              </InputLabel>
                              <Select
                                labelId="course-select-label"
                                id="course-select"
                                value={selectedCourse?.id || ""}
                                label="Select Course"
                                onChange={(e) =>
                                  fetchCourseDetails(e.target.value)
                                }
                              >
                                <MenuItem value="">
                                  <em>Choose a course</em>
                                </MenuItem>
                                {courses.map((course) => (
                                  <MenuItem key={course.id} value={course.id}>
                                    {course.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </div>

                        {loading && <Loader />}

                        {selectedCourse && !loading && (
                          <div className="table-responsive">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className="col-md-2">
                                    <strong>Name</strong>
                                  </td>
                                  <td className="col-md-4">
                                    {selectedCourse.name}
                                  </td>
                                  <td className="col-md-2">
                                    <strong>Status</strong>
                                  </td>
                                  <td className="col-md-4">
                                    {selectedCourse.status === 1
                                      ? "Active"
                                      : "Inactive"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Description</strong>
                                  </td>
                                  <td colSpan="3">
                                    {selectedCourse.description}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Duration</strong>
                                  </td>
                                  <td>
                                    {selectedCourse.durationInWeeks} week(s)
                                  </td>
                                  <td>
                                    <strong>Price</strong>
                                  </td>
                                  <td>${selectedCourse.price}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Schedule</strong>
                                  </td>
                                  <td>
                                    {selectedCourse.daysPerWeek} day(s)/week,{" "}
                                    {selectedCourse.slotsPerDay} slot(s)/day
                                  </td>
                                  <td>
                                    <strong>Trainers</strong>
                                  </td>
                                  <td>
                                    {selectedCourse.minTrainers} -{" "}
                                    {selectedCourse.maxTrainers}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Complexity</strong>
                                  </td>
                                  <td style={{ verticalAlign: "middle" }}>
                                    {[...Array(5)].map((_, index) => (
                                      <i
                                        key={index}
                                        className="material-icons"
                                        style={{ fontSize: "18px" }}
                                      >
                                        {index < selectedCourse.complexity
                                          ? "star"
                                          : "star_border"}
                                      </i>
                                    ))}
                                  </td>
                                  <td>
                                    <strong>Category</strong>
                                  </td>
                                  <td>{categoryName}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Prerequisites</strong>
                                  </td>
                                  <td colSpan="3">
                                    {selectedCourse.prerequisiteIds?.length > 0
                                      ? selectedCourse.prerequisiteIds.join(
                                          ", "
                                        )
                                      : "None"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Lessons</strong>
                                  </td>
                                  <td colSpan="3">
                                    {lessonTitles.length > 0
                                      ? lessonTitles.join(", ")
                                      : "None"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Dog Breeds</strong>
                                  </td>
                                  <td colSpan="3">
                                    {selectedCourse.dogBreedIds?.length > 0 &&
                                    dogBreedNames.length > 0
                                      ? dogBreedNames.join(", ")
                                      : "None"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-rose">
                        <h4 className="card-title">Class Schedule</h4>
                        <p className="card-category">
                          Select class dates and times
                        </p>
                      </div>
                      <div className="card-body">
                        {/* Calendar will go here */}
                      </div>
                      <div className="card-body">
                        <div style={{ width: "50%" }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Start Date"
                              value={startDate}
                              onChange={(newValue) => setStartDate(newValue)}
                              minDate={dayjs()}
                              sx={{ width: "100%" }}
                            />
                          </LocalizationProvider>
                        </div>
                        <div className="table-responsive mt-4">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Time</th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                                <th>Saturday</th>
                                <th>Sunday</th>
                              </tr>
                            </thead>
                            <tbody>
                              {schedules.map((schedule) => (
                                <tr key={schedule.id}>
                                  <td>
                                    {schedule.startTime} - {schedule.endTime}
                                  </td>
                                  {[...Array(7)].map((_, dayIndex) => (
                                    <td key={dayIndex}>
                                      <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => {
                                          const slotKey = `${dayIndex}-${schedule.id}`;
                                          setSelectedSlots((prev) =>
                                            prev.includes(slotKey)
                                              ? prev.filter(
                                                  (slot) => slot !== slotKey
                                                )
                                              : [...prev, slotKey]
                                          );
                                        }}
                                        style={{
                                          width: "100%",
                                          backgroundColor:
                                            selectedSlots.includes(
                                              `${dayIndex}-${schedule.id}`
                                            )
                                              ? "#9c27b0"
                                              : "transparent",
                                          color: selectedSlots.includes(
                                            `${dayIndex}-${schedule.id}`
                                          )
                                            ? "white"
                                            : "#9c27b0",
                                        }}
                                      >
                                        Select
                                      </button>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-warning">
                        <h4 className="card-title">Available Trainers</h4>
                        <p className="card-category">
                          Trainers matching schedule
                        </p>
                      </div>
                      <div className="card-body">
                        {/* Trainer list will go here */}
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

export default StaffClassesCreate;
