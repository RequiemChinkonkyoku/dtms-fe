import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TrainerLessons = () => {
  const [age, setAge] = React.useState("");

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const [equipmentList, setEquipmentList] = useState([]);
  const [skills, setSkills] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get("api/lessons");
        if (response.data.success && response.data.objectList) {
          setLessons(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return (
    <>
      <Head />
      <body>
        <div className="wrapper">
          <Sidebar />
          <div className="main-panel ps-container ps-theme-default">
            <Navbar />
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">pets</i>
                        </div>
                        <h4 className="card-title">Lesson List</h4>
                      </div>
                      <div className="card-body">
                        {loading ? (
                          <Loader />
                        ) : (
                          <div className="table-responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Title</th>
                                  <th>Description</th>
                                  <th>Environment</th>
                                  <th>Duration (mins)</th>
                                  <th className="text-center">Status</th>
                                  <th className="text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lessons.length > 0 ? (
                                  lessons.map((lesson) => (
                                    <tr key={lesson.id}>
                                      <td>{lesson.id}</td>
                                      <td>{lesson.lessonTitle}</td>
                                      <td>{lesson.description}</td>
                                      <td>{lesson.environment}</td>
                                      <td>{lesson.duration}</td>
                                      <td className="text-center">
                                        <span
                                          className={`badge ${
                                            lesson.status === 0
                                              ? "bg-success"
                                              : "bg-danger"
                                          }`}
                                        >
                                          {lesson.status === 0
                                            ? "Active"
                                            : "Inactive"}
                                        </span>
                                      </td>
                                      <td className="td-actions text-right">
                                        <button
                                          type="button"
                                          rel="tooltip"
                                          className="btn btn-success"
                                        >
                                          <i className="material-icons">edit</i>
                                        </button>
                                        <button
                                          type="button"
                                          rel="tooltip"
                                          className="btn btn-danger"
                                        >
                                          <i className="material-icons">
                                            close
                                          </i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="7" className="text-center">
                                      No lessons found.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <form onSubmit={handleSubmit}>
                      <div class="card ">
                        <div class="card-header card-header-warning card-header-text">
                          <div class="card-text">
                            <h4 class="card-title">Create a new lesson</h4>
                          </div>
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
                            <label class="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
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
                            <label class="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
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
                            <label class="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
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
                            <label class="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
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
                            <label class="col-sm-3 label-on-right">
                              <code>required, number</code>
                            </label>
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
                            <label class="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              Skill
                            </label>
                            <div className="col-sm-7">
                              <div className="form-group bmd-form-group">
                                <Select
                                  name="skillId" // This is important for handleChange
                                  value={formData.skillId}
                                  onChange={handleChange}
                                  displayEmpty
                                  size="small"
                                  style={{ height: "36px", width: "100%" }}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {skills.map((skill) => (
                                    <MenuItem key={skill.id} value={skill.id}>
                                      {skill.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </div>
                            </div>
                            <label className="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              Equipments
                            </label>
                            <div className="col-sm-7">
                              <div className="form-group bmd-form-group">
                                <Select
                                  multiple
                                  name="equipmentIds"
                                  value={formData.equipmentIds} // Ensure this is always an array
                                  onChange={handleChange}
                                  MenuProps={MenuProps}
                                  size="small"
                                  style={{ height: "36px", width: "100%" }}
                                  renderValue={(selected) =>
                                    equipmentList
                                      .filter((eq) => selected.includes(eq.id))
                                      .map((eq) => eq.name)
                                      .join(", ")
                                  } // Display selected values properly
                                >
                                  {equipmentList.length === 0 ? (
                                    <MenuItem disabled>
                                      No Equipment Available
                                    </MenuItem>
                                  ) : (
                                    equipmentList.map((equipment) => (
                                      <MenuItem
                                        key={equipment.id}
                                        value={equipment.id}
                                      >
                                        {equipment.name}
                                      </MenuItem>
                                    ))
                                  )}
                                </Select>
                              </div>
                            </div>
                            <label className="col-sm-3 label-on-right">
                              <code>required</code>
                            </label>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default TrainerLessons;
