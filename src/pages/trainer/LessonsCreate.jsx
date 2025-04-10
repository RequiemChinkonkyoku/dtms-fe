import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

import { useLoading } from "../../contexts/LoadingContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";

const TrainerLessonsCreate = () => {
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState([]);
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    lessonTitle: "",
    description: "",
    note: "",
    environment: "",
    duration: "",
    objective: "",
    skillId: "",
    lessonEquipmentDTOs: [], // Changed from equipmentIds
  });
  const [openSkillModal, setOpenSkillModal] = useState(false);
  const [openEquipmentModal, setOpenEquipmentModal] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState("");
  const [skillPage, setSkillPage] = useState(0);
  const [skillRowsPerPage, setSkillRowsPerPage] = useState(5);
  const [equipmentPage, setEquipmentPage] = useState(0);
  const [equipmentRowsPerPage, setEquipmentRowsPerPage] = useState(5);
  const [expandedSkill, setExpandedSkill] = useState(null);

  const handleSkillSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleEquipmentSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "equipmentIds" ? [...value] : value, // Spread the value array
    }));
  };

  const handleEquipmentSelection = (equipmentId) => {
    setFormData((prev) => ({
      ...prev,
      lessonEquipmentDTOs: prev.lessonEquipmentDTOs.some(
        (dto) => dto.equipmentId === equipmentId
      )
        ? prev.lessonEquipmentDTOs.filter(
            (dto) => dto.equipmentId !== equipmentId
          )
        : [...prev.lessonEquipmentDTOs, { equipmentId, quantity: 1 }], // Changed default from 0 to 1
    }));
  };

  const handleQuantityChange = (equipmentId, quantity) => {
    setFormData((prev) => ({
      ...prev,
      lessonEquipmentDTOs: prev.lessonEquipmentDTOs.map((dto) =>
        dto.equipmentId === equipmentId ? { ...dto, quantity } : dto
      ),
    }));
  };

  // Update the "Select All" handler
  const handleSelectAllEquipments = (allSelected) => {
    setFormData((prev) => ({
      ...prev,
      lessonEquipmentDTOs: allSelected
        ? []
        : equipmentList.map((eq) => ({ equipmentId: eq.id, quantity: 1 })),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/lessons", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Lesson created successfully",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/trainer/lessons");
      });

      setFormData({
        lessonTitle: "",
        description: "",
        note: "",
        environment: "",
        duration: "",
        objective: "",
        skillId: "",
        lessonEquipmentDTOs: [],
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to create lesson: " + error.message,
      });
      console.error("Failed to create lesson. " + error.message);
    }
  };

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
                  <div class="col-md-9">
                    <form onSubmit={handleSubmit}>
                      <div class="card mb-3">
                        <div class="card-header card-header-warning">
                          <h4 class="card-title">Lesson Title</h4>
                          <p class="card-category">Enter the lesson title</p>
                        </div>
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label class="bmd-label-floating">
                                  Lesson Title
                                </label>
                                <input
                                  type="text"
                                  name="lessonTitle"
                                  class="form-control"
                                  value={formData.lessonTitle}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />
                      <div class="card">
                        <div class="card-header card-header-warning">
                          <h4 class="card-title">Lesson Details</h4>
                          <p class="card-category">
                            Enter additional information
                          </p>
                        </div>
                        <div class="card-body">
                          <div class="form-group">
                            <label>Description</label>
                            <textarea
                              name="description"
                              class="form-control"
                              rows="3"
                              value={formData.description}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                          <div class="form-group">
                            <label>Note</label>
                            <textarea
                              name="note"
                              class="form-control"
                              rows="3"
                              value={formData.note}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                          <div class="row mt-4">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label>Environment</label>
                                <input
                                  type="text"
                                  name="environment"
                                  class="form-control"
                                  min="1"
                                  value={formData.environment}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row mt-4">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label>Duration (slots)</label>
                                <input
                                  type="number"
                                  name="duration"
                                  class="form-control"
                                  min="1"
                                  max="4"
                                  value={formData.duration}
                                  onChange={(e) => {
                                    const value = Math.min(
                                      Math.max(
                                        parseInt(e.target.value) || 1,
                                        1
                                      ),
                                      4
                                    );
                                    handleChange({
                                      target: {
                                        name: "duration",
                                        value: value.toString(),
                                      },
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row mt-4">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label>Objective</label>
                                <input
                                  type="text"
                                  name="objective"
                                  class="form-control"
                                  min="1"
                                  value={formData.objective}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div class="text-right mt-3">
                      <button
                        type="submit"
                        class="btn btn-warning"
                        onClick={handleSubmit}
                      >
                        CONFIRM
                      </button>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card mb-3">
                      <div class="card-header card-header-info">
                        <h4 class="card-title">Add Skill</h4>
                      </div>
                      <div class="card-body">
                        <button
                          class="btn btn-info btn-block"
                          onClick={() => setOpenSkillModal(true)}
                        >
                          <i className="material-icons">add</i> Add Skill
                          {formData.skillId && " (1 chosen)"}
                        </button>
                      </div>
                    </div>
                    <br />
                    <div class="card">
                      <div class="card-header card-header-info">
                        <h4 class="card-title">Add Equipment</h4>
                      </div>
                      <div class="card-body">
                        <button
                          class="btn btn-info btn-block"
                          onClick={() => setOpenEquipmentModal(true)}
                        >
                          <i className="material-icons">add</i> Add Equipment
                          {formData.lessonEquipmentDTOs.length > 0 &&
                            ` (${formData.lessonEquipmentDTOs.length} chosen)`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                              className="btn btn-info btn-sm"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  skillId: skill.id,
                                }));
                              }}
                            >
                              <i className="material-icons">
                                {formData.skillId === skill.id
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
                                <strong>Description:</strong>{" "}
                                {skill.description}
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
                            formData.lessonEquipmentDTOs.some(
                              (dto) => dto.equipmentId === eq.id
                            )
                          )
                        }
                        onChange={() =>
                          handleSelectAllEquipments(
                            equipmentList.length > 0 &&
                              equipmentList.every((eq) =>
                                formData.lessonEquipmentDTOs.some(
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
                      equipmentPage * equipmentRowsPerPage +
                        equipmentRowsPerPage
                    )
                    .map((equipment) => {
                      const isSelected = formData.lessonEquipmentDTOs.some(
                        (dto) => dto.equipmentId === equipment.id
                      );
                      const selectedEquipment =
                        formData.lessonEquipmentDTOs.find(
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
                              className="btn btn-info btn-sm"
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
      </body>
    </>
  );
};

export default TrainerLessonsCreate;
