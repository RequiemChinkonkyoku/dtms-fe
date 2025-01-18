import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

const DogBreedTable = () => {
  const [dogBreeds, setDogBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingDogBreed, setEditingDogBreed] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    description: "",
    status: "",
  });

  // Fetch dog breeds when the component mounts
  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await axios.get("/api/dogBreeds");
        setDogBreeds(response.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("/api/dogBreeds", formData);
      setResponseMessage("Dog breed created successfully!");
      setDogBreeds([...dogBreeds, response.data]);
      setFormData({
        name: "",
        description: "",
      });
      window.location.reload();
    } catch (error) {
      setErrorMessage("Failed to create the dog breed. " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this dog breed?")) {
      try {
        await axios.delete(`/api/dogBreeds/${id}`);
        window.location.reload();
      } catch (error) {
        setErrorMessage("Failed to deactivate the dog breed. " + error.message);
      }
    }
  };

  const handleEdit = (dogBreed) => {
    setEditingDogBreed(dogBreed);
    setUpdateFormData({
      name: dogBreed.name,
      description: dogBreed.description,
      status: dogBreed.status.toString(),
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
      await axios.put(`/api/dogBreeds/${editingDogBreed.id}`, updateFormData);
      setResponseMessage("Dog breed updated successfully!");
      setEditingDogBreed(null);
      window.location.reload();
    } catch (error) {
      setErrorMessage("Failed to update the dog breed. " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingDogBreed(null);
    setUpdateFormData({
      name: "",
      description: "",
      status: "",
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2>Dog Breed List</h2>
      <div className="table-responsive">
        <table className="table">
          <thead className="text-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created Time</th>
              <th>Last Updated Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dogBreeds.map((breed) => (
              <tr key={breed.id}>
                <td>{breed.id}</td>
                <td>{breed.name}</td>
                <td>{breed.description}</td>
                <td>
                  {breed.status === 1 ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">Inactive</span>
                  )}
                </td>
                <td>{new Date(breed.createdTime).toLocaleDateString()}</td>
                <td>{new Date(breed.lastUpdatedTime).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEdit(breed)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(breed.id)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingDogBreed && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Dog Breed</h5>
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
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={updateFormData.description}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-control"
                      value={updateFormData.status}
                      onChange={handleUpdateChange}
                      required
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
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

      <h2>Create Dog Breed</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
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
        <div className="form-group mb-3">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
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

export default DogBreedTable;
