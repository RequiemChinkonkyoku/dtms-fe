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

const TrainerLessonsCreate = () => {
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
    equipmentIds: [],
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/lessons", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.location.reload();
      setResponseMessage("Lesson created successfully!");
      setLessons([...lessons, response.data]);
      setFormData({
        lessonTitle: "",
        description: "",
        note: "",
        environment: "",
        duration: "",
        objective: "",
        skillId: "",
        equipmentIds: [],
      });
    } catch (error) {
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
                      <div class="card">
                        <div class="card-header card-header-warning">
                          <h4 class="card-title">Create a new lesson</h4>
                          <p class="card-category">
                            Enter the required information
                          </p>
                        </div>
                        <div class="card-body ">
                          <div class="row">
                            <label class="col-sm-2 col-form-label">
                              Lesson Title
                            </label>
                            <div class="col-sm-7">
                              <div class="form-group bmd-form-group">
                                <input
                                  class="form-control"
                                  type="text"
                                  name="lessonTitle"
                                  required="true"
                                  aria-required="true"
                                  value={formData.lessonTitle}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <label class="col-sm-2 col-form-label">
                              Description
                            </label>
                            <div class="col-sm-7">
                              <div class="form-group bmd-form-group">
                                <input
                                  class="form-control"
                                  type="text"
                                  name="description"
                                  required="true"
                                  aria-required="true"
                                  value={formData.description}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <label class="col-sm-2 col-form-label">Note</label>
                            <div class="col-sm-7">
                              <div class="form-group bmd-form-group">
                                <input
                                  class="form-control"
                                  type="text"
                                  name="note"
                                  required="true"
                                  aria-required="true"
                                  value={formData.note}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <label class="col-sm-2 col-form-label">
                              Environment
                            </label>
                            <div class="col-sm-7">
                              <div class="form-group bmd-form-group">
                                <input
                                  class="form-control"
                                  type="text"
                                  name="environment"
                                  required="true"
                                  aria-required="true"
                                  value={formData.environment}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <label class="col-sm-2 col-form-label">
                              Duration
                            </label>
                            <div class="col-sm-7">
                              <div class="form-group bmd-form-group">
                                <input
                                  class="form-control"
                                  type="number"
                                  name="duration"
                                  required="true"
                                  aria-required="true"
                                  value={formData.duration}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <label class="col-sm-2 col-form-label">
                              Objective
                            </label>
                            <div class="col-sm-7">
                              <div class="form-group bmd-form-group">
                                <input
                                  class="form-control"
                                  type="text"
                                  name="objective"
                                  required="true"
                                  aria-required="true"
                                  value={formData.objective}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="card-footer ml-auto mr-auto">
                          <button type="submit" class="btn btn-warning">
                            CONFIRM
                          </button>
                        </div>
                      </div>
                    </form>
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
                            formData.equipmentIds.includes(eq.id)
                          )
                        }
                        onChange={() => {
                          const allSelected =
                            equipmentList.length > 0 &&
                            equipmentList.every((eq) =>
                              formData.equipmentIds.includes(eq.id)
                            );
                          setFormData((prev) => ({
                            ...prev,
                            equipmentIds: allSelected
                              ? []
                              : equipmentList.map((eq) => eq.id),
                          }));
                        }}
                      />
                    </th>
                    <th>Name</th>
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
                    .map((equipment) => (
                      <tr key={equipment.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={formData.equipmentIds.includes(
                              equipment.id
                            )}
                            onChange={() => {
                              setFormData((prev) => ({
                                ...prev,
                                equipmentIds: prev.equipmentIds.includes(
                                  equipment.id
                                )
                                  ? prev.equipmentIds.filter(
                                      (id) => id !== equipment.id
                                    )
                                  : [...prev.equipmentIds, equipment.id],
                              }));
                            }}
                          />
                        </td>
                        <td>{equipment.name}</td>
                        <td className="td-actions text-right">
                          <button
                            type="button"
                            className="btn btn-info btn-sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                equipmentIds: prev.equipmentIds.includes(
                                  equipment.id
                                )
                                  ? prev.equipmentIds.filter(
                                      (id) => id !== equipment.id
                                    )
                                  : [...prev.equipmentIds, equipment.id],
                              }));
                            }}
                          >
                            <i className="material-icons">
                              {formData.equipmentIds.includes(equipment.id)
                                ? "remove"
                                : "add"}
                            </i>
                          </button>
                        </td>
                      </tr>
                    ))}
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
