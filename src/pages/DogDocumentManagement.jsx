import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import "../assets/css/material-dashboard.min.css";

const DogDocumentTable = () => {
  const [dogDocuments, setDogDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    description: "",
    issuingAuthority: "",
    issueDate: "",
    dogId: "",
    dogDocumentTypeId: "",
  });
  const [imgUrl, setImgUrl] = useState("");
  const [editingDocument, setEditingDocument] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    imageUrl: "",
    description: "",
    status: "",
    issuingAuthority: "",
    issueDate: "",
    dogId: "",
    dogDocumentTypeId: "",
  });
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    const fetchDogDocuments = async () => {
      try {
        const response = await axios.get("/api/dogDocumentTypes");
        setDogDocuments(response.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDogDocuments();
  }, []);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await axios.get("/api/dogDocumentTypes");
        setDocumentTypes(response.data);
      } catch (err) {
        console.error("Failed to fetch document types:", err);
      }
    };

    fetchDocumentTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("/api/dogDocumentTypes", formData);
      setResponseMessage("Dog document created successfully!");
      setDogDocuments([...dogDocuments, response.data]);
      setFormData({
        name: "",
        imageUrl: "",
        description: "",
        issuingAuthority: "",
        issueDate: "",
        dogId: "",
        dogDocumentTypeId: "",
      });
      window.location.reload();
    } catch (error) {
      setErrorMessage("Failed to create the dog document. " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this document?")) {
      try {
        await axios.delete(`/api/dogDocumentTypes/${id}`);
        window.location.reload();
      } catch (error) {
        setErrorMessage("Failed to deactivate the document. " + error.message);
      }
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
    setUpdateFormData({
      name: document.name,
      imageUrl: document.imageUrl,
      description: document.description,
      status: document.status.toString(),
      issuingAuthority: document.issuingAuthority,
      issueDate: document.issueDate,
      dogId: document.dogId,
      dogDocumentTypeId: document.dogDocumentTypeId,
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
      await axios.put(
        `/api/dogDocumentTypes/${editingDocument.id}`,
        updateFormData
      );
      setResponseMessage("Dog document updated successfully!");
      setEditingDocument(null);
      window.location.reload();
    } catch (error) {
      setErrorMessage("Failed to update the document. " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingDocument(null);
    setUpdateFormData({
      name: "",
      imageUrl: "",
      description: "",
      status: "",
      issuingAuthority: "",
      issueDate: "",
      dogId: "",
      dogDocumentTypeId: "",
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2>Dog Documents List</h2>
      <div className="table-responsive">
        <table className="table">
          <thead className="text-primary">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Issuing Authority</th>
              <th>Issue Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dogDocuments.map((doc) => {
              console.log("Document date:", doc.issueDate);
              return (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>{doc.description}</td>
                  <td>{doc.issuingAuthority}</td>
                  <td>{doc.issueDate}</td>
                  <td>
                    {doc.status === 1 ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleEdit(doc)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingDocument && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Dog Document</h5>
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
                    <label className="form-label">Issuing Authority</label>
                    <input
                      type="text"
                      name="issuingAuthority"
                      className="form-control"
                      value={updateFormData.issuingAuthority}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Issue Date</label>
                    <input
                      type="date"
                      name="issueDate"
                      className="form-control"
                      value={updateFormData.issueDate}
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
                  <div className="form-group mb-3">
                    <label className="form-label">Dog ID</label>
                    <input
                      type="text"
                      name="dogId"
                      className="form-control"
                      value={updateFormData.dogId}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Document Type</label>
                    <select
                      name="dogDocumentTypeId"
                      className="form-control"
                      value={updateFormData.dogDocumentTypeId}
                      onChange={handleUpdateChange}
                      required
                    >
                      <option value="">Select Document Type</option>
                      {documentTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
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

      <h2>Create Dog Document</h2>
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
        <div className="mb-3">
          <label className="form-label">Document Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileUpload}
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
        <div className="form-group mb-3">
          <label>Issuing Authority</label>
          <input
            type="text"
            name="issuingAuthority"
            className="form-control"
            value={formData.issuingAuthority}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Issue Date</label>
          <input
            type="date"
            name="issueDate"
            className="form-control"
            value={formData.issueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Dog ID</label>
          <input
            type="text"
            name="dogId"
            className="form-control"
            value={formData.dogId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Document Type</label>
          <select
            name="dogDocumentTypeId"
            className="form-control"
            value={formData.dogDocumentTypeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Document Type</option>
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
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

export default DogDocumentTable;
