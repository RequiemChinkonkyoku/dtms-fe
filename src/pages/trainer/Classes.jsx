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
import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomPagination from "../../assets/components/common/CustomPagination";
import CustomFilter from "../../assets/components/common/CustomFilter";

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
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/class");
        if (response.data.success) {
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

  const filteredData = classes
    .filter((row) => {
      const matchesSearch = row.name
        .toLowerCase()
        .includes(filterText.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || row.status === parseInt(statusFilter);
      return matchesSearch && matchesStatus;
    })
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
                    <div className="card-header card-header-primary card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">category</i>
                      </div>
                      <h4 className="card-title">Your classes</h4>
                      <p class="card-category text-muted">
                        Check out the classes you are assigned to.
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
                          <div
                            style={{
                              padding: "16px",
                              display: "flex",
                              gap: "16px",
                            }}
                          >
                            <CustomSearch
                              value={filterText}
                              onChange={setFilterText}
                              placeholder="Search classes..."
                              setPage={setPage}
                            />
                            <CustomFilter
                              value={statusFilter}
                              onChange={setStatusFilter}
                              setPage={setPage}
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
                            data={filteredData}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            orderBy={orderBy}
                            order={order}
                            onSort={handleSort}
                            renderActions={(row) => (
                              <Link to={`/trainer/classes/details/${row.id}`}>
                                <button className="btn btn-info btn-sm">
                                  <i className="material-icons">visibility</i>
                                </button>
                              </Link>
                            )}
                          />
                          <CustomPagination
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
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
                    <div className="card-header card-header-info card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">calendar_today</i>
                      </div>
                      <h4 className="card-title">Your class schedule</h4>
                      <p class="card-category text-muted">
                        View all of your class schedule.
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
