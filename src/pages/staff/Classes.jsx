import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { TablePagination, TableSortLabel, TextField } from "@mui/material";

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
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/class");
      if (response.data.success) {
        setClasses(response.data.objectList || []);
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
                                      orderBy === "startingDate" ? order : "asc"
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
                              {loading ? (
                                <tr>
                                  <td colSpan="7" className="text-center">
                                    <Loader />
                                  </td>
                                </tr>
                              ) : (
                                paginatedData.map((row, index) => (
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
                                      </td>
                                    </tr>
                                    {expandedRows.has(row.id) && (
                                      <tr>
                                        <td colSpan="7">
                                          <div style={{ padding: "20px" }}>
                                            {/* Content will go here */}
                                            <p>
                                              Expanded content for {row.name}
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                ))
                              )}
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
