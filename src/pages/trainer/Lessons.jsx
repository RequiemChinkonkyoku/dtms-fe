import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useNavigate } from "react-router-dom";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";
import { useLoading } from "../../contexts/LoadingContext";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { TablePagination, TableSortLabel, TextField } from "@mui/material";

const TrainerLessons = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("createdTime");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [lessons, setLessons] = useState([]);
  const { loading, setLoading } = useLoading();
  const [skillDetails, setSkillDetails] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

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
      if (orderBy === "createdTime") {
        const dateA = new Date(a[orderBy]).getTime();
        const dateB = new Date(b[orderBy]).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
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

  const handleStatusChange = async (lesson) => {
    setSelectedLesson(lesson);
    setOpenModal(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      const lessonResponse = await axios.get(
        `/api/lessons/${selectedLesson.id}`
      );
      if (!lessonResponse.data.success) return;

      const lessonData = lessonResponse.data.object;
      const newStatus = selectedLesson.status === 0 ? 1 : 0;

      const updatePayload = {
        id: lessonData.id,
        lessonTitle: lessonData.lessonTitle,
        description: lessonData.description,
        note: lessonData.notes,
        environment: lessonData.environment,
        duration: lessonData.duration,
        objective: lessonData.objective,
        skillId: lessonData.skillId,
        status: newStatus,
        lessonEquipmentDTOs: lessonData.lessonEquipments.map((eq) => ({
          equipmentId: eq.equipmentId,
          quantity: eq.quantity,
        })),
      };

      const response = await axios.put("/api/lessons", updatePayload);
      if (response.data.success) {
        setLessons(
          lessons.map((lesson) =>
            lesson.id === selectedLesson.id
              ? { ...lesson, status: newStatus }
              : lesson
          )
        );
      }
    } catch (error) {
      console.error("Error updating lesson status:", error);
    } finally {
      setOpenModal(false);
      setSelectedLesson(null);
    }
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
                            <button
                              className="btn btn-warning"
                              onClick={() =>
                                navigate("/trainer/lessons/create")
                              }
                            >
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
                                  ["duration", "Duration (slots)"],
                                  ["status", "Status"],
                                  ["createdTime", "Created Date"], // Add this new column
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
                                    </td>
                                    <td>{lesson.duration}</td>
                                    <td
                                      className={getStatusClass(lesson.status)}
                                    >
                                      {getStatusText(lesson.status)}
                                    </td>
                                    <td>{formatDate(lesson.createdTime)}</td>
                                    <td className="td-actions text-right">
                                      <button
                                        type="button"
                                        rel="tooltip"
                                        className={`btn ${lesson.status === 0 ? "btn-warning" : "btn-success"} btn-sm`}
                                        onClick={() =>
                                          handleStatusChange(lesson)
                                        }
                                        title={
                                          lesson.status === 1
                                            ? "Deactivate"
                                            : "Activate"
                                        }
                                      >
                                        <i className="material-icons">
                                          {lesson.status === 0
                                            ? "toggle_off"
                                            : "toggle_on"}
                                        </i>
                                      </button>
                                      <button
                                        type="button"
                                        rel="tooltip"
                                        className="btn btn-info btn-sm"
                                        style={{ marginLeft: "8px" }}
                                        onClick={() =>
                                          navigate(
                                            `/trainer/lessons/details/${lesson.id}`
                                          )
                                        }
                                        title="View Details"
                                      >
                                        <i className="material-icons">
                                          visibility
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
              </div>
            </div>
          </div>
        </div>
      </body>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirm Change</DialogTitle>
        <DialogContent>
          Are you sure you want to{" "}
          {selectedLesson?.status === 1 ? "deactivate" : "activate"} the lesson
          "{selectedLesson?.lessonTitle}"?
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-default"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
          <button
            className={`btn ${selectedLesson?.status === 1 ? "btn-warning" : "btn-success"}`}
            onClick={handleConfirmStatusChange}
          >
            Confirm
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TrainerLessons;
