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
  const [formattedSlots, setFormattedSlots] = useState([]);

  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [isTrainerEnabled, setIsTrainerEnabled] = useState(false);

  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [selectedTrainerIds, setSelectedTrainerIds] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (startDate && selectedSlots.length > 0) {
      fetchAvailableTrainers();
    }
  }, [startDate, formattedSlots]);

  const fetchAvailableTrainers = async () => {
    if (!startDate || !selectedCourse || formattedSlots.length === 0) {
      setAvailableTrainers([]);
      return;
    }

    try {
      const requestBody = {
        startingDate: dayjs(startDate).format("YYYY-MM-DD"),
        durationInWeeks: selectedCourse.durationInWeeks,
        slotData: formattedSlots,
      };

      const response = await axios.post(
        "/api/accounts/trainers/availability",
        requestBody
      );
      if (response.data) {
        // Removed .success check since the response is a direct array
        setAvailableTrainers(response.data);
        setSelectedTrainerIds([]);
      }
    } catch (error) {
      console.error("Error fetching available trainers:", error);
      setAvailableTrainers([]);
      setSelectedTrainerIds([]);
    }
  };

  // Add this useEffect to handle schedule card unlock
  useEffect(() => {
    setIsScheduleEnabled(!!selectedCourse);
  }, [selectedCourse]);

  // Add this useEffect to handle trainer card unlock
  useEffect(() => {
    setIsTrainerEnabled(!!startDate && selectedSlots.length > 0);
  }, [startDate, selectedSlots]);

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
      setSelectedSlots([]); // Clear selected slots
      setSelectedTrainerIds([]); // Clear selected trainers
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

  const handleCreateClass = async () => {
    try {
      const requestBody = {
        name: className,
        startingDate: dayjs(startDate).format("YYYY-MM-DD"),
        courseId: selectedCourse?.id,
        trainerIds: selectedTrainerIds,
        slotDatas: formattedSlots,
      };

      const response = await axios.post("/api/class", requestBody);
      if (response.data.success) {
        alert("Class created successfully!");
        // Optionally: Redirect to class list or clear form
      } else {
        alert("Failed to create class: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Error creating class. Please try again.");
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
                                  <td>{selectedCourse.price} VND</td>
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
                                    {dogBreedNames.map((breed, index) => (
                                      <span
                                        key={index}
                                        className="badge badge-pill badge-info"
                                        style={{
                                          fontSize: "12px",
                                          padding: "6px 10px",
                                          margin: "0 3px 3px 0",
                                          display: "inline-block",
                                        }}
                                      >
                                        {breed}
                                      </span>
                                    ))}
                                    {!dogBreedNames.length && "None"}
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
                    <div className="card" style={{ position: "relative" }}>
                      <div className="card-header card-header-rose">
                        <h4 className="card-title">Class Schedule</h4>
                        <p className="card-category">
                          Select class dates and times
                        </p>
                      </div>
                      {!isScheduleEnabled && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(200, 200, 200, 0.6)",
                            zIndex: 10,
                            cursor: "not-allowed",
                          }}
                        />
                      )}
                      <div className="card-body">
                        {/* Calendar will go here */}
                      </div>
                      <div className="card-body">
                        <div style={{ width: "50%" }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Start Date"
                              value={startDate}
                              onChange={(newValue) => {
                                setStartDate(newValue);
                                setSelectedTrainerIds([]); // Clear trainers when date changes
                              }}
                              minDate={dayjs()}
                              sx={{ width: "100%" }}
                            />
                          </LocalizationProvider>
                        </div>
                        <div className="table-responsive mt-4">
                          <div className="d-flex justify-content-end mb-3">
                            <button
                              className="btn btn-secondary"
                              onClick={() => setSelectedSlots([])}
                            >
                              Clear All Selections
                            </button>
                          </div>
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th style={{ width: "15%" }}>Time</th>
                                <th style={{ width: "12%" }}>Sunday</th>
                                <th style={{ width: "12%" }}>Monday</th>
                                <th style={{ width: "12%" }}>Tuesday</th>
                                <th style={{ width: "12%" }}>Wednesday</th>
                                <th style={{ width: "12%" }}>Thursday</th>
                                <th style={{ width: "12%" }}>Friday</th>
                                <th style={{ width: "12%" }}>Saturday</th>
                              </tr>
                            </thead>
                            <tbody>
                              {schedules.map((schedule) => (
                                <tr key={schedule.id}>
                                  <td>
                                    {schedule.startTime} - {schedule.endTime}
                                  </td>
                                  {[...Array(7)].map((_, index) => {
                                    // Fix: directly use index as dayIndex (0 = Sunday, 6 = Saturday)
                                    const dayIndex = index;
                                    const slotKey = `${dayIndex}-${schedule.id}`;
                                    const isSelected =
                                      selectedSlots.includes(slotKey);
                                    return (
                                      <td key={index}>
                                        <button
                                          className="btn btn-outline-info btn-sm"
                                          onClick={() => {
                                            setSelectedTrainerIds([]); // Clear trainers when slots change
                                            const newSlot = {
                                              dayOfWeek: parseInt(dayIndex),
                                              scheduleId: schedule.id,
                                            };

                                            setFormattedSlots((prev) => {
                                              const exists = prev.some(
                                                (slot) =>
                                                  slot.dayOfWeek ===
                                                    newSlot.dayOfWeek &&
                                                  slot.scheduleId ===
                                                    newSlot.scheduleId
                                              );

                                              if (exists) {
                                                return prev.filter(
                                                  (slot) =>
                                                    slot.dayOfWeek !==
                                                      newSlot.dayOfWeek ||
                                                    slot.scheduleId !==
                                                      newSlot.scheduleId
                                                );
                                              }
                                              return [...prev, newSlot];
                                            });

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
                                            minWidth: "80px",
                                            backgroundColor: isSelected
                                              ? "#26c6da"
                                              : "transparent",
                                            color: isSelected
                                              ? "white"
                                              : "black",
                                          }}
                                        >
                                          {isSelected ? "Selected" : "Select"}
                                        </button>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card" style={{ position: "relative" }}>
                      <div className="card-header card-header-warning">
                        <h4 className="card-title">Available Trainers</h4>
                        <p className="card-category">
                          Trainers matching schedule
                        </p>
                      </div>
                      {!isTrainerEnabled && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(200, 200, 200, 0.6)",
                            zIndex: 10,
                            cursor: "not-allowed",
                          }}
                        />
                      )}
                      <div className="card-body">
                        <div className="d-flex justify-content-end mb-3">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setSelectedTrainerIds([])}
                          >
                            Clear All Selections
                          </button>
                        </div>
                        <div className="row">
                          {availableTrainers.map((trainer) => (
                            <div className="col-md-6" key={trainer.id}>
                              <div className="form-check">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedTrainerIds.includes(
                                      trainer.id
                                    )}
                                    onChange={(e) => {
                                      setSelectedTrainerIds((prev) =>
                                        e.target.checked
                                          ? [...prev, trainer.id]
                                          : prev.filter(
                                              (id) => id !== trainer.id
                                            )
                                      );
                                    }}
                                  />
                                  {trainer.name}
                                  <span className="form-check-sign">
                                    <span className="check"></span>
                                  </span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card" style={{ position: "relative" }}>
                      <div className="card-header card-header-success">
                        <h4 className="card-title">Class Details Summary</h4>
                        <p className="card-category">
                          Review and confirm class creation
                        </p>
                      </div>

                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table">
                            <tbody>
                              <tr>
                                <td className="col-md-3">
                                  <strong>Class Name</strong>
                                </td>
                                <td className="col-md-9">
                                  {className || "Not set"}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>Course</strong>
                                </td>
                                <td>
                                  {selectedCourse?.name || "Not selected"}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>Start Date</strong>
                                </td>
                                <td>
                                  {startDate
                                    ? dayjs(startDate).format("MMMM D, YYYY")
                                    : "Not selected"}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>Time Slots</strong>
                                </td>
                                <td>
                                  {selectedSlots.length > 0
                                    ? selectedSlots
                                        .sort((a, b) => {
                                          const [dayA] = a.split("-");
                                          const [dayB] = b.split("-");
                                          return (
                                            parseInt(dayA) - parseInt(dayB)
                                          );
                                        })
                                        .reduce((acc, slot) => {
                                          const [dayIndex, scheduleId] =
                                            slot.split("-");
                                          const schedule = schedules.find(
                                            (s) =>
                                              s.id.toString() ===
                                              scheduleId.toString()
                                          );
                                          const days = [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday",
                                          ];
                                          const dayName =
                                            days[
                                              dayIndex === "6"
                                                ? 0
                                                : parseInt(dayIndex) + 1
                                            ];
                                          const timeSlot = `${dayName}(${schedule?.startTime} - ${schedule?.endTime})`;
                                          return acc
                                            ? `${acc}, ${timeSlot}`
                                            : timeSlot;
                                        }, "")
                                    : "No slots selected"}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <strong>Selected Trainers</strong>
                                </td>
                                <td>
                                  {selectedTrainerIds.length > 0
                                    ? availableTrainers
                                        .filter((trainer) =>
                                          selectedTrainerIds.includes(
                                            trainer.id
                                          )
                                        )
                                        .map((trainer) => trainer.name)
                                        .join(", ")
                                    : "None selected"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="text-right mt-3">
                          <button
                            className="btn btn-success"
                            onClick={handleCreateClass}
                            disabled={
                              !className ||
                              !selectedCourse ||
                              !startDate ||
                              selectedSlots.length === 0 ||
                              selectedTrainerIds.length === 0
                            }
                          >
                            Create Class
                          </button>
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

export default StaffClassesCreate;
