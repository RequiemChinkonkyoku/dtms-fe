import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blog/get-all-blogs");
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
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head />
      <body>
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
                        <div className="toolbar">
                          <button className="btn btn-primary">
                            <i className="material-icons">add</i> New Blog
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Published Date</th>
                                <th>Created Date</th>
                                <th>Last Updated</th>
                                <th className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {blogs.map((blog, index) => (
                                <tr key={blog.id}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>{blog.title}</td>
                                  <td className={getStatusClass(blog.status)}>
                                    {getStatusText(blog.status)}
                                  </td>
                                  <td>{formatDate(blog.timePublished)}</td>
                                  <td>{formatDate(blog.createdTime)}</td>
                                  <td>{formatDate(blog.lastUpdatedTime)}</td>
                                  <td className="td-actions text-right">
                                    <button
                                      type="button"
                                      rel="tooltip"
                                      className="btn btn-info btn-sm"
                                      data-original-title=""
                                      title="View"
                                    >
                                      <i className="material-icons">
                                        visibility
                                      </i>
                                    </button>
                                    <button
                                      type="button"
                                      rel="tooltip"
                                      className="btn btn-success btn-sm"
                                      data-original-title=""
                                      title="Edit"
                                    >
                                      <i className="material-icons">edit</i>
                                    </button>
                                    <button
                                      type="button"
                                      rel="tooltip"
                                      className="btn btn-danger btn-sm"
                                      data-original-title=""
                                      title="Delete"
                                    >
                                      <i className="material-icons">delete</i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
