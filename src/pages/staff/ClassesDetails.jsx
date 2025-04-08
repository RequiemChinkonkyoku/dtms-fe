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
  1: { label: "Active", color: "badge-warning" },
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
