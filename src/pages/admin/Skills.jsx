import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { showToast } from "../../utils/toastConfig";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/admin/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/admin/Navbar";
import { useLoading } from "../../contexts/LoadingContext";

import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomPagination from "../../assets/components/common/CustomPagination";

import { TextField, Modal, Select, MenuItem } from "@mui/material";

const AdminSkills = () => {
  const { loading, setLoading } = useLoading();
  const [skills, setSkills] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("createdTime");
  const [order, setOrder] = useState("desc");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
  });
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    description: "",
    status: 1,
  });

  const handleCreate = async () => {
    try {
      const response = await axios.post("/api/skills", createFormData);
      if (response.data.success) {
        setSkills([...skills, response.data.object]);
        setOpenCreateModal(false);
        setCreateFormData({ name: "", description: "" });
        showToast.success("Skill created successfully!");
      }
    } catch (error) {
      console.error("Error creating skill:", error);
      showToast.error("Failed to create skill. Please try again.");
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put("/api/skills", editFormData);
      if (response.data.success) {
        setSkills(
          skills.map((skill) =>
            skill.id === editFormData.id ? response.data.object : skill
          )
        );
        setOpenEditModal(false);
        showToast.success("Skill updated successfully!");
      }
    } catch (error) {
      console.error("Error updating skill:", error);
      showToast.error("Failed to update skill. Please try again.");
    }
  };

  const openEdit = (skill) => {
    setEditFormData({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      status: skill.status,
    });
    setOpenEditModal(true);
  };

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      const startTime = Date.now();
      try {
        const response = await axios.get("/api/skills");
        setSkills(response.data.objectList);

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case -1:
        return "Disabled";
      case 0:
        return "Inactive";
      case 1:
        return "Active";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case -1:
        return "text-danger";
      case 0:
        return "text-warning";
      case 1:
        return "text-success";
      default:
        return "";
    }
  };

  const sortedSkills = React.useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === "createdTime") {
        const dateA = new Date(a[orderBy]);
        const dateB = new Date(b[orderBy]);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    };

    return [...skills]
      .filter((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(comparator);
  }, [skills, order, orderBy, searchTerm]);

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
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">psychology</i>
                        </div>
                        <h4 className="card-title">Skills management</h4>
                        <p class="card-category text-muted">
                          Insert new skills, view and edit existing ones.
                        </p>
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
                              <CustomSearch
                                value={searchTerm}
                                onChange={setSearchTerm}
                                setPage={setPage}
                                placeholder="Search skills..."
                              />
                              <button
                                className="btn btn-info"
                                onClick={() => setOpenCreateModal(true)}
                              >
                                <i className="material-icons">add</i> Create
                                Skill
                              </button>
                            </div>
                            <CustomTable
                              columns={[
                                { key: "name", label: "Name" },
                                {
                                  key: "createdTime",
                                  label: "Created Date",
                                  render: (value) => formatDate(value),
                                },
                                {
                                  key: "status",
                                  label: "Status",
                                  render: (value) => (
                                    <span className={getStatusClass(value)}>
                                      {getStatusText(value)}
                                    </span>
                                  ),
                                },
                              ]}
                              data={sortedSkills}
                              page={page}
                              rowsPerPage={rowsPerPage}
                              orderBy={orderBy}
                              order={order}
                              onSort={handleSort}
                              renderActions={(row) => (
                                <button
                                  type="button"
                                  className="btn btn-info btn-sm"
                                  title="Edit"
                                  onClick={() => openEdit(row)}
                                >
                                  <i className="material-icons">edit</i>
                                </button>
                              )}
                            />
                            <CustomPagination
                              count={sortedSkills.length}
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
      <Modal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        aria-labelledby="create-skill-modal"
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
            width: "400px",
          }}
        >
          <h2>Create New Skill</h2>
          <TextField
            fullWidth
            label="Name"
            value={createFormData.name}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, name: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={createFormData.description}
            onChange={(e) =>
              setCreateFormData({
                ...createFormData,
                description: e.target.value,
              })
            }
            margin="normal"
            multiline
            rows={4}
          />
          <div style={{ marginTop: "20px" }}>
            <button className="btn btn-info" onClick={handleCreate}>
              Create
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => setOpenCreateModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-skill-modal"
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
            width: "400px",
          }}
        >
          <h2>Edit Skill</h2>
          <TextField
            fullWidth
            label="Name"
            value={editFormData.name}
            onChange={(e) =>
              setEditFormData({ ...editFormData, name: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={editFormData.description}
            onChange={(e) =>
              setEditFormData({ ...editFormData, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={4}
          />
          <Select
            fullWidth
            value={editFormData.status}
            onChange={(e) =>
              setEditFormData({ ...editFormData, status: e.target.value })
            }
            margin="normal"
            style={{ marginTop: "16px" }}
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </Select>
          <div style={{ marginTop: "20px" }}>
            <button className="btn btn-info" onClick={handleEdit}>
              Save Changes
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => setOpenEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminSkills;
