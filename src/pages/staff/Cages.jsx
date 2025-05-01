import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import { useLoading } from "../../contexts/LoadingContext";

import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomPagination from "../../assets/components/common/CustomPagination";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const StaffCages = () => {
  const [cages, setCages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("createdTime");
  const [order, setOrder] = useState("desc");
  const [openModal, setOpenModal] = useState(false);
  const [newCage, setNewCage] = useState({
    location: "",
    cageCategoryId: "",
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editCage, setEditCage] = useState({
    id: "",
    location: "",
    status: 1,
    cageCategoryId: "",
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCage({ location: "", cageCategoryId: "" });
  };

  const handleCreateCage = async () => {
    try {
      await axios.post("/api/cages", newCage);
      handleCloseModal();

      const response = await axios.get("/api/cages");
      setCages(response.data.objectList);
    } catch (error) {
      console.error("Error creating cage:", error);
    }
  };

  const handleOpenEditModal = (cage) => {
    setEditCage({
      id: cage.id,
      location: cage.location,
      status: cage.status,
      cageCategoryId: cage.cageCategoryId,
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditCage({ id: "", location: "", status: 1, cageCategoryId: "" });
  };

  const handleEditCage = async () => {
    try {
      await axios.put("/api/cages", editCage);
      handleCloseEditModal();
      const response = await axios.get("/api/cages");
      setCages(response.data.objectList);
    } catch (error) {
      console.error("Error updating cage:", error);
    }
  };

  useEffect(() => {
    const fetchCages = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/cages");
        setCages(response.data.objectList);
      } catch (err) {
        setError("Failed to fetch cages");
      } finally {
        setLoading(false);
      }
    };

    fetchCages();
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
    return status === 1 ? "Available" : "Unavailable";
  };

  const getStatusClass = (status) => {
    return status === 1 ? "text-success" : "text-danger";
  };

  const sortedCages = React.useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === "createdTime") {
        return order === "asc"
          ? new Date(a[orderBy]) - new Date(b[orderBy])
          : new Date(b[orderBy]) - new Date(a[orderBy]);
      }
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    };

    return [...cages]
      .filter((cage) =>
        cage.number.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(comparator);
  }, [cages, order, orderBy, searchTerm]);

  const getCategoryName = (categoryId) => {
    const categories = {
      "57f1808014f741c79e2791dea717d760": "Small",
      fc97a573f1224b93b73ddce3eebd4095: "Medium",
      "79e21dea717d7609e2791dea717d7604": "Large",
    };
    return categories[categoryId] || "N/A";
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
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">home</i>
                        </div>
                        <h4 className="card-title">Cage management</h4>
                        <p class="card-category text-muted">
                          Create new cages, view details and manage them.
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
                                placeholder="Search cages..."
                              />
                              <button
                                className="btn btn-info"
                                onClick={handleOpenModal}
                              >
                                <i className="material-icons">add</i> Create
                                Cage
                              </button>
                            </div>
                            <CustomTable
                              columns={[
                                { key: "number", label: "Number" },
                                { key: "location", label: "Location" },
                                {
                                  key: "cageCategoryId",
                                  label: "Category",
                                  render: (value) => getCategoryName(value),
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
                                  label: "Created Time",
                                  render: (value) => formatDate(value),
                                },
                              ]}
                              data={sortedCages}
                              page={page}
                              rowsPerPage={rowsPerPage}
                              orderBy={orderBy}
                              order={order}
                              onSort={handleSort}
                              renderActions={(row) => (
                                <button
                                  type="button"
                                  className="btn btn-info btn-sm"
                                  onClick={() => handleOpenEditModal(row)}
                                >
                                  <i className="material-icons">edit</i>
                                </button>
                              )}
                            />
                            <CustomPagination
                              count={sortedCages.length}
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
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Create New Cage</DialogTitle>
          <DialogContent>
            <div style={{ minWidth: "400px", marginTop: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label className="bmd-label-floating">Location</label>
                <TextField
                  fullWidth
                  value={newCage.location}
                  onChange={(e) =>
                    setNewCage({ ...newCage, location: e.target.value })
                  }
                  margin="normal"
                />
              </div>
              <div>
                <label className="bmd-label-floating">Category</label>
                <FormControl fullWidth margin="normal">
                  <Select
                    value={newCage.cageCategoryId}
                    onChange={(e) =>
                      setNewCage({ ...newCage, cageCategoryId: e.target.value })
                    }
                  >
                    <MenuItem value="57f1808014f741c79e2791dea717d760">
                      Small
                    </MenuItem>
                    <MenuItem value="fc97a573f1224b93b73ddce3eebd4095">
                      Medium
                    </MenuItem>
                    <MenuItem value="79e21dea717d7609e2791dea717d7604">
                      Large
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateCage}
              disabled={!newCage.location || !newCage.cageCategoryId}
            >
              Create
            </button>
          </DialogActions>
        </Dialog>
        <Dialog open={openEditModal} onClose={handleCloseEditModal}>
          <DialogTitle>Edit Cage</DialogTitle>
          <DialogContent>
            <div style={{ minWidth: "400px", marginTop: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label className="bmd-label-floating">Location</label>
                <TextField
                  fullWidth
                  value={editCage.location}
                  onChange={(e) =>
                    setEditCage({ ...editCage, location: e.target.value })
                  }
                  margin="normal"
                />
              </div>
              <div>
                <label className="bmd-label-floating">Category</label>
                <FormControl fullWidth margin="normal">
                  <Select
                    value={editCage.cageCategoryId}
                    onChange={(e) =>
                      setEditCage({
                        ...editCage,
                        cageCategoryId: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="57f1808014f741c79e2791dea717d760">
                      Small
                    </MenuItem>
                    <MenuItem value="fc97a573f1224b93b73ddce3eebd4095">
                      Medium
                    </MenuItem>
                    <MenuItem value="79e21dea717d7609e2791dea717d7604">
                      Large
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div>
                <label className="bmd-label-floating">Status</label>
                <FormControl fullWidth margin="normal">
                  <Select
                    value={editCage.status}
                    onChange={(e) =>
                      setEditCage({ ...editCage, status: e.target.value })
                    }
                  >
                    <MenuItem value={1}>Available</MenuItem>
                    <MenuItem value={0}>Unavailable</MenuItem>
                  </Select>
                </FormControl>
                <p
                  className="text-warning"
                  style={{ fontSize: "0.875rem", marginTop: "8px" }}
                >
                  <i
                    className="material-icons"
                    style={{ fontSize: "16px", verticalAlign: "middle" }}
                  >
                    warning
                  </i>{" "}
                  Only change status when the cage is empty and needs
                  maintenance
                </p>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              onClick={handleCloseEditModal}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleEditCage}
              disabled={!editCage.location || !editCage.cageCategoryId}
            >
              Save Changes
            </button>
          </DialogActions>
        </Dialog>
      </body>
    </>
  );
};

export default StaffCages;
