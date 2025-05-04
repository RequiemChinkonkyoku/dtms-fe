import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/admin/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/admin/Navbar";
import { dismissToast, showToast } from "../../utils/toastConfig";

import Swal from "sweetalert2";
import { Modal, TextField } from "@mui/material";

const AdminBlogsDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        if (response.data.success) {
          setBlog(response.data.object);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = async () => {
    try {
      const toastId = showToast.loading("Updating blog...");
      const response = await axios.put(`/api/blogs/${id}`, {
        title: editTitle,
        content: editContent,
        imageUrl: blog.imageUrl,
        adminProfileId: user.unique_name,
      });
      if (response.data.success) {
        setOpenModal(false);
        dismissToast(toastId);
        showToast.success("Blog updated successfully");
        window.location.reload();
      }
    } catch (error) {
      dismissToast();
      showToast.error(error.response?.data?.message || "Failed to update blog");
    }
  };

  const handlePublish = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This blog will be published and visible to all users",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, publish it!",
      });

      if (result.isConfirmed) {
        const toastId = showToast.loading("Publishing blog...");
        const response = await axios.put(`/api/blogs/publish/${id}`);
        if (response.data.success) {
          dismissToast(toastId);
          showToast.success("Blog published successfully");
          navigate("/admin/blogs");
        }
      }
    } catch (error) {
      dismissToast();
      showToast.error(
        error.response?.data?.message || "Failed to publish blog"
      );
    }
  };

  const handleArchive = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This blog will be archived and no longer visible to users",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, archive it!",
      });

      if (result.isConfirmed) {
        const toastId = showToast.loading("Archiving blog...");
        try {
          await axios.delete(`/api/blogs/${id}`);
          dismissToast(toastId);
          showToast.success("Blog archived successfully");
          navigate("/admin/blogs");
        } catch (error) {
          dismissToast(toastId);
          if (error.response?.status === 404) {
            showToast.error("Blog not found");
          } else {
            showToast.error("Failed to archive blog");
          }
        }
      }
    } catch (error) {
      showToast.error("An unexpected error occurred");
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
                {blog && (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-header card-header-warning">
                          <h4 className="card-title">Blog Details</h4>
                        </div>
                        <div className="card-body">
                          {blog.imageUrl ? (
                            <img
                              src={blog.imageUrl}
                              alt="Blog"
                              style={{
                                width: "100%",
                                height: "300px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                marginBottom: "20px",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "300px",
                                backgroundColor: "#f5f5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "4px",
                                marginBottom: "20px",
                              }}
                            >
                              <span className="text-muted">
                                No image available
                              </span>
                            </div>
                          )}
                          <h2
                            style={{ fontSize: "2.5rem", marginBottom: "20px" }}
                          >
                            {blog.title}
                          </h2>
                          <div style={{ whiteSpace: "pre-wrap" }}>
                            {blog.content}
                          </div>
                          <hr />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-header card-header-info">
                          <h4 className="card-title">Additional Information</h4>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <p>
                                <strong>Status: </strong>
                                <span
                                  className={
                                    blog.status === 1
                                      ? "text-success"
                                      : blog.status === 0
                                        ? "text-warning"
                                        : "text-danger"
                                  }
                                >
                                  {blog.status === 1
                                    ? "Published"
                                    : blog.status === 0
                                      ? "Draft"
                                      : "Archived"}
                                </span>
                              </p>
                              <p>
                                <strong>Created: </strong>
                                {formatDate(blog.createdTime)}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p>
                                <strong>Last Updated: </strong>
                                {formatDate(blog.lastUpdatedTime)}
                              </p>
                              {blog.status === 1 && (
                                <p>
                                  <strong>Published: </strong>
                                  {formatDate(blog.timePublished)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <Modal
                  open={openModal}
                  onClose={() => setOpenModal(false)}
                  aria-labelledby="edit-blog-modal"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "8px",
                      width: "80%",
                      maxHeight: "80vh",
                      overflowY: "auto",
                    }}
                  >
                    <h2>Edit Blog</h2>
                    <TextField
                      fullWidth
                      label="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      margin="normal"
                      multiline
                      rows={10}
                    />
                    <div style={{ marginTop: "20px" }}>
                      <button className="btn btn-warning" onClick={handleEdit}>
                        Save Changes
                      </button>
                      <button
                        className="btn btn-secondary ml-2"
                        onClick={() => setOpenModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default AdminBlogsDetails;
