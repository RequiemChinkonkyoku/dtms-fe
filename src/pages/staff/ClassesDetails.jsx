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
  const [showOpenRegModal, setShowOpenRegModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showOpenClassModal, setShowOpenClassModal] = useState(false);
  const [showConcludeModal, setShowConcludeModal] = useState(false);

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/class/${id}`);
      if (response.data.success) {
        setClassDetails(response.data.object);
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
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div className="text-right mt-3">
                        <div className="d-flex justify-content-end">
                          {classDetails.status === 0 && (
                            <>
                              <button
                                className="btn btn-warning d-flex align-items-center justify-content-center"
                                onClick={() => setShowOpenRegModal(true)}
                                style={{ width: "180px" }}
                              >
                                Open for Registration
                              </button>
                              <div
                                className={`modal fade ${showOpenRegModal ? "show" : ""}`}
                                style={{
                                  display: showOpenRegModal ? "block" : "none",
                                }}
                              >
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5 className="modal-title">
                                        Confirm Action
                                      </h5>
                                      <button
                                        type="button"
                                        className="close"
                                        onClick={() =>
                                          setShowOpenRegModal(false)
                                        }
                                      >
                                        <span>&times;</span>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      Are you sure you want to open this class
                                      for registration?
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                          setShowOpenRegModal(false)
                                        }
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={() => {
                                          handleStatusUpdate(1);
                                          setShowOpenRegModal(false);
                                        }}
                                      >
                                        Confirm
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {classDetails.status === 1 && (
                            <>
                              <button
                                className="btn btn-danger d-flex align-items-center justify-content-center"
                                onClick={() => setShowCancelModal(true)}
                                style={{ width: "120px" }}
                              >
                                Cancel Class
                              </button>
                              <button
                                className="btn btn-success d-flex align-items-center justify-content-center"
                                onClick={() => setShowOpenClassModal(true)}
                                style={{ width: "120px", marginLeft: "8px" }}
                              >
                                Open Class
                              </button>
                              <div
                                className={`modal fade ${showCancelModal ? "show" : ""}`}
                                style={{
                                  display: showCancelModal ? "block" : "none",
                                }}
                              >
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5 className="modal-title">
                                        Confirm Cancellation
                                      </h5>
                                      <button
                                        type="button"
                                        className="close"
                                        onClick={() =>
                                          setShowCancelModal(false)
                                        }
                                      >
                                        <span>&times;</span>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      Are you sure you want to cancel this
                                      class? This action cannot be undone.
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                          setShowCancelModal(false)
                                        }
                                      >
                                        No
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                          handleStatusUpdate(3);
                                          setShowCancelModal(false);
                                        }}
                                      >
                                        Yes, Cancel Class
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`modal fade ${showOpenClassModal ? "show" : ""}`}
                                style={{
                                  display: showOpenClassModal
                                    ? "block"
                                    : "none",
                                }}
                              >
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5 className="modal-title">
                                        Confirm Opening Class
                                      </h5>
                                      <button
                                        type="button"
                                        className="close"
                                        onClick={() =>
                                          setShowOpenClassModal(false)
                                        }
                                      >
                                        <span>&times;</span>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      Are you sure you want to open this class?
                                      Make sure all preparations are complete.
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                          setShowOpenClassModal(false)
                                        }
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => {
                                          handleStatusUpdate(2);
                                          setShowOpenClassModal(false);
                                        }}
                                      >
                                        Yes, Open Class
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {classDetails.status === 2 && (
                            <>
                              <button
                                className="btn btn-success d-flex align-items-center justify-content-center"
                                onClick={() => setShowConcludeModal(true)}
                                style={{ width: "120px" }}
                              >
                                Conclude Class
                              </button>
                              <div
                                className={`modal fade ${showConcludeModal ? "show" : ""}`}
                                style={{
                                  display: showConcludeModal ? "block" : "none",
                                }}
                              >
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5 className="modal-title">
                                        Confirm Conclusion
                                      </h5>
                                      <button
                                        type="button"
                                        className="close"
                                        onClick={() =>
                                          setShowConcludeModal(false)
                                        }
                                      >
                                        <span>&times;</span>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      Are you sure you want to conclude this
                                      class? This will mark the class as
                                      completed.
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                          setShowConcludeModal(false)
                                        }
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => {
                                          handleStatusUpdate(4);
                                          setShowConcludeModal(false);
                                        }}
                                      >
                                        Yes, Conclude Class
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        {new Date().toDateString() !==
                          new Date(
                            classDetails.startingDate
                          ).toDateString() && (
                          <small className="text-danger d-block mt-2">
                            Warning: Starting date is not today, proceed with
                            caution.
                          </small>
                        )}
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
                            events={classDetails.classSlots.map((slot) => ({
                              title: `${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(0, 5)}`,
                              start: slot.slotDate,
                              backgroundColor:
                                CLASS_STATUS[
                                  classDetails.status
                                ]?.color?.replace("badge-", "") || "#999",
                            }))}
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
