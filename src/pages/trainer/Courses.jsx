import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useNavigate } from "react-router-dom";
import { TablePagination, TableSortLabel, TextField } from "@mui/material";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";
import { useLoading } from "../../contexts/LoadingContext";

import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomPagination from "../../assets/components/common/CustomPagination";
import CustomFilter from "../../assets/components/common/CustomFilter";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { showToast } from "../../utils/toastConfig";

const TrainerCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const { loading, setLoading } = useLoading();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("createdTime");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [complexityFilter, setComplexityFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [categoryPage, setCategoryPage] = useState(0);
  const [categoryRowsPerPage, setCategoryRowsPerPage] = useState(5);
  const [categoryOrderBy, setCategoryOrderBy] = useState("createdTime");
  const [categoryOrder, setCategoryOrder] = useState("desc");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  });
  const [editCategoryFormData, setEditCategoryFormData] = useState({
    id: "",
    name: "",
    description: "",
    status: 1,
  });

  const handleCategoryStatusUpdate = async (categoryId, currentStatus) => {
    try {
      const response = await axios.put("/api/categories", {
        id: categoryId,
        name: editCategoryFormData.name,
        description: editCategoryFormData.description,
        status: currentStatus === 1 ? 0 : 1,
      });
      if (response.data.success) {
        setCategories(
          categories.map((cat) =>
            cat.id === categoryId ? response.data.object : cat
          )
        );
        showToast.success("Category status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      showToast.error("Failed to update category status");
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await axios.post("/api/categories", categoryFormData);
      if (response.data.success) {
        setCategories([...categories, response.data.object]);
        setOpenCreateCategoryModal(false);
        setCategoryFormData({ name: "", description: "" });
        showToast.success("Category created successfully!");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      showToast.error("Failed to create category");
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await axios.put("/api/categories", editCategoryFormData);
      if (response.data.success) {
        setCategories(
          categories.map((cat) =>
            cat.id === editCategoryFormData.id ? response.data.object : cat
          )
        );
        setOpenEditCategoryModal(false);
        showToast.success("Category updated successfully!");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      showToast.error("Failed to update category");
    }
  };

  const handleOpenEditModal = (category) => {
    setEditCategoryFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      status: category.status,
    });
    setOpenEditCategoryModal(true);
  };

  // Add this sorting function
  const sortedCategories = React.useMemo(() => {
    const comparator = (a, b) => {
      if (categoryOrderBy === "createdTime") {
        const dateA = new Date(a[categoryOrderBy]).getTime();
        const dateB = new Date(b[categoryOrderBy]).getTime();
        return categoryOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (categoryOrder === "asc") {
        return a[categoryOrderBy] < b[categoryOrderBy] ? -1 : 1;
      } else {
        return b[categoryOrderBy] < a[categoryOrderBy] ? -1 : 1;
      }
    };

    return [...categories]
      .filter((category) =>
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
      )
      .sort(comparator);
  }, [categories, categoryOrder, categoryOrderBy, categorySearchTerm]);

  // Add this effect to fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.data.success) {
          setCategories(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

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

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Active";
      case 0:
        return "Inactive";
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
      default:
        return "";
    }
  };

  const sortedCourses = React.useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === "createdTime") {
        const dateA = new Date(a[orderBy]).getTime();
        const dateB = new Date(b[orderBy]).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    };

    return [...courses]
      .filter((course) => {
        const matchesSearch = course.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesComplexity =
          complexityFilter === "all" ||
          course.complexity === parseInt(complexityFilter);
        return matchesSearch && matchesComplexity;
      })
      .sort(comparator);
  }, [courses, order, orderBy, searchTerm, complexityFilter]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const startTime = Date.now();
      try {
        const response = await axios.get("/api/courses");
        setCourses(response.data.objectList);

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">school</i>
                        </div>
                        <h4 className="card-title">Course management</h4>
                        <p class="card-category text-muted">
                          Create new course, view details and manage them.
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
                                gap: "16px",
                              }}
                            >
                              <div style={{ display: "flex", gap: "16px" }}>
                                <CustomSearch
                                  value={searchTerm}
                                  onChange={setSearchTerm}
                                  setPage={setPage}
                                />
                                <CustomFilter
                                  value={complexityFilter}
                                  onChange={setComplexityFilter}
                                  setPage={setPage}
                                  label="Complexity"
                                  options={[
                                    { value: "all", label: "All Complexity" },
                                    { value: "1", label: "Beginner" },
                                    { value: "2", label: "Intermediate" },
                                    { value: "3", label: "Advanced" },
                                    { value: "4", label: "Expert" },
                                    { value: "5", label: "Master" },
                                  ]}
                                />
                              </div>
                              <button
                                className="btn btn-primary"
                                onClick={() =>
                                  navigate("/trainer/courses/create")
                                }
                              >
                                <i className="material-icons">add</i> Create
                                Course
                              </button>
                            </div>
                            <CustomTable
                              columns={[
                                { key: "name", label: "Name" },
                                {
                                  key: "durationInWeeks",
                                  label: "Duration",
                                  render: (value) => `${value} week(s)`,
                                },
                                {
                                  key: "daysPerWeek",
                                  label: "Days/Week",
                                  render: (value) => `${value} day(s)`,
                                },
                                {
                                  key: "slotsPerDay",
                                  label: "Slots/Day",
                                  render: (value) => `${value} slot(s)`,
                                },
                                {
                                  key: "complexity",
                                  label: "Complexity",
                                  render: (value) => (
                                    <div style={{ verticalAlign: "middle" }}>
                                      {[...Array(5)].map((_, index) => (
                                        <i
                                          key={index}
                                          className="material-icons"
                                          style={{ fontSize: "18px" }}
                                        >
                                          {index < value
                                            ? "star"
                                            : "star_border"}
                                        </i>
                                      ))}
                                    </div>
                                  ),
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
                              data={sortedCourses}
                              page={page}
                              rowsPerPage={rowsPerPage}
                              orderBy={orderBy}
                              order={order}
                              onSort={handleSort}
                              renderActions={(row) => (
                                <button
                                  type="button"
                                  rel="tooltip"
                                  className="btn btn-info btn-sm"
                                  data-original-title="View Details"
                                  title="View Details"
                                  onClick={() =>
                                    navigate(
                                      `/trainer/courses/details/${row.id}`
                                    )
                                  }
                                >
                                  <i className="material-icons">more_vert</i>
                                </button>
                              )}
                            />
                            <CustomPagination
                              count={sortedCourses.length}
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
                <div className="row mt-4">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">category</i>
                        </div>
                        <h4 className="card-title">Course Categories</h4>
                        <p className="card-category text-muted">
                          View and manage course categories
                        </p>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <div
                            style={{
                              padding: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "16px",
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
                              onClick={() => setOpenCreateCategoryModal(true)}
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
                                onClick={() => handleOpenEditModal(row)}
                              >
                                <i className="material-icons">edit</i>
                              </button>
                            )}
                          />
                          <CustomPagination
                            count={sortedCategories.length}
                            rowsPerPage={categoryRowsPerPage}
                            page={categoryPage}
                            onPageChange={(e, newPage) =>
                              setCategoryPage(newPage)
                            }
                            onRowsPerPageChange={(e) => {
                              setCategoryRowsPerPage(
                                parseInt(e.target.value, 10)
                              );
                              setCategoryPage(0);
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
      <Dialog
        open={openCreateCategoryModal}
        onClose={() => setOpenCreateCategoryModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={categoryFormData.name}
            onChange={(e) =>
              setCategoryFormData({ ...categoryFormData, name: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={categoryFormData.description}
            onChange={(e) =>
              setCategoryFormData({
                ...categoryFormData,
                description: e.target.value,
              })
            }
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-secondary"
            onClick={() => setOpenCreateCategoryModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-info"
            onClick={handleCreateCategory}
            disabled={!categoryFormData.name}
          >
            Create
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditCategoryModal}
        onClose={() => setOpenEditCategoryModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={editCategoryFormData.name}
            onChange={(e) =>
              setEditCategoryFormData({
                ...editCategoryFormData,
                name: e.target.value,
              })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={editCategoryFormData.description}
            onChange={(e) =>
              setEditCategoryFormData({
                ...editCategoryFormData,
                description: e.target.value,
              })
            }
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-secondary"
            onClick={() => setOpenEditCategoryModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-warning"
            onClick={handleEditCategory}
            disabled={!editCategoryFormData.name}
          >
            Update
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEditCategoryModal}
        onClose={() => setOpenEditCategoryModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={editCategoryFormData.name}
            onChange={(e) =>
              setEditCategoryFormData({
                ...editCategoryFormData,
                name: e.target.value,
              })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={editCategoryFormData.description}
            onChange={(e) =>
              setEditCategoryFormData({
                ...editCategoryFormData,
                description: e.target.value,
              })
            }
            margin="normal"
            multiline
            rows={4}
          />
          <Select
            fullWidth
            value={editCategoryFormData.status}
            onChange={(e) =>
              setEditCategoryFormData({
                ...editCategoryFormData,
                status: e.target.value,
              })
            }
            margin="normal"
            style={{ marginTop: "16px" }}
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-secondary"
            onClick={() => setOpenEditCategoryModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-info"
            onClick={handleEditCategory}
            disabled={!editCategoryFormData.name}
          >
            Save Changes
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TrainerCourses;
