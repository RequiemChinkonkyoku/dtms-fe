import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";
import { useLoading } from "../../contexts/LoadingContext";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { TablePagination, TableSortLabel, TextField } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Add this constant at the top of the file, after imports
const CLASS_STATUS = {
  0: { label: "Inactive", color: "badge-secondary" },
  1: { label: "Active", color: "badge-warning" },
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
  const [counts, setCounts] = useState({
    total: 0,
    inactive: 0,
    active: 0,
    ongoing: 0,
    closed: 0,
    completed: 0,
  });

  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (rowId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

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

        // Calculate counts
        const total = classesData.length;
        const inactive = classesData.filter((c) => c.status === 0).length;
        const active = classesData.filter((c) => c.status === 1).length;
        const ongoing = classesData.filter((c) => c.status === 2).length;
        const closed = classesData.filter((c) => c.status === 3).length;
        const completed = classesData.filter((c) => c.status === 4).length;

        setCounts({ total, inactive, active, ongoing, closed, completed });

        // Fetch details for each class
        await Promise.all(
          classesData.map((classItem) => fetchClassDetails(classItem.id))
        );

        // Only apply minimum time after all operations are complete
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

  // Filter and sort data
  // Update filtered data to use classes array
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

  // Paginate data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-primary card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "56px",
                            height: "56px",
                            marginTop: "-20px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "24px", lineHeight: "56px" }}
                          >
                            class
                          </i>
                        </div>
                        <p className="card-category mb-0">Total Classes</p>
                        <h3 className="card-title mb-2">{counts.total}</h3>
                      </div>
                      <div className="card-footer py-2">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-secondary card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "56px",
                            height: "56px",
                            marginTop: "-20px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "24px", lineHeight: "56px" }}
                          >
                            block
                          </i>
                        </div>
                        <p className="card-category mb-0">Inactive</p>
                        <h3 className="card-title mb-2">{counts.inactive}</h3>
                      </div>
                      <div className="card-footer py-2">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "56px",
                            height: "56px",
                            marginTop: "-20px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "24px", lineHeight: "56px" }}
                          >
                            pending
                          </i>
                        </div>
                        <p className="card-category mb-0">Active</p>
                        <h3 className="card-title mb-2">{counts.active}</h3>
                      </div>
                      <div className="card-footer py-2">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-info card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "56px",
                            height: "56px",
                            marginTop: "-20px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "24px", lineHeight: "56px" }}
                          >
                            play_circle
                          </i>
                        </div>
                        <p className="card-category mb-0">Ongoing</p>
                        <h3 className="card-title mb-2">{counts.ongoing}</h3>
                      </div>
                      <div className="card-footer py-2">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-danger card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "56px",
                            height: "56px",
                            marginTop: "-20px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "24px", lineHeight: "56px" }}
                          >
                            cancel
                          </i>
                        </div>
                        <p className="card-category mb-0">Closed</p>
                        <h3 className="card-title mb-2">{counts.closed}</h3>
                      </div>
                      <div className="card-footer py-2">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-success card-header-icon py-2">
                        <div
                          className="card-icon"
                          style={{
                            width: "56px",
                            height: "56px",
                            marginTop: "-20px",
                          }}
                        >
                          <i
                            className="material-icons"
                            style={{ fontSize: "24px", lineHeight: "56px" }}
                          >
                            check_circle
                          </i>
                        </div>
                        <p className="card-category mb-0">Completed</p>
                        <h3 className="card-title mb-2">{counts.completed}</h3>
                      </div>
                      <div className="card-footer py-2">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
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
                        <h4 class="card-title">Classes</h4>
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
                              }}
                            >
                              <TextField
                                label="Search by name..."
                                variant="outlined"
                                size="small"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                              />
                              <Link to="/staff/classes/create">
                                <button className="btn btn-info">
                                  <i className="material-icons">add</i> Create
                                  Class
                                </button>
                              </Link>
                            </div>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th className="text-center">#</th>
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
                                  <th>
                                    <TableSortLabel
                                      active={orderBy === "courseName"}
                                      direction={
                                        orderBy === "courseName" ? order : "asc"
                                      }
                                      onClick={() => handleSort("courseName")}
                                    >
                                      Course
                                    </TableSortLabel>
                                  </th>
                                  <th>
                                    <TableSortLabel
                                      active={orderBy === "enrolledDogCount"}
                                      direction={
                                        orderBy === "enrolledDogCount"
                                          ? order
                                          : "asc"
                                      }
                                      onClick={() =>
                                        handleSort("enrolledDogCount")
                                      }
                                    >
                                      Enrolled Dogs
                                    </TableSortLabel>
                                  </th>
                                  <th>
                                    <TableSortLabel
                                      active={orderBy === "startingDate"}
                                      direction={
                                        orderBy === "startingDate"
                                          ? order
                                          : "asc"
                                      }
                                      onClick={() => handleSort("startingDate")}
                                    >
                                      Start Date
                                    </TableSortLabel>
                                  </th>
                                  <th>Status</th>
                                  <th className="text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paginatedData.map((row, index) => (
                                  <React.Fragment key={row.id}>
                                    <tr>
                                      <td className="text-center">
                                        {page * rowsPerPage + index + 1}
                                      </td>
                                      <td>{row.name}</td>
                                      <td>{row.courseName}</td>
                                      <td>{row.enrolledDogCount}</td>
                                      <td>
                                        {new Date(
                                          row.startingDate
                                        ).toLocaleDateString()}
                                      </td>
                                      <td>
                                        <span
                                          className={`badge ${CLASS_STATUS[row.status]?.color || "badge-secondary"}`}
                                        >
                                          {CLASS_STATUS[row.status]?.label ||
                                            "Unknown"}
                                        </span>
                                      </td>
                                      <td className="td-actions text-right">
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-sm"
                                          onClick={() =>
                                            toggleRowExpansion(row.id)
                                          }
                                        >
                                          <i
                                            className="material-icons"
                                            style={{
                                              transition: "transform 0.3s",
                                            }}
                                          >
                                            {expandedRows.has(row.id)
                                              ? "keyboard_arrow_up"
                                              : "keyboard_arrow_down"}
                                          </i>
                                        </button>
                                        <Link
                                          to={`/staff/classes/details/${row.id}`}
                                        >
                                          <button
                                            type="button"
                                            rel="tooltip"
                                            className="btn btn-info btn-sm"
                                            style={{ marginLeft: "8px" }}
                                          >
                                            <i className="material-icons">
                                              more_vert
                                            </i>
                                          </button>
                                        </Link>
                                      </td>
                                    </tr>
                                    {expandedRows.has(row.id) && (
                                      <tr>
                                        <td colSpan="7">
                                          <div style={{ padding: "20px" }}>
                                            <p>
                                              Expanded content for {row.name}
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
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
                <div class="row">
                  <div class="col-md-12">
                    <div className="card mt-4">
                      <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">calendar_today</i>
                        </div>
                        <h4 className="card-title">Class Schedule</h4>
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
