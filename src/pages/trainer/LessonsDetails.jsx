import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useParams } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

const TrainerLessonsDetails = () => {
  const { id } = useParams();
  const { loading, setLoading } = useLoading();
  const [lesson, setLesson] = useState(null);
  const [skill, setSkill] = useState(null);
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/lessons/${id}`);
        if (response.data.success) {
          setLesson(response.data.object);

          // Fetch skill details
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
                                  <label>Duration (hours)</label>
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
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default TrainerLessonsDetails;
