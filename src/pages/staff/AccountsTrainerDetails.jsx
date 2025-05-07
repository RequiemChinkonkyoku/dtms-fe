import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { showToast, dismissToast } from "../../utils/toastConfig";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";

import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomFilter from "../../assets/components/common/CustomFilter";
import CustomPagination from "../../assets/components/common/CustomPagination";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CLASS_STATUS = {
  0: { label: "Inactive", color: "badge-secondary" },
  1: { label: "Active", color: "badge-warning" },
  2: { label: "Ongoing", color: "badge-info" },
  3: { label: "Closed", color: "badge-danger" },
  4: { label: "Completed", color: "badge-success" },
};

const StaffAccountsTrainerDetails = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [trainerSlots, setTrainerSlots] = useState([]);
  const [classPage, setClassPage] = useState(0);
  const [classRowsPerPage, setClassRowsPerPage] = useState(5);
  const [classOrderBy, setClassOrderBy] = useState("name");
  const [classOrder, setClassOrder] = useState("asc");
  const [classFilterText, setClassFilterText] = useState("");
  const [classStatusFilter, setClassStatusFilter] = useState("all");

  // Add this to your useEffect or create a new one
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const [classesResponse, slotsResponse] = await Promise.all([
          axios.get("/api/class"),
          axios.get(`/api/slots/get-trainer-slots/${id}`),
        ]);

        if (classesResponse.data.success) {
          const trainerClasses = classesResponse.data.objectList.filter(
            (classItem) =>
              classItem.assignedTrainers.some((trainer) => trainer.id === id)
          );
          setClasses(trainerClasses || []);
        }

        if (slotsResponse.data.success) {
          setTrainerSlots(slotsResponse.data.objectList || []);
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error);
      }
    };

    fetchTrainerData();
  }, [id]);

  // Add this handler
  const handleClassSort = (property) => {
    const isAsc = classOrderBy === property && classOrder === "asc";
    setClassOrder(isAsc ? "desc" : "asc");
    setClassOrderBy(property);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/accounts/${id}`);
        setAccount(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleResetPassword = async () => {
    try {
      showToast.loading("Sending reset password email...");
      await axios.post(`/api/accounts/forgotPassword?email=${account.email}`);
      dismissToast();
      showToast.success("Password reset email has been sent");
    } catch (error) {
      dismissToast();
      showToast.error("Failed to send password reset email");
      console.error("Error resetting password:", error);
    }
  };

  const handleDeactivate = async () => {
    try {
      await axios.delete(`/api/accounts/${id}`);
      const response = await axios.get(`/api/accounts/${id}`);
      setAccount(response.data);
      showToast.success("Account has been deactivated");
    } catch (error) {
      showToast.error("Failed to deactivate account");
      console.error("Error deactivating account:", error);
    }
  };

  const handleActivate = async () => {
    try {
      await axios.put(`/api/accounts/${id}/activate`);
      const response = await axios.get(`/api/accounts/${id}`);
      setAccount(response.data);
      showToast.success("Account has been activated");
    } catch (error) {
      showToast.error("Failed to activate account");
      console.error("Error activating account:", error);
    }
  };

  if (loading) return <Loader />;

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
                <div className="row">
                  <div className="col-md-3">
                    <div className="card card-profile">
                      <div className="card-avatar">
                        <img
                          className="img"
                          src={
                            !account || account.imageUrl === "empty"
                              ? "/path/to/default/avatar.jpg"
                              : account.imageUrl
                          }
                          alt={account?.fullName || "Trainer"}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h4 className="card-title">{account.fullName}</h4>
                        <p className="card-description">
                          {account.roleId === "f3a4b5c67890d1e2f3a4b5c67890d1e2"
                            ? "Trainer - Lead"
                            : "Trainer - Member"}
                        </p>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm mr-2"
                        onClick={handleResetPassword}
                      >
                        Reset Password
                      </button>
                      {account.status === 1 ? (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={handleDeactivate}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={handleActivate}
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Trainer Information</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Username</label>
                              <p className="form-control-static">
                                {account.username}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Email</label>
                              <p className="form-control-static">
                                {account.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Phone Number</label>
                              <p className="form-control-static">
                                {account.phoneNumber}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Date of Birth</label>
                              <p className="form-control-static">
                                {new Date(
                                  account.dateOfBirth
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label>Address</label>
                              <p className="form-control-static">
                                {account.address}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Gender</label>
                              <p className="form-control-static">
                                {account.gender === 0
                                  ? "Male"
                                  : account.gender === 1
                                    ? "Female"
                                    : "Other"}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Status</label>
                              <p className="form-control-static">
                                {account.status === 1 ? (
                                  <span className="text-success">Active</span>
                                ) : account.status === 0 ? (
                                  <span className="text-warning">Inactive</span>
                                ) : (
                                  <span className="text-danger">
                                    Deactivated
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">category</i>
                        </div>
                        <h4 className="card-title">Assigned Classes</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <div
                            style={{
                              padding: "16px",
                              display: "flex",
                              gap: "16px",
                            }}
                          >
                            <CustomSearch
                              value={classFilterText}
                              onChange={setClassFilterText}
                              placeholder="Search classes..."
                              setPage={setClassPage}
                            />
                            <CustomFilter
                              value={classStatusFilter}
                              onChange={setClassStatusFilter}
                              setPage={setClassPage}
                              label="Status"
                              options={[
                                { value: "all", label: "All Status" },
                                { value: "0", label: "Inactive" },
                                { value: "1", label: "Active" },
                                { value: "2", label: "Ongoing" },
                                { value: "3", label: "Closed" },
                                { value: "4", label: "Completed" },
                              ]}
                            />
                          </div>
                          <CustomTable
                            columns={[
                              { key: "name", label: "Class Name" },
                              { key: "courseName", label: "Course" },
                              {
                                key: "startingDate",
                                label: "Start Date",
                                render: (value) =>
                                  new Date(value).toLocaleDateString(),
                              },
                              {
                                key: "status",
                                label: "Status",
                                render: (value) => (
                                  <span
                                    className={`badge ${CLASS_STATUS[value]?.color}`}
                                  >
                                    {CLASS_STATUS[value]?.label}
                                  </span>
                                ),
                              },
                            ]}
                            data={classes
                              .filter((row) => {
                                const matchesSearch = row.name
                                  .toLowerCase()
                                  .includes(classFilterText.toLowerCase());
                                const matchesStatus =
                                  classStatusFilter === "all" ||
                                  row.status === parseInt(classStatusFilter);
                                return matchesSearch && matchesStatus;
                              })
                              .sort((a, b) => {
                                if (classOrder === "asc") {
                                  return a[classOrderBy] > b[classOrderBy]
                                    ? 1
                                    : -1;
                                } else {
                                  return b[classOrderBy] > a[classOrderBy]
                                    ? 1
                                    : -1;
                                }
                              })}
                            page={classPage}
                            rowsPerPage={classRowsPerPage}
                            orderBy={classOrderBy}
                            order={classOrder}
                            onSort={handleClassSort}
                          />
                          <CustomPagination
                            count={classes.length}
                            rowsPerPage={classRowsPerPage}
                            page={classPage}
                            onPageChange={(e, newPage) => setClassPage(newPage)}
                            onRowsPerPageChange={(e) => {
                              setClassRowsPerPage(parseInt(e.target.value, 10));
                              setClassPage(0);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">calendar_today</i>
                        </div>
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
                            right: "dayGridMonth",
                          }}
                          slotMinTime="08:00:00"
                          slotMaxTime="18:00:00"
                          allDaySlot={false}
                          events={trainerSlots.map((slot) => ({
                            title: slot.className,
                            start: `${slot.slotDate}T${slot.startTime}`,
                            end: `${slot.slotDate}T${slot.endTime}`,
                            backgroundColor: "#00bcd4",
                            extendedProps: {
                              startTime: slot.startTime,
                              endTime: slot.endTime,
                            },
                          }))}
                          eventContent={(eventInfo) => (
                            <div>
                              <b>{eventInfo.event.title}</b>
                              <br />
                              <small>
                                {eventInfo.event.extendedProps.startTime.substring(
                                  0,
                                  5
                                )}
                                -
                                {eventInfo.event.extendedProps.endTime.substring(
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
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default StaffAccountsTrainerDetails;
