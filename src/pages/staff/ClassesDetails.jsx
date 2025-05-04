import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";

const CLASS_STATUS = {
  0: { label: "Inactive", color: "badge-secondary" },
  1: { label: "Open", color: "badge-warning" },
  2: { label: "Ongoing", color: "badge-info" },
  3: { label: "Closed", color: "badge-danger" },
  4: { label: "Completed", color: "badge-success" },
};

const StaffClassesDetails = () => {
  const { id } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/class/${id}`);
      if (response.data.success) {
        const classData = response.data.object;

        // Fetch course details
        const courseResponse = await axios.get(
          `/api/courses/${classData.courseId}`
        );
        if (courseResponse.data.success) {
          const courseData = courseResponse.data.object;
          setClassDetails({
            ...classData,
            courseDescription: courseData.description,
            courseDurationInWeeks: courseData.durationInWeeks,
            courseDaysPerWeek: courseData.daysPerWeek,
            courseSlotsPerDay: courseData.slotsPerDay,
            coursePrice: courseData.price,
            courseMinTrainers: courseData.minTrainers,
            courseMaxTrainers: courseData.maxTrainers,
            courseComplexity: courseData.complexity,
            courseCategoryName: courseData.categoryName,
            coursePrerequisites: courseData.coursePrerequisites,
            courseLessons: courseData.courseLessons,
            courseDogBreeds: courseData.courseDogBreeds,
          });
        }
        setError(null);
      } else {
        setError("Failed to fetch class details");
      }
    } catch (error) {
      console.error("Error fetching class details:", error);
      setError("An error occurred while fetching class details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.put("/api/class/update-class-status", {
        classId: id,
        status: newStatus,
      });
      if (response.data.success) {
        fetchClassDetails();
      }
    } catch (error) {
      console.error("Error updating class status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/class/${id}`);
      if (response.data.success) {
        window.location.href = "/staff/classes";
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

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
                {loading ? (
                  <Loader />
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : classDetails ? (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-header card-header-primary">
                          <h4 className="card-title">Class Information</h4>
                        </div>
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td>
                                    <strong>Name</strong>
                                  </td>
                                  <td>{classDetails.name}</td>
                                  <td>
                                    <strong>Status</strong>
                                  </td>
                                  <td>
                                    <span
                                      className={`badge ${CLASS_STATUS[classDetails.status]?.color || "badge-secondary"}`}
                                    >
                                      {CLASS_STATUS[classDetails.status]
                                        ?.label || "Unknown"}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Course</strong>
                                  </td>
                                  <td>{classDetails.courseName}</td>
                                  <td>
                                    <strong>Starting Date</strong>
                                  </td>
                                  <td>
                                    {new Date(
                                      classDetails.startingDate
                                    ).toLocaleDateString()}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Enrolled Dogs</strong>
                                  </td>
                                  <td>{classDetails.enrolledDogCount}</td>
                                  <td>
                                    <strong>Assigned Trainers</strong>
                                  </td>
                                  <td>{classDetails.assignedTrainerCount}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Trainer Names</strong>
                                  </td>
                                  <td colSpan="3">
                                    {classDetails.assignedTrainers
                                      .map((trainer) => trainer.name)
                                      .join(", ")}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {classDetails.status === 1 && (
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <div>
                                <button
                                  className="btn"
                                  disabled={
                                    classDetails.classEnrollments?.length > 0
                                  }
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this class?"
                                      )
                                    ) {
                                      handleDelete();
                                    }
                                  }}
                                >
                                  <i className="material-icons">cancel</i>{" "}
                                  Cancel Class
                                </button>
                                {classDetails.classEnrollments?.length > 0 && (
                                  <small className="text-danger d-block mt-2">
                                    *Cannot cancel class with enrolled dogs.
                                  </small>
                                )}
                              </div>
                              <div>
                                <div>
                                  <button
                                    className="btn btn-success mr-2"
                                    disabled={
                                      new Date().toDateString() !==
                                      new Date(
                                        classDetails.startingDate
                                      ).toDateString()
                                    }
                                    onClick={() => handleStatusUpdate(2)}
                                  >
                                    <i className="material-icons">play_arrow</i>{" "}
                                    Open Class
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    disabled={
                                      new Date().toDateString() !==
                                      new Date(
                                        classDetails.startingDate
                                      ).toDateString()
                                    }
                                    onClick={() => handleStatusUpdate(3)}
                                  >
                                    <i className="material-icons">stop</i> Close
                                    Class
                                  </button>
                                </div>
                                {new Date().toDateString() !==
                                  new Date(
                                    classDetails.startingDate
                                  ).toDateString() && (
                                  <small className="text-danger d-block mt-2">
                                    *Actions only available on the class
                                    starting date.
                                  </small>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-header card-header-info">
                          <h4 className="card-title">Course Information</h4>
                          <p className="card-category">
                            Course details and requirements
                          </p>
                        </div>
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className="col-md-2">
                                    <strong>Name</strong>
                                  </td>
                                  <td className="col-md-4">
                                    {classDetails.courseName}
                                  </td>
                                  <td className="col-md-2">
                                    <strong>Status</strong>
                                  </td>
                                  <td className="col-md-4">Active</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Description</strong>
                                  </td>
                                  <td colSpan="3">
                                    {classDetails.courseDescription}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Duration</strong>
                                  </td>
                                  <td>
                                    {classDetails.courseDurationInWeeks} week(s)
                                  </td>
                                  <td>
                                    <strong>Price</strong>
                                  </td>
                                  <td>{classDetails.coursePrice} VND</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Schedule</strong>
                                  </td>
                                  <td>
                                    {classDetails.courseDaysPerWeek}{" "}
                                    day(s)/week,{" "}
                                    {classDetails.courseSlotsPerDay} slot(s)/day
                                  </td>
                                  <td>
                                    <strong>Trainers</strong>
                                  </td>
                                  <td>
                                    {classDetails.courseMinTrainers} -{" "}
                                    {classDetails.courseMaxTrainers} persons
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
                                        {index < classDetails.courseComplexity
                                          ? "star"
                                          : "star_border"}
                                      </i>
                                    ))}
                                  </td>
                                  <td>
                                    <strong>Category</strong>
                                  </td>
                                  <td>{classDetails.courseCategoryName}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Prerequisites</strong>
                                  </td>
                                  <td colSpan="3">
                                    {classDetails.coursePrerequisites?.length >
                                    0
                                      ? classDetails.coursePrerequisites.join(
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
                                    {classDetails.courseLessons?.length > 0
                                      ? classDetails.courseLessons
                                          .map((lesson) => lesson.name)
                                          .join(", ")
                                      : "None"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Dog Breeds</strong>
                                  </td>
                                  <td colSpan="3">
                                    {classDetails.courseDogBreeds?.map(
                                      (breed, index) => (
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
                                          <i
                                            className="material-icons"
                                            style={{
                                              fontSize: "12px",
                                              margin: "1px 3px 3px 0",
                                              display: "inline-block",
                                            }}
                                          >
                                            pets
                                          </i>
                                          {breed.name}
                                        </span>
                                      )
                                    )}
                                    {(!classDetails.courseDogBreeds ||
                                      classDetails.courseDogBreeds.length ===
                                        0) &&
                                      "None"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="card mt-4">
                        <div className="card-header card-header-info">
                          <h4 className="card-title">Class Schedule</h4>
                        </div>
                        <div className="card-body">
                          <FullCalendar
                            plugins={[
                              dayGridPlugin,
                              timeGridPlugin,
                              interactionPlugin,
                            ]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                              left: "prev,next today",
                              center: "title",
                              right: "dayGridMonth,timeGridWeek",
                            }}
                            allDaySlot={false}
                            slotMinTime="08:00:00"
                            slotMaxTime="18:00:00"
                            events={classDetails.classSlots.map((slot) => ({
                              title: classDetails.name,
                              start: `${slot.slotDate}T${slot.startTime}`,
                              end: `${slot.slotDate}T${slot.endTime}`,
                              backgroundColor:
                                CLASS_STATUS[
                                  classDetails.status
                                ]?.color?.replace("badge-", "") || "#999",
                              extendedProps: {
                                course: classDetails.courseName,
                                status:
                                  CLASS_STATUS[classDetails.status]?.label,
                                startTime: slot.startTime,
                                endTime: slot.endTime,
                              },
                            }))}
                            eventContent={(eventInfo) => (
                              <div>
                                <b>{eventInfo.event.title}</b>
                                <div>
                                  {eventInfo.event.extendedProps.course}
                                </div>
                                <small>
                                  {eventInfo.event.extendedProps.startTime?.substring(
                                    0,
                                    5
                                  )}
                                  -
                                  {eventInfo.event.extendedProps.endTime?.substring(
                                    0,
                                    5
                                  )}
                                </small>
                              </div>
                            )}
                            eventOverlap={false}
                            slotEventOverlap={false}
                            height="auto"
                            aspectRatio={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    No class details found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default StaffClassesDetails;
