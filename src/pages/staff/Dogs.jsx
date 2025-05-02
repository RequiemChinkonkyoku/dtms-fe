import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import Loader from "../../assets/components/common/Loader";
import Head from "../../assets/components/common/Head";
import Sidebar from "../../assets/components/staff/Sidebar";
import Navbar from "../../assets/components/staff/Navbar";
import DatePicker from "react-datepicker";
import { useLoading } from "../../contexts/LoadingContext";
import { Link } from "react-router-dom";

import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomTable from "../../assets/components/common/CustomTable";
import CustomPagination from "../../assets/components/common/CustomPagination";
import { showToast, dismissToast } from "../../utils/toastConfig";

import "react-datepicker/dist/react-datepicker.css";

import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

const StaffDogs = () => {
  const [dogs, setDogs] = useState([]);
  const { loading, setLoading } = useLoading();
  const [error, setError] = useState(null);
  const [dogBreeds, setDogBreeds] = useState([]);
  const [breedPage, setBreedPage] = useState(0);
  const [breedOrderBy, setBreedOrderBy] = useState("createdTime");
  const [breedOrder, setBreedOrder] = useState("desc");
  const [breedRowsPerPage, setBreedRowsPerPage] = useState(5);
  const [breedSearchTerm, setBreedSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("registrationTime");
  const [order, setOrder] = useState("desc");
  const [isBreedModalOpen, setIsBreedModalOpen] = useState(false);
  const [breedFormData, setBreedFormData] = useState({
    name: "",
    description: "",
  });
  const [editingBreed, setEditingBreed] = useState(null);
  const [updateBreedFormData, setUpdateBreedFormData] = useState({
    name: "",
    description: "",
    status: 1,
  });

  const handleBreedSubmit = async (e) => {
    e.preventDefault();
    try {
      const toastId = showToast.loading("Creating breed...");
      const response = await axios.post("/api/dogBreeds", breedFormData);

      // Add to beginning of array for most recent first
      setDogBreeds([response.data, ...dogBreeds]);
      setIsBreedModalOpen(false);
      setBreedFormData({ name: "", description: "" });
      dismissToast(toastId);
      showToast.success("Breed created successfully");
    } catch (error) {
      dismissToast();
      showToast.error(
        error.response?.data?.message || "Failed to create breed"
      );
    }
  };

  const handleBreedEdit = (breed) => {
    setEditingBreed(breed);
    setUpdateBreedFormData({
      name: breed.name,
      description: breed.description,
      status: breed.status,
    });
  };

  const handleBreedUpdate = async (e) => {
    e.preventDefault();
    try {
      const toastId = showToast.loading("Updating breed...");
      await axios.put(`/api/dogBreeds/${editingBreed.id}`, updateBreedFormData);
      const updatedBreeds = dogBreeds.map((breed) =>
        breed.id === editingBreed.id
          ? { ...breed, ...updateBreedFormData }
          : breed
      );
      setDogBreeds(updatedBreeds);
      setEditingBreed(null);
      dismissToast(toastId);
      showToast.success("Breed updated successfully");
    } catch (error) {
      dismissToast();
      showToast.error(
        error.response?.data?.message || "Failed to update breed"
      );
    }
  };

  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await axios.get("/api/dogBreeds");
        setDogBreeds(response.data);
      } catch (error) {
        console.error("Error fetching dog breeds:", error);
      }
    };

    fetchDogBreeds();
  }, []);

  const handleBreedChangePage = (event, newPage) => {
    setBreedPage(newPage);
  };

  const handleBreedChangeRowsPerPage = (event) => {
    setBreedRowsPerPage(parseInt(event.target.value, 10));
    setBreedPage(0);
  };

  const handleBreedSort = (property) => {
    const isAsc = breedOrderBy === property && breedOrder === "asc";
    setBreedOrder(isAsc ? "desc" : "asc");
    setBreedOrderBy(property);
  };

  const filteredBreeds = React.useMemo(() => {
    const filtered = dogBreeds.filter((breed) =>
      breed.name.toLowerCase().includes(breedSearchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      // if (breedOrderBy === "dogNames") {
      //   return breedOrder === "asc"
      //     ? (a.dogNames || []).length - (b.dogNames || []).length
      //     : (b.dogNames || []).length - (a.dogNames || []).length;
      // }

      if (breedOrderBy === "createdTime") {
        const dateA = new Date(a.createdTime);
        const dateB = new Date(b.createdTime);
        return breedOrder === "asc" ? dateA - dateB : dateB - dateA;
      }

      return breedOrder === "asc"
        ? a[breedOrderBy]?.toString().localeCompare(b[breedOrderBy]?.toString())
        : b[breedOrderBy]
            ?.toString()
            .localeCompare(a[breedOrderBy]?.toString());
    });
  }, [dogBreeds, breedSearchTerm, breedOrder, breedOrderBy]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedDogs = React.useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === "registrationTime") {
        const [datePartA] = a[orderBy].split(" ");
        const [dayA, monthA, yearA] = datePartA.split("/");
        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);

        const [datePartB] = b[orderBy].split(" ");
        const [dayB, monthB, yearB] = datePartB.split("/");
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    };

    return [...dogs]
      .filter((dog) =>
        Object.values(dog).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort(comparator);
  }, [dogs, order, orderBy, searchTerm]);

  useEffect(() => {
    const fetchDogs = async () => {
      setLoading(true);
      const startTime = Date.now();
      try {
        const response = await axios.get("/api/dogs");
        setDogs(response.data);

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

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

  const getBreedNameById = (breedId) => {
    const breed = dogBreeds.find((breed) => breed.id === breedId);
    return breed ? breed.name : "Unknown Breed";
  };

  if (error) return <p>{error}</p>;

  return (
    <>
      <Head />
      <body>
        <div className="pattern-background" />
        <div class="wrapper">
          <Sidebar />
          <div class="main-panel ps-container ps-theme-default">
            <Navbar />
            <div class="content">
              <div class="container-fluid">
                <div class="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">pets</i>
                        </div>
                        <h4 className="card-title">Dog management</h4>
                        <p class="card-category text-muted">
                          Create new dogs, view and manage their details.
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
                                placeholder="Search by name..."
                              />
                              <button className="btn btn-info">
                                <i className="material-icons">add</i> Create Dog
                              </button>
                            </div>
                            <CustomTable
                              columns={[
                                { key: "name", label: "Name" },
                                { key: "dateOfBirth", label: "Date of Birth" },
                                {
                                  key: "gender",
                                  label: "Gender",
                                  render: (value) =>
                                    value === 0 ? "Male" : "Female",
                                },
                                { key: "dogBreedName", label: "Breed" },
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
                                  key: "registrationTime",
                                  label: "Registration Date",
                                  render: (value) => formatDate(value),
                                },
                              ]}
                              data={sortedDogs}
                              page={page}
                              rowsPerPage={rowsPerPage}
                              orderBy={orderBy}
                              order={order}
                              onSort={handleSort}
                              renderActions={(row) => (
                                <>
                                  <Link
                                    to={`/staff/dogs/details/${row.id}`}
                                    className="btn btn-info btn-sm"
                                    style={{ marginLeft: "8px" }}
                                  >
                                    <i className="material-icons">more_vert</i>
                                  </Link>
                                </>
                              )}
                            />
                            <CustomPagination
                              count={sortedDogs.length}
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
                      <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">pets</i>
                        </div>
                        <h4 className="card-title">Dog breed management</h4>
                        <p class="card-category text-muted">
                          Insert new dog breeds, view and edit existing ones.
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
                            }}
                          >
                            <CustomSearch
                              value={breedSearchTerm}
                              onChange={setBreedSearchTerm}
                              setPage={setBreedPage}
                              placeholder="Search breeds..."
                            />
                            <button
                              className="btn btn-info"
                              onClick={() => setIsBreedModalOpen(true)}
                            >
                              <i className="material-icons">add</i> Add Breed
                            </button>
                          </div>
                          <CustomTable
                            columns={[
                              { key: "name", label: "Name" },
                              {
                                key: "dogNames",
                                label: "Dogs Count",
                                render: (value) => (value ? value.length : 0),
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
                            data={filteredBreeds}
                            page={breedPage}
                            rowsPerPage={breedRowsPerPage}
                            orderBy={breedOrderBy}
                            order={breedOrder}
                            onSort={handleBreedSort}
                            renderActions={(row) => (
                              <button
                                type="button"
                                className="btn btn-info btn-sm"
                                title="Edit"
                                onClick={() => handleBreedEdit(row)}
                              >
                                <i className="material-icons">edit</i>
                              </button>
                            )}
                          />
                          <CustomPagination
                            count={filteredBreeds.length}
                            rowsPerPage={breedRowsPerPage}
                            page={breedPage}
                            onPageChange={handleBreedChangePage}
                            onRowsPerPageChange={handleBreedChangeRowsPerPage}
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
        {isBreedModalOpen && (
          <Dialog
            open={isBreedModalOpen}
            onClose={() => setIsBreedModalOpen(false)}
          >
            <DialogTitle>Add New Breed</DialogTitle>
            <DialogContent>
              <div style={{ minWidth: "400px", marginTop: "20px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="bmd-label-floating">Name</label>
                  <TextField
                    fullWidth
                    value={breedFormData.name}
                    onChange={(e) =>
                      setBreedFormData({
                        ...breedFormData,
                        name: e.target.value,
                      })
                    }
                    margin="normal"
                  />
                </div>
                <div>
                  <label className="bmd-label-floating">Description</label>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={breedFormData.description}
                    onChange={(e) =>
                      setBreedFormData({
                        ...breedFormData,
                        description: e.target.value,
                      })
                    }
                    margin="normal"
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <button
                className="btn btn-secondary"
                onClick={() => setIsBreedModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleBreedSubmit}
                disabled={!breedFormData.name || !breedFormData.description}
              >
                Create
              </button>
            </DialogActions>
          </Dialog>
        )}

        {editingBreed && (
          <Dialog
            open={Boolean(editingBreed)}
            onClose={() => setEditingBreed(null)}
          >
            <DialogTitle>Update Breed</DialogTitle>
            <DialogContent>
              <div style={{ minWidth: "400px", marginTop: "20px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="bmd-label-floating">Name</label>
                  <TextField
                    fullWidth
                    value={updateBreedFormData.name}
                    onChange={(e) =>
                      setUpdateBreedFormData({
                        ...updateBreedFormData,
                        name: e.target.value,
                      })
                    }
                    margin="normal"
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label className="bmd-label-floating">Description</label>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={updateBreedFormData.description}
                    onChange={(e) =>
                      setUpdateBreedFormData({
                        ...updateBreedFormData,
                        description: e.target.value,
                      })
                    }
                    margin="normal"
                  />
                </div>
                <div>
                  <label className="bmd-label-floating">Status</label>
                  <FormControl fullWidth margin="normal">
                    <Select
                      value={updateBreedFormData.status}
                      onChange={(e) =>
                        setUpdateBreedFormData({
                          ...updateBreedFormData,
                          status: Number(e.target.value),
                        })
                      }
                    >
                      <MenuItem value={1}>Active</MenuItem>
                      <MenuItem value={0}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <button
                className="btn btn-secondary"
                onClick={() => setEditingBreed(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleBreedUpdate}
                disabled={
                  !updateBreedFormData.name || !updateBreedFormData.description
                }
              >
                Update
              </button>
            </DialogActions>
          </Dialog>
        )}
      </body>
    </>
  );
};

export default StaffDogs;
