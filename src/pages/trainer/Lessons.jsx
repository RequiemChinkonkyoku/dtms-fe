import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useNavigate } from "react-router-dom";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";
import { useLoading } from "../../contexts/LoadingContext";

import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomPagination from "../../assets/components/common/CustomPagination";

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
                      <h4 className="card-title">Lesson management</h4>
                      <p class="card-category text-muted">
                        Create new lesson, view details and manage them.
                      </p>
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
                            <div style={{ display: "flex", gap: "16px" }}>
                              <CustomSearch
                                value={searchTerm}
                                onChange={setSearchTerm}
                                setPage={setPage}
                              />
                            </div>
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
                          <CustomTable
                            columns={[
                              { key: "lessonTitle", label: "Title" },
                              { key: "environment", label: "Environment" },
                              {
                                key: "skillId",
                                label: "Skill",
                                render: (value, row) =>
                                  skillDetails[row.skillId] || "Loading...",
                              },
                              { key: "duration", label: "Duration (slots)" },
                              {
                                key: "status",
                                label: "Status",
                                render: (value, row) => (
                                  <span className={getStatusClass(row.status)}>
                                    {getStatusText(row.status)}
                                  </span>
                                ),
                              },
                              {
                                key: "createdTime",
                                label: "Created Date",
                                render: (value) => formatDate(value),
                              },
                            ]}
                            data={sortedLessons}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            orderBy={orderBy}
                            order={order}
                            onSort={handleSort}
                            renderActions={(row) => (
                              <>
                                <button
                                  type="button"
                                  rel="tooltip"
                                  className={`btn ${row.status === 0 ? "btn-warning" : "btn-success"} btn-sm`}
                                  onClick={() => handleStatusChange(row)}
                                  title={
                                    row.status === 1 ? "Deactivate" : "Activate"
                                  }
                                >
                                  <i className="material-icons">
                                    {row.status === 0
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
                                      `/trainer/lessons/details/${row.id}`
                                    )
                                  }
                                  title="View Details"
                                >
                                  <i className="material-icons">visibility</i>
                                </button>
                              </>
                            )}
                          />
                          <CustomPagination
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
