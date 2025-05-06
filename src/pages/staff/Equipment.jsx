import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { showToast } from "../../utils/toastConfig";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import { useLoading } from "../../contexts/LoadingContext";

import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomPagination from "../../assets/components/common/CustomPagination";

import { TextField, Modal, Select, MenuItem } from "@mui/material";
import { softDelay } from "../../utils/softDelay";

const StaffEquipments = () => {
  const { loading, setLoading } = useLoading();
  const [equipments, setEquipments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("createdTime");
  const [order, setOrder] = useState("desc");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    description: "",
    status: 1,
    equipmentCategoryId: "",
  });
  const [equipmentCategories, setEquipmentCategories] = useState([]);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    equipmentCategoryId: "",
  });
  const [categoryDetails, setCategoryDetails] = useState({});
  const [openCategoryCreateModal, setOpenCategoryCreateModal] = useState(false);
  const [openCategoryEditModal, setOpenCategoryEditModal] = useState(false);
  const [categoryPage, setCategoryPage] = useState(0);
  const [categoryRowsPerPage, setCategoryRowsPerPage] = useState(5);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [categoryOrderBy, setCategoryOrderBy] = useState("createdTime");
  const [categoryOrder, setCategoryOrder] = useState("desc");
  const [categoryEditFormData, setCategoryEditFormData] = useState({
    id: "",
    name: "",
    description: "",
    status: 1,
  });
  const [categoryCreateFormData, setCategoryCreateFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/equipmentCategories");
        setEquipmentCategories(response.data.objectList);
        await softDelay();
      } catch (error) {
        console.error("Error fetching equipment categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryCreate = async () => {
    try {
      const response = await axios.post(
        "/api/equipmentCategories",
        categoryCreateFormData
      );
      if (response.data.success) {
        setEquipmentCategories([...equipmentCategories, response.data.object]);
        setOpenCategoryCreateModal(false);
        setCategoryCreateFormData({ name: "", description: "" });
        showToast.success("Equipment category created successfully!");
      }
    } catch (error) {
      console.error("Error creating equipment category:", error);
      showToast.error("Failed to create equipment category. Please try again.");
    }
  };

  const handleCategoryEdit = async () => {
    try {
      const response = await axios.put(
        "/api/equipmentCategories",
        categoryEditFormData
      );
      if (response.data.success) {
        setEquipmentCategories(
          equipmentCategories.map((category) =>
            category.id === categoryEditFormData.id
              ? response.data.object
              : category
          )
        );
        setOpenCategoryEditModal(false);
        showToast.success("Equipment category updated successfully!");
      }
    } catch (error) {
      console.error("Error updating equipment category:", error);
      showToast.error("Failed to update equipment category. Please try again.");
    }
  };

  const openCategoryEdit = (category) => {
    setCategoryEditFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      status: category.status,
    });
    setOpenCategoryEditModal(true);
  };

  // Add this sorted categories memo
  const sortedCategories = React.useMemo(() => {
    const comparator = (a, b) => {
      if (categoryOrderBy === "createdTime") {
        const dateA = new Date(a[categoryOrderBy]);
        const dateB = new Date(b[categoryOrderBy]);
        return categoryOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (categoryOrder === "asc") {
        return a[categoryOrderBy] < b[categoryOrderBy] ? -1 : 1;
      } else {
        return b[categoryOrderBy] < a[categoryOrderBy] ? -1 : 1;
      }
    };

    return [...equipmentCategories]
      .filter((category) =>
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
      )
      .sort(comparator);
  }, [equipmentCategories, categoryOrder, categoryOrderBy, categorySearchTerm]);

  const handleCreate = async () => {
    try {
      const response = await axios.post("/api/equipments", createFormData);
      if (response.data.success) {
        setEquipments([...equipments, response.data.object]);
        setOpenCreateModal(false);
        setCreateFormData({
          name: "",
          description: "",
          equipmentCategoryId: "",
        });
        showToast.success("Equipment created successfully!");
      }
    } catch (error) {
      console.error("Error creating equipment:", error);
      showToast.error("Failed to create equipment. Please try again.");
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put("/api/equipments", editFormData);
      if (response.data.success) {
        setEquipments(
          equipments.map((equipment) =>
            equipment.id === editFormData.id ? response.data.object : equipment
          )
        );
        setOpenEditModal(false);
        showToast.success("Equipment updated successfully!");
      }
    } catch (error) {
      console.error("Error updating equipment:", error);
      showToast.error("Failed to update equipment. Please try again.");
    }
  };

  const openEdit = (equipment) => {
    setEditFormData({
      id: equipment.id,
      name: equipment.name,
      description: equipment.description,
      status: equipment.status,
      equipmentCategoryId: equipment.equipmentCategoryId,
    });
    setOpenEditModal(true);
  };

  const fetchCategoryDetails = async (id) => {
    try {
      const response = await axios.get(`/api/equipmentCategories/${id}`);
      if (response.data.success) {
        setCategoryDetails((prev) => ({
          ...prev,
          [id]: response.data.object.name,
        }));
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  useEffect(() => {
    const fetchEquipments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/equipments");
        setEquipments(response.data.objectList);

        response.data.objectList.forEach((equipment) => {
          if (
            equipment.equipmentCategoryId &&
            !categoryDetails[equipment.equipmentCategoryId]
          ) {
            fetchCategoryDetails(equipment.equipmentCategoryId);
          }
        });

        await softDelay();
      } catch (error) {
        console.error("Error fetching equipments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
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

  const sortedEquipments = React.useMemo(() => {
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

    return [...equipments]
      .filter((equipment) =>
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(comparator);
  }, [equipments, order, orderBy, searchTerm]);

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
                          <i className="material-icons">fitness_center</i>
                        </div>
                        <h4 className="card-title">Equipment management</h4>
                        <p class="card-category text-muted">
                          Insert new equipments, view and edit existing ones.
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
                                placeholder="Search equipments..."
                              />
                              <button
                                className="btn btn-info"
                                onClick={() => setOpenCreateModal(true)}
                              >
                                <i className="material-icons">add</i> Create
                                Equipment
                              </button>
                            </div>
                            <CustomTable
                              columns={[
                                { key: "name", label: "Name" },
                                {
                                  key: "equipmentCategoryId",
                                  label: "Category",
                                  render: (value) =>
                                    categoryDetails[value] || "Loading...",
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
                                {
                                  key: "createdTime",
                                  label: "Created Date",
                                  render: (value) => formatDate(value),
                                },
                              ]}
                              data={sortedEquipments}
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
                              count={sortedEquipments.length}
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
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">category</i>
                        </div>
                        <h4 className="card-title">
                          Equipment Category Management
                        </h4>
                        <p className="card-category text-muted">
                          Manage equipment categories for better organization.
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
                                value={categorySearchTerm}
                                onChange={setCategorySearchTerm}
                                setPage={setCategoryPage}
                                placeholder="Search categories..."
                              />
                              <button
                                className="btn btn-info"
                                onClick={() => setOpenCategoryCreateModal(true)}
                              >
                                <i className="material-icons">add</i> Create
                                Category
                              </button>
                            </div>
                            <CustomTable
                              columns={[
                                { key: "name", label: "Name" },
                                { key: "description", label: "Description" },
                                {
                                  key: "status",
                                  label: "Status",
                                  render: (value) => (
                                    <span className={getStatusClass(value)}>
                                      {getStatusText(value)}
                                    </span>
                                  ),
                                },
                                {
                                  key: "createdTime",
                                  label: "Created Date",
                                  render: (value) => formatDate(value),
                                },
                              ]}
                              data={sortedCategories}
                              page={categoryPage}
                              rowsPerPage={categoryRowsPerPage}
                              orderBy={categoryOrderBy}
                              order={categoryOrder}
                              onSort={(property) => {
                                const isAsc =
                                  categoryOrderBy === property &&
                                  categoryOrder === "asc";
                                setCategoryOrder(isAsc ? "desc" : "asc");
                                setCategoryOrderBy(property);
                              }}
                              renderActions={(row) => (
                                <button
                                  type="button"
                                  className="btn btn-info btn-sm"
                                  title="Edit"
                                  onClick={() => openCategoryEdit(row)}
                                >
                                  <i className="material-icons">edit</i>
                                </button>
                              )}
                            />
                            <CustomPagination
                              count={sortedCategories.length}
                              rowsPerPage={categoryRowsPerPage}
                              page={categoryPage}
                              onPageChange={(event, newPage) =>
                                setCategoryPage(newPage)
                              }
                              onRowsPerPageChange={(event) => {
                                setCategoryRowsPerPage(
                                  parseInt(event.target.value, 10)
                                );
                                setCategoryPage(0);
                              }}
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
        aria-labelledby="create-equipment-modal"
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
          <h3>Create New Equipment</h3>
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
          <Select
            fullWidth
            value={createFormData.equipmentCategoryId}
            onChange={(e) =>
              setCreateFormData({
                ...createFormData,
                equipmentCategoryId: e.target.value,
              })
            }
            margin="normal"
            style={{ marginTop: "16px" }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            {equipmentCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <div style={{ marginTop: "20px" }}>
            <button
              className="btn btn-info"
              onClick={handleCreate}
              disabled={
                !createFormData.name || !createFormData.equipmentCategoryId
              }
            >
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
        aria-labelledby="edit-equipment-modal"
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
          <h2>Edit Equipment</h2>
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
            value={editFormData.equipmentCategoryId}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                equipmentCategoryId: e.target.value,
              })
            }
            margin="normal"
            style={{ marginTop: "16px" }}
          >
            {equipmentCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
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
            <button
              className="btn btn-info"
              onClick={handleEdit}
              disabled={!editFormData.name || !editFormData.equipmentCategoryId}
            >
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
      <Modal
        open={openCategoryCreateModal}
        onClose={() => setOpenCategoryCreateModal(false)}
        aria-labelledby="create-category-modal"
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
          <h3>Create New Equipment Category</h3>
          <TextField
            fullWidth
            label="Name"
            value={categoryCreateFormData.name}
            onChange={(e) =>
              setCategoryCreateFormData({
                ...categoryCreateFormData,
                name: e.target.value,
              })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={categoryCreateFormData.description}
            onChange={(e) =>
              setCategoryCreateFormData({
                ...categoryCreateFormData,
                description: e.target.value,
              })
            }
            margin="normal"
            multiline
            rows={4}
          />
          <div style={{ marginTop: "20px" }}>
            <button
              className="btn btn-info"
              onClick={handleCategoryCreate}
              disabled={!categoryCreateFormData.name}
            >
              Create
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => setOpenCategoryCreateModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openCategoryEditModal}
        onClose={() => setOpenCategoryEditModal(false)}
        aria-labelledby="edit-category-modal"
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
          <h2>Edit Equipment Category</h2>
          <TextField
            fullWidth
            label="Name"
            value={categoryEditFormData.name}
            onChange={(e) =>
              setCategoryEditFormData({
                ...categoryEditFormData,
                name: e.target.value,
              })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={categoryEditFormData.description}
            onChange={(e) =>
              setCategoryEditFormData({
                ...categoryEditFormData,
                description: e.target.value,
              })
            }
            margin="normal"
            multiline
            rows={4}
          />
          <Select
            fullWidth
            value={categoryEditFormData.status}
            onChange={(e) =>
              setCategoryEditFormData({
                ...categoryEditFormData,
                status: e.target.value,
              })
            }
            margin="normal"
            style={{ marginTop: "16px" }}
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </Select>
          <div style={{ marginTop: "20px" }}>
            <button
              className="btn btn-info"
              onClick={handleCategoryEdit}
              disabled={!categoryEditFormData.name}
            >
              Save Changes
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => setOpenCategoryEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StaffEquipments;
