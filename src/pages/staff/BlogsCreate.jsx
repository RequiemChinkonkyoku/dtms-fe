import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

const StaffBlogsCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [blogImage, setBlogImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSaveAsDraft = async () => {
    try {
      Swal.fire({
        title: "Saving draft...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let imageUrl = "";
      if (blogImage) {
        const formData = new FormData();
        formData.append("file", blogImage);
        const uploadResponse = await axios.post("/api/uploadFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrl = uploadResponse.data;
      }

      const blogData = {
        title,
        content,
        imageUrl,
        staffProfileId: user.unique_name,
      };

      await axios.post("/api/blogs", blogData);

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Blog saved as draft",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/staff/blogs");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to save draft",
      });
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
        Swal.fire({
          title: "Publishing blog...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        let imageUrl = "";
        if (blogImage) {
          const formData = new FormData();
          formData.append("file", blogImage);
          const uploadResponse = await axios.post("/api/uploadFile", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          imageUrl = uploadResponse.data;
        }

        const blogData = {
          title,
          content,
          imageUrl,
          staffProfileId: user.unique_name,
        };

        const response = await axios.post("/api/blogs", blogData);
        const blogId = response.data.object.id;

        await axios.put(`/api/blogs/publish/${blogId}`);

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Blog published successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      navigate("/staff/blogs");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to publish blog",
      });
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBlogImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Blog Title</h4>
                        <p className="card-category">
                          Enter the title for your blog post
                        </p>
                      </div>
                      <div className="card-body">
                        <div className="form-group">
                          <label className="bmd-label-floating">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-info">
                        <h4 className="card-title">Blog Content</h4>
                        <p className="card-category">
                          Write your blog content and add images
                        </p>
                      </div>
                      <div className="card-body">
                        <div className="form-group">
                          <label className="bmd-label-floating">Content</label>
                          <textarea
                            className="form-control"
                            rows="6"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                          ></textarea>
                        </div>
                        <div className="form-group mt-4">
                          <label className="bmd-label">Images</label>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "16px",
                              }}
                            >
                              <Button
                                component="label"
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                              >
                                Upload Image
                                <VisuallyHiddenInput
                                  type="file"
                                  onChange={handleImageUpload}
                                  accept="image/*"
                                />
                              </Button>
                              {blogImage && (
                                <span className="text-muted">
                                  {blogImage.name}
                                </span>
                              )}
                            </div>
                            {imagePreview && (
                              <div>
                                <img
                                  src={imagePreview}
                                  alt="Blog preview"
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right mt-4">
                          <button
                            className="btn btn-secondary mr-2"
                            onClick={handleSaveAsDraft}
                            disabled={!title || !content}
                          >
                            <i className="material-icons">save</i> Save as Draft
                          </button>
                          <button
                            className="btn btn-success"
                            onClick={handlePublish}
                            disabled={!title || !content}
                          >
                            <i className="material-icons">publish</i> Publish
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-warning">
                        <h4 className="card-title">Blog Preview</h4>
                        <p className="card-category">
                          How your blog will appear to others
                        </p>
                      </div>
                      <div className="card-body">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Blog preview"
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
                              No image uploaded
                            </span>
                          </div>
                        )}
                        <h2
                          style={{ fontSize: "2.5rem", marginBottom: "20px" }}
                        >
                          {title || "Your Blog Title"}
                        </h2>
                        <div style={{ whiteSpace: "pre-wrap" }}>
                          {content || "Your blog content will appear here..."}
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

export default StaffBlogsCreate;
