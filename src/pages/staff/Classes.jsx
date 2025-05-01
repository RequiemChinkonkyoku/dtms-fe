import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";
import { useLoading } from "../../contexts/LoadingContext";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
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
  1: { label: "Open", color: "badge-warning" },
  2: { label: "Ongoing", color: "badge-info" },
  3: { label: "Closed", color: "badge-danger" },
  4: { label: "Completed", color: "badge-success" },
};

const StaffClasses = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [filterText, setFilterText] = useState("");
  const [classes, setClasses] = useState([]);
  const { loading, setLoading } = useLoading();
  const [classDetails, setClassDetails] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [counts, setCounts] = useState({
    total: 0,
    inactive: 0,
    open: 0,
    ongoing: 0,
    closed: 0,
    completed: 0,
  });

  const [expandedRows, setExpandedRows] = useState(new Set());

  const fetchClassDetails = async (classId) => {
    try {
      const response = await axios.get(`/api/class/${classId}`);
      if (response.data.success) {
        setClassDetails((prev) => ({
          ...prev,
          [classId]: response.data.object,
        }));
      }
    } catch (error) {
      console.error(`Error fetching details for class ${classId}:`, error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const response = await axios.get("/api/class");
      if (response.data.success) {
        const classesData = response.data.objectList || [];
        setClasses(classesData);

        const total = classesData.length;
        const inactive = classesData.filter((c) => c.status === 0).length;
        const open = classesData.filter((c) => c.status === 1).length;
        const ongoing = classesData.filter((c) => c.status === 2).length;
        const closed = classesData.filter((c) => c.status === 3).length;
        const completed = classesData.filter((c) => c.status === 4).length;

        setCounts({ total, inactive, open, ongoing, closed, completed });

        await Promise.all(
          classesData.map((classItem) => fetchClassDetails(classItem.id))
        );

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    data;
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
      const matchesSearch = Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(filterText.toLowerCase())
      );
      const matchesStatus =
        statusFilter === "all" || row.status.toString() === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return b[orderBy] > a[orderBy] ? 1 : -1;
      }
    });

  return (
    <>
      <Head />
      <body>
        <div className="pattern-background" />
        <div class="wrapper">
          <Sidebar />
          <div class="main-panel ps-container ps-theme-default">
            <Navbar />
            <div class="content">
              <div class="container-fluid">
                <div className="row">
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-primary card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "46px",
                            height: "46px",
                            marginTop: "-15px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "20px", lineHeight: "46px" }}
                          >
                            class
                          </i>
                        </div>
                        <p className="card-category mb-0">Total Classes</p>
                        <h3 className="card-title mb-0">{counts.total}</h3>
                      </div>
                    </div>
                  </div>
                  {/* Repeat the same pattern for other status cards */}
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-secondary card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "46px",
                            height: "46px",
                            marginTop: "-15px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "20px", lineHeight: "46px" }}
                          >
                            block
                          </i>
                        </div>
                        <p className="card-category mb-0">Inactive</p>
                        <h3 className="card-title mb-0">{counts.inactive}</h3>
                      </div>
                    </div>
                  </div>
                  {/* Repeat similar structure for Open, Ongoing, Closed, and Completed */}
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "46px",
                            height: "46px",
                            marginTop: "-15px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "20px", lineHeight: "46px" }}
                          >
                            pending
                          </i>
                        </div>
                        <p className="card-category mb-0">Open</p>
                        <h3 className="card-title mb-0">{counts.open}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-info card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "46px",
                            height: "46px",
                            marginTop: "-15px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "20px", lineHeight: "46px" }}
                          >
                            play_circle
                          </i>
                        </div>
                        <p className="card-category mb-0">Ongoing</p>
                        <h3 className="card-title mb-0">{counts.ongoing}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-danger card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "46px",
                            height: "46px",
                            marginTop: "-15px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "20px", lineHeight: "46px" }}
                          >
                            cancel
                          </i>
                        </div>
                        <p className="card-category mb-0">Closed</p>
                        <h3 className="card-title mb-0">{counts.closed}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-success card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "46px",
                            height: "46px",
                            marginTop: "-15px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "20px", lineHeight: "46px" }}
                          >
                            check_circle
                          </i>
                        </div>
                        <p className="card-category mb-0">Completed</p>
                        <h3 className="card-title mb-0">{counts.completed}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="card">
                      <div class="card-header card-header-rose card-header-icon">
                        <div class="card-icon">
                          <i class="material-icons">topic</i>
                        </div>
                        <h4 class="card-title">Class management</h4>
                        <p class="card-category text-muted">
                          Create new classes, view details and manage them.
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
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "16px",
                              }}
                            >
                              <div style={{ display: "flex", gap: "16px" }}>
                                <CustomSearch
                                  value={filterText}
                                  onChange={setFilterText}
                                  setPage={setPage}
                                  placeholder="Search classes..."
                                />
                                <CustomFilter
                                  options={[
                                    { value: "all", label: "All Status" },
                                    ...Object.entries(CLASS_STATUS).map(
                                      ([value, { label }]) => ({
                                        value,
                                        label,
                                      })
                                    ),
                                  ]}
                                  value={statusFilter}
                                  onChange={(value) => {
                                    setStatusFilter(value);
                                    setPage(0);
                                  }}
                                  label="Status"
                                />
                              </div>
                              <Link to="/staff/classes/create">
                                <button className="btn btn-info">
                                  <i className="material-icons">add</i> Create
                                  Class
                                </button>
                              </Link>
                            </div>
                            <CustomTable
                              columns={[
                                { key: "name", label: "Class Name" },
                                { key: "courseName", label: "Course" },
                                {
                                  key: "enrolledDogCount",
                                  label: "Enrolled Dogs",
                                },
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
                                      className={`badge ${CLASS_STATUS[value]?.color || "badge-secondary"}`}
                                    >
                                      {CLASS_STATUS[value]?.label || "Unknown"}
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
                                <>
                                  <Link to={`/staff/classes/details/${row.id}`}>
                                    <button
                                      type="button"
                                      className="btn btn-info btn-sm"
                                      style={{ marginLeft: "8px" }}
                                    >
                                      <i className="material-icons">
                                        more_vert
                                      </i>
                                    </button>
                                  </Link>
                                </>
                              )}
                              expandedContent={(row) => (
                                <div style={{ padding: "20px" }}>
                                  <p>Expanded content for {row.name}</p>
                                </div>
                              )}
                              expandedRows={expandedRows}
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
                <div class="row">
                  <div class="col-md-12">
                    <div className="card mt-4">
                      <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">calendar_today</i>
                        </div>
                        <h4 className="card-title">Class schedule</h4>
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
                              right: "dayGridMonth,timeGridWeek",
                            }}
                            slotMinTime="08:00:00"
                            slotMaxTime="18:00:00"
                            events={Object.values(classDetails).flatMap(
                              (classItem) =>
                                (classItem.classSlots || []).map((slot) => ({
                                  title: classItem.name,
                                  start: `${slot.slotDate}T${slot.startTime}`,
                                  end: `${slot.slotDate}T${slot.endTime}`,
                                  backgroundColor:
                                    CLASS_STATUS[
                                      classItem.status
                                    ]?.color?.replace("badge-", "") || "#999",
                                  extendedProps: {
                                    course: classItem.courseName,
                                    status:
                                      CLASS_STATUS[classItem.status]?.label,
                                    startTime: slot.startTime,
                                    endTime: slot.endTime,
                                  },
                                }))
                            )}
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
                        )}
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

export default StaffClasses;
