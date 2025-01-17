import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import "../assets/css/material-dashboard.min.css";

const DogTable = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    breed: "",
    dateOfBirth: "",
    gender: "",
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
    gender: "",
    status: "",
    customerProfileId: "",
    dogBreedId: "",
  });

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
      setDogs([...dogs, response.data]); // Update the dog list with the new dog
      setFormData({
        name: "",
        imageUrl: "",
        breed: "",
        dateOfBirth: "",
        gender: "",
        customerProfileId: "",
        dogBreedId: "",
      });
      // Reload the page after successful creation
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
      gender: dog.gender.toString(),
      status: dog.status.toString(),
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
      breed: "",
      dateOfBirth: "",
      gender: "",
      status: "",
      customerProfileId: "",
      dogBreedId: "",
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2>Dog List</h2>
      <div className="table-responsive">
        <table className="table">
          <thead className="text-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Breed</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dogs.map((dog) => (
              <tr key={dog.id}>
                <td>{dog.id}</td>
                <td>{dog.name}</td>
                <td>{dog.breed}</td>
                <td>{dog.gender === 1 ? "Male" : "Female"}</td>
                <td>{dog.dateOfBirth}</td>
                <td>
                  {dog.status === 1 ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">Inactive</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEdit(dog)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(dog.id)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                      name="breed"
                      className="form-control mt-2"
                      value={updateFormData.breed}
                      onChange={handleUpdateChange}
                      required
                    >
                      <option value="">Select Breed</option>
                      <option value="British">British</option>
                      <option value="Labrador">Labrador</option>
                      <option value="German Shepherd">German Shepherd</option>
                      <option value="Golden Retriever">Golden Retriever</option>
                      <option value="Bulldog">Bulldog</option>
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Date of Birth</label>
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
                    <label className="form-label">Customer Profile ID</label>
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

      <h2>Create Dog</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Breed</label>
          <select
            name="breed"
            className="form-control mt-2"
            value={formData.breed}
            onChange={handleChange}
            required
          >
            <option value="">Select Breed</option>
            <option value="British">British</option>
            <option value="Labrador">Labrador</option>
            <option value="German Shepherd">German Shepherd</option>
            <option value="Golden Retriever">Golden Retriever</option>
            <option value="Bulldog">Bulldog</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            className="form-control"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Gender</label>
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
        </div>
        <div className="form-group">
          <label>Customer Profile ID</label>
          <input
            type="text"
            name="customerProfileId"
            className="form-control"
            value={formData.customerProfileId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Dog Breed ID</label>
          <input
            type="text"
            name="dogBreedId"
            className="form-control"
            value={formData.dogBreedId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {responseMessage && <p className="text-success">{responseMessage}</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
  );
};

export default DogTable;
