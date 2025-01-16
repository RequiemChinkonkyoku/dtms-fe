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
    } catch (error) {
      setErrorMessage("Failed to create the dog. " + error.message);
    }
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dogs.map((dog) => (
              <tr key={dog.id}>
                <td>{dog.id}</td>
                <td>{dog.name}</td>
                <td>{dog.breed}</td>
                <td>{dog.gender}</td>
                <td>{dog.dateOfBirth}</td>
                <td>
                  {/* Add additional actions for each dog here */}
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            className="form-control"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Breed</label>
          <input
            type="text"
            name="breed"
            className="form-control"
            value={formData.breed}
            onChange={handleChange}
            required
          />
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
        <div className="form-group">
          <label>Gender</label>
          <input
            type="text"
            name="gender"
            className="form-control"
            value={formData.gender}
            onChange={handleChange}
            required
          />
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
