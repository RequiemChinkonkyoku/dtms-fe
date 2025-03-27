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

const StaffClasses = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [filterText, setFilterText] = useState("");

  const data = [
    {
      id: 1,
      name: "Andrew Mike",
      position: "Developer",
      since: "2013",
      salary: "€ 99,225",
    },
    {
      id: 2,
      name: "John Doe",
      position: "Designer",
      since: "2015",
      salary: "€ 89,241",
    },
    {
      id: 3,
      name: "Alex Smith",
      position: "Team Lead",
      since: "2012",
      salary: "€ 125,500",
    },
    {
      id: 4,
      name: "Emma Wilson",
      position: "Developer",
      since: "2018",
      salary: "€ 85,000",
    },
    {
      id: 5,
      name: "Michael Brown",
      position: "Project Manager",
      since: "2014",
      salary: "€ 115,750",
    },
    {
      id: 6,
      name: "Sarah Davis",
      position: "UX Designer",
      since: "2017",
      salary: "€ 92,300",
    },
    {
      id: 7,
      name: "James Johnson",
      position: "Developer",
      since: "2016",
      salary: "€ 95,800",
    },
    {
      id: 8,
      name: "Lisa Anderson",
      position: "QA Engineer",
      since: "2019",
      salary: "€ 78,500",
    },
  ];

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
  const filteredData = data
    .filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(filterText.toLowerCase())
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
                          <i class="material-icons">assignment</i>
                        </div>
                        <h4 class="card-title">Simple Table</h4>
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
                              label="Search"
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
                                    Name
                                  </TableSortLabel>
                                </th>
                                <th>
                                  <TableSortLabel
                                    active={orderBy === "position"}
                                    direction={
                                      orderBy === "position" ? order : "asc"
                                    }
                                    onClick={() => handleSort("position")}
                                  >
                                    Job Position
                                  </TableSortLabel>
                                </th>
                                <th>
                                  <TableSortLabel
                                    active={orderBy === "since"}
                                    direction={
                                      orderBy === "since" ? order : "asc"
                                    }
                                    onClick={() => handleSort("since")}
                                  >
                                    Since
                                  </TableSortLabel>
                                </th>
                                <th className="text-right">
                                  <TableSortLabel
                                    active={orderBy === "salary"}
                                    direction={
                                      orderBy === "salary" ? order : "asc"
                                    }
                                    onClick={() => handleSort("salary")}
                                  >
                                    Salary
                                  </TableSortLabel>
                                </th>
                                <th className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedData.map((row) => (
                                <tr key={row.id}>
                                  <td className="text-center">{row.id}</td>
                                  <td>{row.name}</td>
                                  <td>{row.position}</td>
                                  <td>{row.since}</td>
                                  <td className="text-right">{row.salary}</td>
                                  <td className="td-actions text-right">
                                    <button
                                      type="button"
                                      rel="tooltip"
                                      className="btn btn-info"
                                      data-original-title=""
                                      title=""
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
