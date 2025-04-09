import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";
import { Link } from "react-router-dom";
import { TablePagination, TableSortLabel, TextField } from "@mui/material";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

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

const TrainerClasses = () => {
  const { user } = useAuth();
  const { loading, setLoading } = useLoading();
  const [classes, setClasses] = useState([]);
  const [trainerSlots, setTrainerSlots] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/class");
        if (response.data.success) {
          // Filter classes where the trainer is assigned
          const trainerClasses = response.data.objectList.filter((classItem) =>
            classItem.assignedTrainers.some(
              (trainer) => trainer.id === user?.unique_name
            )
          );
          setClasses(trainerClasses || []);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user?.unique_name, setLoading]);

  useEffect(() => {
    const fetchTrainerSlots = async () => {
      if (!user?.unique_name) return;

      try {
        const response = await axios.get(
          `/api/slots/get-trainer-slots/${user.unique_name}`
        );
        if (response.data.success) {
          setTrainerSlots(response.data.objectList || []);
        }
      } catch (error) {
        console.error("Error fetching trainer slots:", error);
      }
    };

    fetchTrainerSlots();
  }, [user?.unique_name]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter and sort data
  const filteredData = classes
    .filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return b[orderBy] > a[orderBy] ? 1 : -1;
      }
    });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header card-header-primary">
                      <h4 className="card-title">My Classes</h4>
                      <p className="card-category">
                        Classes you are assigned to
                      </p>
                    </div>
                    <div className="card-body">
                      {loading ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "300px",
                          }}
                        >
                          <Loader />
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <div style={{ padding: "16px" }}>
                            <TextField
                              label="Search classes..."
                              variant="outlined"
                              size="small"
                              value={filterText}
                              onChange={(e) => setFilterText(e.target.value)}
                            />
                          </div>
                          <table className="table">
                            <thead>
                              <tr>
                                <th>
                                  <TableSortLabel
                                    active={orderBy === "name"}
                                    direction={
                                      orderBy === "name" ? order : "asc"
                                    }
                                    onClick={() => handleSort("name")}
                                  >
                                    Class Name
                                  </TableSortLabel>
                                </th>
                                <th>Course</th>
                                <th>Start Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedData.map((classItem) => (
                                <tr key={classItem.id}>
                                  <td>{classItem.name}</td>
                                  <td>{classItem.courseName}</td>
                                  <td>
                                    {new Date(
                                      classItem.startingDate
                                    ).toLocaleDateString()}
                                  </td>
                                  <td>
                                    <span
                                      className={`badge ${CLASS_STATUS[classItem.status]?.color}`}
                                    >
                                      {CLASS_STATUS[classItem.status]?.label}
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/trainer/classes/${classItem.id}`}
                                    >
                                      <button className="btn btn-info btn-sm">
                                        <i className="material-icons">
                                          visibility
                                        </i>
                                      </button>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <TablePagination
                            component="div"
                            count={filteredData.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header card-header-info">
                      <h4 className="card-title">Class Schedule</h4>
                      <p className="card-category">Your upcoming classes</p>
                    </div>
                    <div className="card-body">
                      {loading ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "300px",
                          }}
                        >
                          <Loader />
                        </div>
                      ) : (
                        <FullCalendar
                          plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                          ]}
                          initialView="timeGridWeek"
                          headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainerClasses;
