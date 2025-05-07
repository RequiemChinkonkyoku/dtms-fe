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
    </>
  );
};

export default TrainerLessons;
