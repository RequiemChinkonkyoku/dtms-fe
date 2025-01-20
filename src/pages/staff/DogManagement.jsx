import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import Loader from "../../assets/components/common/Loader";
import Head from "../../assets/components/common/Head";
import Sidebar from "../../assets/components/staff/Sidebar";
import Navbar from "../../assets/components/staff/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DogManagement = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch dogs when the component mounts
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await axios.get("/api/dogs");
        setDogs(response.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  // Add useEffect to fetch dog breeds
  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await axios.get("/api/dogBreeds");
        setDogBreeds(response.data);
      } catch (err) {
        console.error("Failed to fetch dog breeds:", err);
      }
    };

    fetchDogBreeds();
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
      // Update formData with the new imageUrl
      setFormData((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error appropriately
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this dog?")) {
      try {
        await axios.delete(`/api/dogs/${id}`);
        // Refresh the page to show updated status
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

  // Add a helper function to get breed name by id
  const getBreedNameById = (breedId) => {
    const breed = dogBreeds.find((breed) => breed.id === breedId);
    return breed ? breed.name : "Unknown Breed";
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Head />
      <body>
        <div class="wrapper">
          <Sidebar />
          <div class="main-panel ps-container ps-theme-default">
            <Navbar />
            <div class="content">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-12">
                    <div class="card">
                      <div class="card-header card-header-warning card-header-icon">
                        <div class="card-icon">
                          <i class="material-icons">pets</i>
                        </div>
                        <h4 class="card-title">Dog List</h4>
                      </div>
                      <div class="card-body">
                        <div class="table-responsive">
                          <table class="table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Breed</th>
                                <th>Gender</th>
                                <th>Date of Birth</th>
                                <th class="text-center">Status</th>
                                <th class="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dogs.map((dog) => (
                                <tr key={dog.id}>
                                  <td>{dog.id}</td>
                                  <td>{dog.name}</td>
                                  <td>{getBreedNameById(dog.dogBreedId)}</td>
                                  <td>
                                    {dog.gender === 1 ? "Male" : "Female"}
                                  </td>
                                  <td>{dog.dateOfBirth}</td>
                                  <td class="text-center">
                                    {dog.status === 1 ? (
                                      <span className="badge bg-success">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="badge bg-danger">
                                        Inactive
                                      </span>
                                    )}
                                  </td>
                                  <td class="td-actions text-right">
                                    <button
                                      type="button"
                                      rel="tooltip"
                                      class="btn btn-success"
                                      data-original-title=""
                                      title=""
                                      onClick={() => handleEdit(dog)}
                                    >
                                      <i class="material-icons">edit</i>
                                    </button>
                                    <button
                                      type="button"
                                      rel="tooltip"
                                      class="btn btn-danger"
                                      data-original-title=""
                                      title=""
                                      onClick={() => handleDelete(dog.id)}
                                    >
                                      <i class="material-icons">close</i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {editingDog && (
                  <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Update Dog</h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={handleCancelEdit}
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={handleUpdate}>
                            <div className="form-group mb-3">
                              <label className="form-label">Name</label>
                              <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={updateFormData.name}
                                onChange={handleUpdateChange}
                                required
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label className="form-label">Breed</label>
                              <select
                                name="dogBreedId"
                                className="form-control"
                                value={updateFormData.dogBreedId}
                                onChange={handleUpdateChange}
                                required
                              >
                                <option value="">Select Breed</option>
                                {dogBreeds.map((breed) => (
                                  <option key={breed.id} value={breed.id}>
                                    {breed.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group mb-3">
                              <label className="form-label">
                                Date of Birth
                              </label>
                              <input
                                type="date"
                                name="dateOfBirth"
                                className="form-control"
                                value={updateFormData.dateOfBirth}
                                onChange={handleUpdateChange}
                                required
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label className="form-label">Gender</label>
                              <select
                                name="gender"
                                className="form-control mt-2"
                                value={updateFormData.gender}
                                onChange={handleUpdateChange}
                                required
                              >
                                <option value="">Select Gender</option>
                                <option value="0">Female</option>
                                <option value="1">Male</option>
                              </select>
                            </div>
                            <div className="form-group mb-3">
                              <label className="form-label">Status</label>
                              <select
                                name="status"
                                className="form-control mt-2"
                                value={updateFormData.status}
                                onChange={handleUpdateChange}
                                required
                              >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                              </select>
                            </div>
                            <div className="form-group mb-3">
                              <label className="form-label">
                                Customer Profile ID
                              </label>
                              <input
                                type="text"
                                name="customerProfileId"
                                className="form-control"
                                value={updateFormData.customerProfileId}
                                onChange={handleUpdateChange}
                                required
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label className="form-label">Dog Breed ID</label>
                              <input
                                type="text"
                                name="dogBreedId"
                                className="form-control"
                                value={updateFormData.dogBreedId}
                                onChange={handleUpdateChange}
                                required
                              />
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                              <button type="submit" className="btn btn-primary">
                                Update
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div class="row">
                  <div class="col-md-12">
                    <form
                      id="TypeValidation"
                      class="form-horizontal"
                      action=""
                      method=""
                      novalidate="novalidate"
                      onSubmit={handleSubmit}
                    >
                      <div class="card ">
                        <div class="card-header card-header-warning card-header-text">
                          <div class="card-text">
                            <h4 class="card-title">Create new dog</h4>
                          </div>
                        </div>
                        <div class="card-body ">
                          <div class="row">
                            <label class="col-sm-2 col-form-label">Name</label>
                            <div class="col-sm-7">
                              <div class="form-group bmd-form-group is-filled has-success">
                                <input
                                  class="form-control valid"
                                  type="text"
                                  name="name"
                                  aria-required="true"
                                  aria-invalid="false"
                                  value={formData.name}
                                  onChange={handleChange}
                                  required
                                />
                                <label
                                  id="required-error"
                                  class="error"
                                  for="required"
                                ></label>
                              </div>
                            </div>
                            <label class="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              Breed
                            </label>
                            <div className="col-sm-7">
                              <div className="form-group bmd-form-group is-filled has-success">
                                <select
                                  className="form-control valid"
                                  name="dogBreedId"
                                  value={formData.dogBreedId}
                                  onChange={handleChange}
                                  required
                                  style={{
                                    marginTop: "8px",
                                    marginBottom: "8px",
                                  }}
                                >
                                  <option value="">Select Breed</option>
                                  {dogBreeds.map((breed) => (
                                    <option key={breed.id} value={breed.id}>
                                      {breed.name}
                                    </option>
                                  ))}
                                </select>
                                <label
                                  id="required-error"
                                  className="error"
                                  htmlFor="required"
                                ></label>
                              </div>
                            </div>
                            <label className="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              Date of Birth
                            </label>
                            <div className="col-sm-7">
                              <div className="form-group bmd-form-group is-filled">
                                <DatePicker
                                  selected={
                                    formData.dateOfBirth
                                      ? new Date(formData.dateOfBirth)
                                      : null
                                  }
                                  onChange={(date) => {
                                    setFormData({
                                      ...formData,
                                      dateOfBirth: date
                                        ? date.toISOString().split("T")[0]
                                        : "",
                                    });
                                  }}
                                  className="form-control"
                                  dateFormat="dd/MM/yyyy"
                                  placeholderText="Select date"
                                  maxDate={new Date()} // Prevents future dates
                                  showYearDropdown
                                  scrollableYearDropdown
                                  yearDropdownItemNumber={100}
                                />
                              </div>
                            </div>
                            <label className="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
                          </div>
                          <div class="row">
                            <label class="col-sm-2 col-form-label">
                              Gender
                            </label>
                            <div class="col-sm-7">
                              <div class="form-group bmd-form-group is-filled has-success">
                                <select
                                  name="gender"
                                  className="form-control mt-2"
                                  value={formData.gender}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="">Select Gender</option>
                                  <option value="0">Female</option>
                                  <option value="1">Male</option>
                                </select>
                                <label
                                  id="required-error"
                                  class="error"
                                  for="required"
                                ></label>
                              </div>
                            </div>
                            <label class="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
                          </div>
                          <div class="row">
                            <label class="col-sm-2 col-form-label">Image</label>
                            <div class="col-sm-7">
                              <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleFileUpload}
                              />
                              <label
                                id="required-error"
                                class="error"
                                for="required"
                              ></label>
                            </div>
                            <label class="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
                          </div>
                          <div class="row">
                            <label class="col-sm-2 col-form-label">
                              Customer Profile ID
                            </label>
                            <div class="col-sm-7">
                              <div class="form-group bmd-form-group is-filled has-success">
                                <input
                                  class="form-control valid"
                                  type="text"
                                  name="customerProfileId"
                                  aria-required="true"
                                  aria-invalid="false"
                                  value={formData.customerProfileId}
                                  onChange={handleChange}
                                  required
                                />
                                <label
                                  id="required-error"
                                  class="error"
                                  for="required"
                                ></label>
                              </div>
                            </div>
                            <label class="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
                          </div>
                        </div>
                        <div class="card-footer ml-auto mr-auto">
                          <button type="submit" class="btn btn-warning">
                            Submit<div class="ripple-container"></div>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {responseMessage && (
                  <p className="text-success">{responseMessage}</p>
                )}
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default DogManagement;
