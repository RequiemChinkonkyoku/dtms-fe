import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { showToast, dismissToast } from "../../utils/toastConfig";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import { useAuth } from "../../contexts/AuthContext";

const StaffProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: 0,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleEditOpen = () => {
    setEditForm({
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      address: profile.address,
      dateOfBirth: new Date(profile.dateOfBirth).toISOString().split("T")[0],
      gender: profile.gender,
    });
    setImagePreview(profile.imageUrl);
    setOpenEditModal(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      const toastId = showToast.loading("Updating profile...");

      let imageUrl = profile.imageUrl;
      if (profileImage) {
        const formData = new FormData();
        formData.append("file", profileImage);
        const uploadResponse = await axios.post("/api/uploadFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrl = uploadResponse.data;
      }

      const response = await axios.put(`/api/accounts/${profile.id}`, {
        ...profile,
        ...editForm,
        imageUrl,
      });

      if (response.data) {
        setProfile(response.data);
        setOpenEditModal(false);
        dismissToast(toastId);
        showToast.success("Profile updated successfully");
      }
    } catch (error) {
      dismissToast();
      showToast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/accounts/${user.unique_name}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
                <div className="row">
                  <div className="col-md-9">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Profile Information</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Username</label>
                              <p className="form-control-static">
                                {profile.username}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Email</label>
                              <p className="form-control-static">
                                {profile.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Status</label>
                              <p className="form-control-static">
                                {profile.status === 1 ? (
                                  <span className="text-success">Active</span>
                                ) : profile.status === 0 ? (
                                  <span className="text-warning">Inactive</span>
                                ) : (
                                  <span className="text-danger">
                                    Deactivated
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Registration Time</label>
                              <p className="form-control-static">
                                {new Date(
                                  profile.registrationTime
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Phone Number</label>
                              <p className="form-control-static">
                                {profile.phoneNumber}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Gender</label>
                              <p className="form-control-static">
                                {profile.gender === 0
                                  ? "Male"
                                  : profile.gender === 1
                                    ? "Female"
                                    : "Other"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label>Address</label>
                              <p className="form-control-static">
                                {profile.address}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Date of Birth</label>
                              <p className="form-control-static">
                                {new Date(
                                  profile.dateOfBirth
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Role ID</label>
                              <p className="form-control-static">
                                {profile.roleId}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card card-profile">
                      <div className="card-avatar">
                        <img
                          className="img"
                          src={
                            profile.imageUrl === "empty"
                              ? "/path/to/default/avatar.jpg"
                              : profile.imageUrl
                          }
                          alt={profile.fullName}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h4 className="card-title">{profile.fullName}</h4>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        className="btn btn-primary btn-round"
                        onClick={() => setOpenEditModal(true)}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <div className="row mt-3">
            <div className="col-md-12 text-center mb-4">
              <div className="d-flex flex-column align-items-center">
                <img
                  src={imagePreview || "/path/to/default/avatar.jpg"}
                  alt="Profile preview"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "1rem",
                  }}
                />
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Photo
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </Button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.phoneNumber}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={editForm.dateOfBirth}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      dateOfBirth: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Gender</label>
                <select
                  className="form-control"
                  value={editForm.gender}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      gender: Number(e.target.value),
                    }))
                  }
                >
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                </select>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StaffProfile;
