import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import { useAuth } from "../../contexts/AuthContext";

import { TablePagination, TextField, TableSortLabel } from "@mui/material";

const Blogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState("createdTime");
  const [order, setOrder] = useState("desc");
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBlogs = React.useMemo(() => {
    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (
        orderBy === "createdTime" ||
        orderBy === "lastUpdatedTime" ||
        orderBy === "timePublished"
      ) {
        return order === "asc"
          ? new Date(a[orderBy]) - new Date(b[orderBy])
          : new Date(b[orderBy]) - new Date(a[orderBy]);
      }

      if (orderBy === "status") {
        return order === "asc"
          ? a[orderBy] - b[orderBy]
          : b[orderBy] - a[orderBy];
      }

      return order === "asc"
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    });
  }, [blogs, searchTerm, orderBy, order]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blogs");
        if (response.data.success && response.data.objectList) {
          const blogsData = response.data.objectList;
          setBlogs(blogsData);

          // Calculate counts
          const total = blogsData.length;
          const active = blogsData.filter((blog) => blog.status === 1).length;
          const inactive = blogsData.filter((blog) => blog.status !== 1).length;

          setCounts({ total, active, inactive });
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Draft";
      case 1:
        return "Published";
      case -1:
        return "Archived";
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
      case -1:
        return "text-danger";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">article</i>
                        </div>
                        <p className="card-category">Total Blogs</p>
                        <h3 className="card-title">{counts.total}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-success card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">publish</i>
                        </div>
                        <p className="card-category">Published</p>
                        <h3 className="card-title">{counts.active}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-danger card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">drafts</i>
                        </div>
                        <p className="card-category">Drafts/Archived</p>
                        <h3 className="card-title">{counts.inactive}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
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
                          <i className="material-icons">feed</i>
                        </div>
                        <h4 className="card-title">Blog Management</h4>
                      </div>
                      <div className="card-body">
                        <div
                          className="toolbar"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                          }}
                        >
                          <TextField
                            label="Search..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <Link
                            className="btn btn-primary"
                            to={"/staff/blogs/create"}
                          >
                            <i className="material-icons">add</i> New Blog
                          </Link>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                {[
                                  ["title", "Title"],
                                  ["status", "Status"],
                                  ["timePublished", "Published Date"],
                                  ["createdTime", "Created Date"],
                                  ["lastUpdatedTime", "Last Updated"],
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
                              {filteredBlogs
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((blog, index) => (
                                  <tr key={blog.id}>
                                    <td className="text-center">
                                      {page * rowsPerPage + index + 1}
                                    </td>
                                    <td>{blog.title}</td>
                                    <td className={getStatusClass(blog.status)}>
                                      {getStatusText(blog.status)}
                                    </td>
                                    <td>{formatDate(blog.timePublished)}</td>
                                    <td>{formatDate(blog.createdTime)}</td>
                                    <td>{formatDate(blog.lastUpdatedTime)}</td>
                                    <td className="td-actions text-right">
                                      {blog.staffId === user?.unique_name ? (
                                        <button
                                          type="button"
                                          rel="tooltip"
                                          className="btn btn-warning btn-sm"
                                          data-original-title=""
                                          title="Edit"
                                          onClick={() =>
                                            navigate(
                                              `/staff/blogs/edit/${blog.id}`
                                            )
                                          }
                                        >
                                          <i className="material-icons">edit</i>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          rel="tooltip"
                                          className="btn btn-info btn-sm"
                                          data-original-title=""
                                          title="View"
                                          onClick={() =>
                                            navigate(
                                              `/staff/blogs/view/${blog.id}`
                                            )
                                          }
                                        >
                                          <i className="material-icons">
                                            visibility
                                          </i>
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredBlogs.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
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

export default Blogs;
