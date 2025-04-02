import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useNavigate } from "react-router-dom";
import { TablePagination, TableSortLabel, TextField } from "@mui/material";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";
import { useLoading } from "../../contexts/LoadingContext";

const TrainerCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const { loading, setLoading } = useLoading();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComplexityText = (complexity) => {
    switch (complexity) {
      case 1:
        return "Basic";
      case 2:
        return "Intermediate";
      case 3:
        return "Advanced";
      default:
        return "Unknown";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Active";
      case 0:
        return "Inactive";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return "text-success";
      case 0:
        return "text-warning";
      default:
        return "";
    }
  };

  const sortedCourses = React.useMemo(() => {
    const comparator = (a, b) => {
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    };

    return [...courses]
      .filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(comparator);
  }, [courses, order, orderBy, searchTerm]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const startTime = Date.now();
      try {
        const response = await axios.get("/api/courses");
        setCourses(response.data.objectList);

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">school</i>
                        </div>
                        <h4 className="card-title">Courses</h4>
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
                              <TextField
                                label="Search course..."
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                              <button
                                className="btn btn-primary"
                                onClick={() =>
                                  navigate("/trainer/courses/create")
                                }
                              >
                                <i className="material-icons">add</i> Create
                                Course
                              </button>
                            </div>
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th className="text-center">#</th>
                                  {[
                                    ["name", "Name"],
                                    ["durationInWeeks", "Duration"],
                                    ["daysPerWeek", "Days/Week"],
                                    ["slotsPerDay", "Slots/Day"],
                                    ["complexity", "Complexity"],
                                    ["trainers", "Trainers"],
                                    ["status", "Status"],
                                  ].map(([key, label]) => (
                                    <th key={key}>
                                      <TableSortLabel
                                        active={orderBy === key}
                                        direction={
                                          orderBy === key ? order : "asc"
                                        }
                                        onClick={() => handleSort(key)}
                                      >
                                        {label}
                                      </TableSortLabel>
                                    </th>
                                  ))}
                                  <th className="text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sortedCourses
                                  .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                  .map((course, index) => (
                                    <tr key={course.id}>
                                      <td className="text-center">
                                        {page * rowsPerPage + index + 1}
                                      </td>
                                      <td>{course.name}</td>
                                      <td>{course.durationInWeeks} week(s)</td>
                                      <td>{course.daysPerWeek} day(s)</td>
                                      <td>{course.slotsPerDay} slot(s)</td>
                                      <td style={{ verticalAlign: "middle" }}>
                                        {[...Array(5)].map((_, index) => (
                                          <i
                                            key={index}
                                            className="material-icons"
                                            style={{ fontSize: "18px" }}
                                          >
                                            {index < course.complexity
                                              ? "star"
                                              : "star_border"}
                                          </i>
                                        ))}
                                      </td>
                                      <td>{`${course.minTrainers} - ${course.maxTrainers}`}</td>
                                      <td
                                        className={getStatusClass(
                                          course.status
                                        )}
                                      >
                                        {getStatusText(course.status)}
                                      </td>
                                      <td className="td-actions text-right">
                                        <button
                                          type="button"
                                          rel="tooltip"
                                          className="btn btn-info btn-sm"
                                          data-original-title="View Details"
                                          title="View Details"
                                        >
                                          <i className="material-icons">
                                            more_vert
                                          </i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25]}
                              component="div"
                              count={sortedCourses.length}
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
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default TrainerCourses;
