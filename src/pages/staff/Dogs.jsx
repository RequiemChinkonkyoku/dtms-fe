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

import "react-datepicker/dist/react-datepicker.css";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Collapse,
  Box,
  Typography,
  TextField,
  TableSortLabel,
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
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    dateOfBirth: "",
    gender: 0,
    customerProfileId: "",
    dogBreedId: "",
  });
  const [imgUrl, setImgUrl] = useState("");
  const [editingDog, setEditingDog] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    imageUrl: "",
    breed: "",
    dateOfBirth: "",
    gender: 0,
    status: 1,
    customerProfileId: "",
    dogBreedId: "",
  });
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
  const [openRows, setOpenRows] = useState({});
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
      const response = await axios.post("/api/dogBreeds", breedFormData);
      setDogBreeds([...dogBreeds, response.data]);
      setIsBreedModalOpen(false);
      setBreedFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Error creating breed:", error);
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
      await axios.put(`/api/dogBreeds/${editingBreed.id}`, updateBreedFormData);
      const updatedBreeds = dogBreeds.map((breed) =>
        breed.id === editingBreed.id
          ? { ...breed, ...updateBreedFormData }
          : breed
      );
      setDogBreeds(updatedBreeds);
      setEditingBreed(null);
    } catch (error) {
      console.error("Error updating breed:", error);
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
      if (breedOrderBy === "dogNames") {
        return breedOrder === "asc"
          ? a.dogNames.length - b.dogNames.length
          : b.dogNames.length - a.dogNames.length;
      }

      if (breedOrderBy === "createdTime") {
        const [datePartA] = a[breedOrderBy].split(" ");
        const [dayA, monthA, yearA] = datePartA.split("/");
        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);

        const [datePartB] = b[breedOrderBy].split(" ");
        const [dayB, monthB, yearB] = datePartB.split("/");
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

        return breedOrder === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (breedOrder === "asc") {
        return a[breedOrderBy] < b[breedOrderBy] ? -1 : 1;
      } else {
        return b[breedOrderBy] < a[breedOrderBy] ? -1 : 1;
      }
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
    if (!dateString) return "";
    const [datePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/");
    return new Date(`${year}-${month}-${day}`).toLocaleDateString();
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleRowClick = (id) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log("name", name);
    console.log("value", value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("/api/dogs", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResponseMessage("Dog created successfully!");
      setDogs([...dogs, response.data]);
      setFormData({
        name: "",
        imageUrl: "",
        dateOfBirth: "",
        gender: 0,
        customerProfileId: "",
        dogBreedId: "",
      });
      window.location.reload();
    } catch (error) {
      setErrorMessage("Failed to create the dog. " + error.message);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://localhost:7256/api/uploadFile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const imageUrl = await response.text();
      setImgUrl(imageUrl);
      setFormData((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this dog?")) {
      try {
        await axios.delete(`/api/dogs/${id}`);
        window.location.reload();
      } catch (error) {
        setErrorMessage("Failed to deactivate the dog. " + error.message);
      }
    }
  };

  const handleEdit = (dog) => {
    setEditingDog(dog);
    setUpdateFormData({
      name: dog.name,
      imageUrl: dog.imageUrl,
      breed: dog.breed,
      dateOfBirth: dog.dateOfBirth,
      gender: dog.gender,
      status: dog.status,
      customerProfileId: dog.customerProfileId,
      dogBreedId: dog.dogBreedId,
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/dogs/${editingDog.id}`, updateFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResponseMessage("Dog updated successfully!");
      setEditingDog(null);
      window.location.reload();
    } catch (error) {
      setErrorMessage("Failed to update the dog. " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingDog(null);
    setUpdateFormData({
      name: "",
      imageUrl: "",
      dateOfBirth: "",
      gender: "",
      status: "",
      customerProfileId: "",
      dogBreedId: "",
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
                        <h4 className="card-title">Dog Breeds</h4>
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
                                render: (value) => value.length,
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
