import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { Link } from "react-router-dom";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import { showToast, dismissToast } from "../../utils/toastConfig";

import { TablePagination, Modal } from "@mui/material";
import CustomTable from "../../assets/components/common/CustomTable";
import CustomPagination from "../../assets/components/common/CustomPagination";

const StaffAccountsCustomerDetails = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dogs, setDogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [legalDocuments, setLegalDocuments] = useState([]);
  const [documentPage, setDocumentPage] = useState(0);
  const [documentRowsPerPage, setDocumentRowsPerPage] = useState(5);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(`/api/accounts/${id}`);
        setAccount(response.data);
      } catch (error) {
        console.error("Error fetching account details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountResponse, dogsResponse] = await Promise.all([
          axios.get(`/api/accounts/${id}`),
          axios.get(`/api/dogs/by-customer/${id}`),
        ]);
        setAccount(accountResponse.data);
        setDogs(dogsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchLegalDocuments = async () => {
      try {
        const response = await axios.get(`/api/legalDocument/customer/${id}`);
        if (response.data.success) {
          setLegalDocuments(response.data.objectList || []);
        }
      } catch (error) {
        console.error("Error fetching legal documents:", error);
      }
    };

    fetchLegalDocuments();
  }, [id]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return <span className="text-warning">Pending</span>;
      case 1:
        return <span className="text-success">Approved</span>;
      case 2:
        return <span className="text-danger">Rejected</span>;
      default:
        return <span>Unknown</span>;
    }
  };

  const handleDocumentApproval = async (documentId, status) => {
    try {
      await axios.put(`/api/legalDocument/approval/${documentId}`, {
        description: reason,
        status: status,
      });

      const response = await axios.get(`/api/legalDocument/customer/${id}`);
      if (response.data.success) {
        setLegalDocuments(response.data.objectList || []);
      }

      setShowModal(false);
      setReason("");
      setSelectedDocument(null);
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      showToast.loading("Sending reset password email...");
      await axios.post(`/api/accounts/forgotPassword?email=${account.email}`);
      dismissToast();
      showToast.success("Password reset email has been sent");
    } catch (error) {
      dismissToast();
      showToast.error("Failed to send password reset email");
      console.error("Error resetting password:", error);
    }
  };

  const handleDeactivate = async () => {
    try {
      await axios.delete(`/api/accounts/${id}`);

      // Refresh account data
      const response = await axios.get(`/api/accounts/${id}`);
      setAccount(response.data);
      showToast.success("Account has been deactivated");
    } catch (error) {
      showToast.error("Failed to deactivate account");
      console.error("Error deactivating account:", error);
    }
  };

  const handleActivate = async () => {
    try {
      await axios.put(`/api/accounts/${id}/activate`);

      // Refresh account data
      const response = await axios.get(`/api/accounts/${id}`);
      setAccount(response.data);
      showToast.success("Account has been activated");
    } catch (error) {
      showToast.error("Failed to activate account");
      console.error("Error activating account:", error);
    }
  };

  const handleConvertToOrganization = async () => {
    try {
      showToast.loading("Converting account to organization...");
      await axios.put(`/api/accounts/${id}/convert-to-organization`);

      const response = await axios.get(`/api/accounts/${id}`);
      setAccount(response.data);
      dismissToast();
      showToast.success("Account has been converted to organization");
    } catch (error) {
      dismissToast();
      showToast.error("Failed to convert account");
      console.error("Error converting account:", error);
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
                <div className="row">
                  <div className="col-md-3">
                    <div className="card card-profile">
                      <div className="card-avatar">
                        <img
                          className="img"
                          src={
                            !account || account.imageUrl === "empty"
                              ? "/path/to/default/avatar.jpg"
                              : account.imageUrl
                          }
                          alt={account?.fullName || "Customer"}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h4 className="card-title">{account.fullName}</h4>
                        <p className="card-description">
                          {account.roleId === "a4b5c67890d1e2f3a4b5c67890d1e2f3"
                            ? "Customer - Individual"
                            : account.roleId ===
                                "b5c67890d1e2f3a4b5c67890d1e2f3a4"
                              ? "Customer - Organization"
                              : "Customer"}
                        </p>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm mr-2"
                        onClick={handleResetPassword}
                      >
                        Reset Password
                      </button>
                      {account.status === 1 ? (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={handleDeactivate}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={handleActivate}
                        >
                          Reactivate
                        </button>
                      )}
                      {account.roleId ===
                        "a4b5c67890d1e2f3a4b5c67890d1e2f3" && (
                        <button
                          type="button"
                          className="btn btn-info btn-sm mt-2 w-100"
                          onClick={handleConvertToOrganization}
                        >
                          Convert to Organization
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Customer Information</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Username</label>
                              <p className="form-control-static">
                                {account.username}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Email</label>
                              <p className="form-control-static">
                                {account.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Phone Number</label>
                              <p className="form-control-static">
                                {account.phoneNumber}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Date of Birth</label>
                              <p className="form-control-static">
                                {new Date(
                                  account.dateOfBirth
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label>Address</label>
                              <p className="form-control-static">
                                {account.address}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Gender</label>
                              <p className="form-control-static">
                                {account.gender === 0
                                  ? "Male"
                                  : account.gender === 1
                                    ? "Female"
                                    : "Other"}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Membership Points</label>
                              <p className="form-control-static">
                                {account.membershipPoints}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group">
                              <label>Status</label>
                              <p className="form-control-static">
                                {account.status === 1 ? (
                                  <span class="text-success">Active</span>
                                ) : account.status === 0 ? (
                                  <span class="text-warning">Inactive</span>
                                ) : (
                                  <span class="text-danger">Deactivated</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Customer's Dogs</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <CustomTable
                            columns={[
                              {
                                key: "imageUrl",
                                label: "Image",
                                render: (value, row) => (
                                  <img
                                    src={value}
                                    alt={row.name}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ),
                              },
                              { key: "name", label: "Name" },
                              { key: "dateOfBirth", label: "Date of Birth" },
                              {
                                key: "gender",
                                label: "Gender",
                                render: (value) =>
                                  value === 0 ? "Male" : "Female",
                              },
                              {
                                key: "status",
                                label: "Status",
                                render: (value) =>
                                  value === 1 ? "Active" : "Inactive",
                              },
                              { key: "dogBreedName", label: "Breed" },
                              {
                                key: "registrationTime",
                                label: "Registered Time",
                                render: (value) => value.split(" ")[0],
                              },
                            ]}
                            data={dogs}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            renderActions={(row) => (
                              <Link
                                to={`/staff/dogs/details/${row.id}`}
                                className="btn btn-info btn-sm"
                                data-original-title="View Details"
                                title="View Details"
                              >
                                <i className="material-icons">more_vert</i>
                              </Link>
                            )}
                          />
                          <CustomPagination
                            count={dogs.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-warning">
                        <h4 className="card-title">Legal Documents</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <CustomTable
                            columns={[
                              { key: "name", label: "Document Name" },
                              {
                                key: "status",
                                label: "Status",
                                render: (value) => getStatusLabel(value),
                              },
                              {
                                key: "uploadTime",
                                label: "Upload Time",
                                render: (value) =>
                                  new Date(value).toLocaleString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }),
                              },
                            ]}
                            data={legalDocuments}
                            page={documentPage}
                            rowsPerPage={documentRowsPerPage}
                            renderActions={(row) => (
                              <div>
                                <button
                                  className="btn btn-info btn-sm mr-2"
                                  onClick={() => handleImageClick(row.imageUrl)}
                                >
                                  <i className="material-icons">image</i>
                                </button>
                                {row.status === 0 && (
                                  <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => {
                                      setSelectedDocument(row);
                                      setShowModal(true);
                                    }}
                                  >
                                    <i className="material-icons">
                                      rate_review
                                    </i>
                                  </button>
                                )}
                              </div>
                            )}
                          />
                          <CustomPagination
                            count={legalDocuments.length}
                            page={documentPage}
                            rowsPerPage={documentRowsPerPage}
                            onPageChange={(e, newPage) =>
                              setDocumentPage(newPage)
                            }
                            onRowsPerPageChange={(e) => {
                              setDocumentRowsPerPage(
                                parseInt(e.target.value, 10)
                              );
                              setDocumentPage(0);
                            }}
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
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setReason("");
          setSelectedDocument(null);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="modal-dialog"
          style={{ margin: 0, maxWidth: "500px", width: "100%" }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Review Document</h5>
              <button
                type="button"
                className="close"
                onClick={() => {
                  setShowModal(false);
                  setReason("");
                  setSelectedDocument(null);
                }}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="mb-2">Review Reason</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Enter your review reason here..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{
                    resize: "vertical",
                    minHeight: "100px",
                    marginBottom: "20px",
                  }}
                />
              </div>
            </div>
            <div
              className="modal-footer"
              style={{ flexDirection: "column", gap: "10px" }}
            >
              <button
                type="button"
                className="btn btn-success w-100"
                onClick={() => handleDocumentApproval(selectedDocument.id, 1)}
              >
                Approve Document
              </button>
              <button
                type="button"
                className="btn btn-danger w-100"
                onClick={() => handleDocumentApproval(selectedDocument.id, 2)}
              >
                Reject Document
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={showImageModal}
        onClose={() => {
          setShowImageModal(false);
          setSelectedImage(null);
        }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Document Image</h5>
              <button
                type="button"
                className="close"
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedImage(null);
                }}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
              <img
                src={selectedImage}
                alt="Document"
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StaffAccountsCustomerDetails;
