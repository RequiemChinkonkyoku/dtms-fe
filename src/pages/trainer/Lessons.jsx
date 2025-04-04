import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";
import { useLoading } from "../../contexts/LoadingContext";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import { TablePagination, TableSortLabel, TextField } from "@mui/material";

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("lessonTitle");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [skills, setSkills] = useState([]);
  const [lessons, setLessons] = useState([]);
  const { loading, setLoading } = useLoading();
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
  const [skillDetails, setSkillDetails] = useState({});

  // Add this function after your other useEffect hooks
  useEffect(() => {
    const fetchSkillDetails = async (skillId) => {
      try {
        const response = await axios.get(`/api/skills/${skillId}`);
        if (response.data.success && response.data.object) {
          setSkillDetails((prev) => ({
            ...prev,
            [skillId]: response.data.object.name,
          }));
        }
      } catch (error) {
        console.error("Error fetching skill details:", error);
      }
    };

    // Fetch skill details for each lesson
    lessons.forEach((lesson) => {
      if (lesson.skillId && !skillDetails[lesson.skillId]) {
        fetchSkillDetails(lesson.skillId);
      }
    });
  }, [lessons]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getStatusClass = (status) => {
    return status === 1 ? "text-success" : "text-warning";
  };

  const getStatusText = (status) => {
    return status === 1 ? "Active" : "Inactive";
  };

  // Add this memoized sorting function
  const sortedLessons = React.useMemo(() => {
    const comparator = (a, b) => {
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    };

    return [...lessons]
      .filter((lesson) =>
        lesson.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(comparator);
  }, [lessons, order, orderBy, searchTerm]);

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
        setLoading(true);
        const startTime = Date.now();
        const response = await axios.get("api/lessons");
        if (response.data.success && response.data.objectList) {
          setLessons(response.data.objectList);
        }

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
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
        <div className="pattern-background" />
        <div className="wrapper">
          <Sidebar />
          <div className="main-panel ps-container ps-theme-default">
            <Navbar />
            <div className="content">
              <div className="container-fluid">
                <div class="row">
                  <div className="card">
                    <div className="card-header card-header-warning card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">pets</i>
                      </div>
                      <h4 className="card-title">Lesson List</h4>
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
                              gap: "16px",
                            }}
                          >
                            <TextField
                              label="Search lesson..."
                              variant="outlined"
                              size="small"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-warning">
                              <i className="material-icons">add</i> Create
                              Lesson
                            </button>
                          </div>
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                {[
                                  ["lessonTitle", "Title"],
                                  ["environment", "Environment"],
                                  ["skillId", "Skill"],
                                  ["duration", "Duration (hour)"],
                                  ["status", "Status"],
                                ].map(([key, label]) => (
                                  <th key={key}>
                                    <TableSortLabel
                                      active={orderBy === key}
                                      direction={
                                        orderBy === key ? order : "asc"
                                      }
                                      onClick={() => handleSort(key)}
                                    >
                                      {label}
                                    </TableSortLabel>
                                  </th>
                                ))}
                                <th className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedLessons
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((lesson, index) => (
                                  <tr key={lesson.id}>
                                    <td className="text-center">
                                      {page * rowsPerPage + index + 1}
                                    </td>
                                    <td>{lesson.lessonTitle}</td>
                                    <td>{lesson.environment}</td>
                                    <td>
                                      {skillDetails[lesson.skillId] ||
                                        "Loading..."}
                                    </td>{" "}
                                    <td>{lesson.duration}</td>
                                    <td
                                      className={getStatusClass(lesson.status)}
                                    >
                                      {getStatusText(lesson.status)}
                                    </td>
                                    <td className="td-actions text-right">
                                      <button
                                        type="button"
                                        rel="tooltip"
                                        className="btn btn-success btn-sm"
                                      >
                                        <i className="material-icons">edit</i>
                                      </button>
                                      <button
                                        type="button"
                                        rel="tooltip"
                                        className="btn btn-danger btn-sm"
                                      >
                                        <i className="material-icons">close</i>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={sortedLessons.length}
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
