import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useParams } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

import { showToast, dismissToast } from "../../utils/toastConfig";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TablePagination,
  Button,
} from "@mui/material";

const TrainerLessonsDetails = () => {
  const { id } = useParams();
  const { loading, setLoading } = useLoading();
  const [lesson, setLesson] = useState(null);
  const [skill, setSkill] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    lessonTitle: "",
    description: "",
    note: "",
    environment: "",
    duration: 0,
    objective: "",
    skillId: "",
    status: 1,
    lessonEquipmentDTOs: [],
  });
  const [openSkillModal, setOpenSkillModal] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [skillPage, setSkillPage] = useState(0);
  const [skillRowsPerPage, setSkillRowsPerPage] = useState(5);
  const [expandedSkill, setExpandedSkill] = useState(null);
  const [skills, setSkills] = useState([]);
  const [openEquipmentModal, setOpenEquipmentModal] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState("");
  const [equipmentPage, setEquipmentPage] = useState(0);
  const [equipmentRowsPerPage, setEquipmentRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/lessons/${id}`);
        if (response.data.success) {
          setLesson(response.data.object);

          const skillResponse = await axios.get(
            `/api/skills/${response.data.object.skillId}`
          );
          if (skillResponse.data.success) {
            setSkill(skillResponse.data.object);
          }
        }
      } catch (error) {
        console.error("Error fetching lesson details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetails();
  }, [id]);

  useEffect(() => {
    if (lesson) {
      setUpdateFormData({
        id: lesson.id,
        lessonTitle: lesson.lessonTitle,
        description: lesson.description,
        note: lesson.notes,
        environment: lesson.environment,
        duration: lesson.duration,
        objective: lesson.objective,
        skillId: lesson.skillId,
        status: lesson.status,
        lessonEquipmentDTOs:
          lesson.lessonEquipments?.map((eq) => ({
            equipmentId: eq.equipmentId,
            quantity: eq.quantity,
          })) || [],
      });
    }
  }, [lesson]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("/api/skills");
        if (response.data.success && response.data.objectList) {
          setSkills(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await axios.get("/api/equipments");
        if (response.data.success && response.data.objectList) {
          setEquipmentList(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching equipments:", error);
      }
    };
    fetchEquipments();
  }, []);

  const handleEquipmentSelection = (equipmentId) => {
    setUpdateFormData((prev) => ({
      ...prev,
      lessonEquipmentDTOs: prev.lessonEquipmentDTOs.some(
        (dto) => dto.equipmentId === equipmentId
      )
        ? prev.lessonEquipmentDTOs.filter(
            (dto) => dto.equipmentId !== equipmentId
          )
        : [...prev.lessonEquipmentDTOs, { equipmentId, quantity: 1 }],
    }));
  };

  const handleQuantityChange = (equipmentId, quantity) => {
    setUpdateFormData((prev) => ({
      ...prev,
      lessonEquipmentDTOs: prev.lessonEquipmentDTOs.map((dto) =>
        dto.equipmentId === equipmentId ? { ...dto, quantity } : dto
      ),
    }));
  };

  const handleSelectAllEquipments = (allSelected) => {
    setUpdateFormData((prev) => ({
      ...prev,
      lessonEquipmentDTOs: allSelected
        ? []
        : equipmentList.map((eq) => ({ equipmentId: eq.id, quantity: 1 })),
    }));
  };

  const handleUpdate = async () => {
    try {
      const toastId = showToast.loading("Updating lesson...");
      const response = await axios.put(`/api/lessons`, updateFormData);

      if (response.data.success) {
        dismissToast(toastId);
        showToast.success("Lesson updated successfully");
        setIsUpdateModalOpen(false);

        // Reload the page data
        const lessonResponse = await axios.get(`/api/lessons/${id}`);
        if (lessonResponse.data.success) {
          setLesson(lessonResponse.data.object);
          const skillResponse = await axios.get(
            `/api/skills/${lessonResponse.data.object.skillId}`
          );
          if (skillResponse.data.success) {
            setSkill(skillResponse.data.object);
          }
        }
      } else {
        dismissToast(toastId);
        showToast.error(response.data.message || "Failed to update lesson");
      }
    } catch (error) {
      dismissToast();
      showToast.error(
        error.response?.data?.message || "Failed to update lesson"
      );
      console.error("Error updating lesson:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
                  lesson && (
                    <div className="row">
                      <div className="col-md-9">
                        <div className="card mb-3">
                          <div className="card-header card-header-warning">
                            <h4 className="card-title">Lesson Title</h4>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label>Lesson Title</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={lesson.lessonTitle}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header card-header-warning">
                            <h4 className="card-title">Lesson Details</h4>
                          </div>
                          <div className="card-body">
                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                className="form-control"
                                rows="3"
                                value={lesson.description}
                                disabled
                              ></textarea>
                            </div>
                            <div className="form-group">
                              <label>Note</label>
                              <textarea
                                className="form-control"
                                rows="3"
                                value={lesson.notes}
                                disabled
                              ></textarea>
                            </div>
                            <div className="row mt-4">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label>Environment</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={lesson.environment}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-4">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label>Duration (slots)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={lesson.duration}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-4">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label>Objective</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={lesson.objective}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="card mb-3">
                          <div className="card-header card-header-info">
                            <h4 className="card-title">Skill</h4>
                          </div>
                          <div className="card-body">
                            <p>
                              <strong>{skill?.name || "Loading..."}</strong>
                            </p>
                            <p className="text-muted">{skill?.description}</p>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header card-header-info">
                            <h4 className="card-title">Equipment List</h4>
                          </div>
                          <div className="card-body">
                            {lesson.lessonEquipments?.map((equipment) => (
                              <div key={equipment.id} className="mb-2">
                                <strong>{equipment.equipmentName}</strong>
                                <span className="ml-2">
                                  ({equipment.quantity} units)
                                </span>
                              </div>
                            ))}
                            {(!lesson.lessonEquipments ||
                              lesson.lessonEquipments.length === 0) && (
                              <p className="text-muted">
                                No equipment required
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          className="btn btn-warning btn-block"
                          onClick={() => setIsUpdateModalOpen(true)}
                        >
                          Update Lesson
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </body>
      <Dialog
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Update Lesson</DialogTitle>
        <DialogContent>
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="form-group">
                <label>Lesson Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="lessonTitle"
                  value={updateFormData.lessonTitle}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="description"
                  value={updateFormData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <div className="form-group">
                <label>Note</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="note"
                  value={updateFormData.note}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label>Environment</label>
                <input
                  type="text"
                  className="form-control"
                  name="environment"
                  value={updateFormData.environment}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Duration (slots)</label>
                <input
                  type="number"
                  className="form-control"
                  name="duration"
                  value={updateFormData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <div className="form-group">
                <label>Objective</label>
                <input
                  type="text"
                  className="form-control"
                  name="objective"
                  value={updateFormData.objective}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <button
                className="btn btn-info btn-block"
                onClick={() => setOpenSkillModal(true)}
              >
                Select Skill
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-info btn-block"
                onClick={() => setOpenEquipmentModal(true)}
              >
                Select Equipment
              </button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-secondary"
            onClick={() => setIsUpdateModalOpen(false)}
          >
            Cancel
          </button>
          <button className="btn btn-warning" onClick={handleUpdate}>
            Update
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSkillModal}
        onClose={() => setOpenSkillModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Skill</DialogTitle>
        <DialogContent>
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
              <TextField
                label="Search skill..."
                variant="outlined"
                size="small"
                value={skillSearchTerm}
                onChange={(e) => setSkillSearchTerm(e.target.value)}
              />
            </div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills
                  .filter((skill) =>
                    skill.name
                      .toLowerCase()
                      .includes(skillSearchTerm.toLowerCase())
                  )
                  .slice(
                    skillPage * skillRowsPerPage,
                    skillPage * skillRowsPerPage + skillRowsPerPage
                  )
                  .map((skill) => (
                    <React.Fragment key={skill.id}>
                      <tr>
                        <td>{skill.name}</td>
                        <td className="td-actions text-right">
                          <button
                            type="button"
                            className="btn btn-info btn-sm mr-2"
                            onClick={() =>
                              setExpandedSkill(
                                expandedSkill === skill.id ? null : skill.id
                              )
                            }
                          >
                            <i className="material-icons">
                              {expandedSkill === skill.id
                                ? "keyboard_arrow_up"
                                : "keyboard_arrow_down"}
                            </i>
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              updateFormData.skillId === skill.id
                                ? "btn-success"
                                : "btn-info"
                            }`}
                            onClick={() => {
                              setUpdateFormData((prev) => ({
                                ...prev,
                                skillId: skill.id,
                              }));
                            }}
                          >
                            <i className="material-icons">
                              {updateFormData.skillId === skill.id
                                ? "check"
                                : "add"}
                            </i>
                          </button>
                        </td>
                      </tr>
                      {expandedSkill === skill.id && (
                        <tr>
                          <td
                            colSpan="2"
                            style={{ backgroundColor: "#f9f9f9" }}
                          >
                            <div style={{ padding: "10px" }}>
                              <strong>Description:</strong> {skill.description}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={skills.length}
              rowsPerPage={skillRowsPerPage}
              page={skillPage}
              onPageChange={(event, newPage) => setSkillPage(newPage)}
              onRowsPerPageChange={(event) => {
                setSkillRowsPerPage(parseInt(event.target.value, 10));
                setSkillPage(0);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenSkillModal(false)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEquipmentModal}
        onClose={() => setOpenEquipmentModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Equipment</DialogTitle>
        <DialogContent>
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
              <TextField
                label="Search equipment..."
                variant="outlined"
                size="small"
                value={equipmentSearchTerm}
                onChange={(e) => setEquipmentSearchTerm(e.target.value)}
              />
            </div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        equipmentList.length > 0 &&
                        equipmentList.every((eq) =>
                          updateFormData.lessonEquipmentDTOs.some(
                            (dto) => dto.equipmentId === eq.id
                          )
                        )
                      }
                      onChange={() =>
                        handleSelectAllEquipments(
                          equipmentList.length > 0 &&
                            equipmentList.every((eq) =>
                              updateFormData.lessonEquipmentDTOs.some(
                                (dto) => dto.equipmentId === eq.id
                              )
                            )
                        )
                      }
                    />
                  </th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipmentList
                  .filter((equipment) =>
                    equipment.name
                      .toLowerCase()
                      .includes(equipmentSearchTerm.toLowerCase())
                  )
                  .slice(
                    equipmentPage * equipmentRowsPerPage,
                    equipmentPage * equipmentRowsPerPage + equipmentRowsPerPage
                  )
                  .map((equipment) => {
                    const isSelected = updateFormData.lessonEquipmentDTOs.some(
                      (dto) => dto.equipmentId === equipment.id
                    );
                    const selectedEquipment =
                      updateFormData.lessonEquipmentDTOs.find(
                        (dto) => dto.equipmentId === equipment.id
                      );
                    return (
                      <tr key={equipment.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleEquipmentSelection(equipment.id)
                            }
                          />
                        </td>
                        <td>{equipment.name}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={selectedEquipment?.quantity || 0}
                            onChange={(e) =>
                              handleQuantityChange(
                                equipment.id,
                                parseInt(e.target.value, 10)
                              )
                            }
                            disabled={!isSelected}
                            min="0"
                            style={{ width: "80px" }}
                          />
                        </td>
                        <td className="td-actions text-right">
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              isSelected ? "btn-danger" : "btn-info"
                            }`}
                            onClick={() =>
                              handleEquipmentSelection(equipment.id)
                            }
                          >
                            <i className="material-icons">
                              {isSelected ? "remove" : "add"}
                            </i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={equipmentList.length}
              rowsPerPage={equipmentRowsPerPage}
              page={equipmentPage}
              onPageChange={(event, newPage) => setEquipmentPage(newPage)}
              onRowsPerPageChange={(event) => {
                setEquipmentRowsPerPage(parseInt(event.target.value, 10));
                setEquipmentPage(0);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenEquipmentModal(false)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TrainerLessonsDetails;
