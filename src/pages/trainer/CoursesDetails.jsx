import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import "../../assets/css/course-details-custom.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

const TrainerCoursesDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`/api/courses/${id}`);
        if (response.data.success && response.data.object) {
          setCourse(response.data.object);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  useEffect(() => {
    if (course) {
      // Fetch lessons
      const fetchLessons = async () => {
        const lessonPromises = course.lessonIds.map(async (lessonId) => {
          try {
            const res = await axios.get(`/api/lessons/${lessonId}`);
            return res.data.object;
          } catch (error) {
            console.error(`Error fetching lesson ${lessonId}:`, error);
            return null;
          }
        });

        const lessonData = await Promise.all(lessonPromises);
        setLessons(lessonData.filter((lesson) => lesson !== null));
      };

      // Fetch breeds
      const fetchBreeds = async () => {
        const breedPromises = course.dogBreedIds.map(async (breedId) => {
          try {
            const res = await axios.get(`/api/dogBreeds/${breedId}`);
            return res.data;
          } catch (error) {
            console.error(`Error fetching breed ${breedId}:`, error);
            return null;
          }
        });

        const breedData = await Promise.all(breedPromises);
        setBreeds(breedData.filter((breed) => breed !== null));
      };

      fetchLessons();
      fetchBreeds();
    }
  }, [course]);

  if (loading) return <Loader />;
  if (!course) return <p className="text-center">Course not found.</p>;

  return (
    <>
      <Head />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel ps-container ps-theme-default">
          <Navbar />
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div
                    className="card course-card"
                    style={{
                      backgroundImage: `url(${course.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                      height: "400px",
                    }}
                  >
                    <div className="overlay"></div>
                    <div className="card-header card-header-icon card-header-rose">
                      <h1 className="card-title">{course.name}</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-8 ml-auto mr-auto">
                  <div className="page-categories">
                    <h3 className="title text-center">COURSE INFORMATION</h3>
                    <br />
                    <ul
                      className="nav nav-pills nav-pills-warning nav-pills-icons justify-content-center"
                      role="tablist"
                    >
                      <li className="nav-item">
                        <a
                          className={`nav-link ${activeTab === "description" ? "active show" : ""}`}
                          onClick={() => setActiveTab("description")}
                        >
                          <i className="material-icons">info</i> Details
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${activeTab === "lessons" ? "active show" : ""}`}
                          onClick={() => setActiveTab("lessons")}
                        >
                          <i className="material-icons">play_lesson</i> Lessons
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${activeTab === "breeds" ? "active show" : ""}`}
                          onClick={() => setActiveTab("breeds")}
                        >
                          <i className="material-icons">pets</i> Breeds
                        </a>
                      </li>
                    </ul>

                    <div className="tab-content tab-space tab-subcategories">
                      {activeTab === "description" && (
                        <div className="tab-pane active show">
                          <div className="card">
                            <div className="card-header">
                              <h4 className="card-title">Course Description</h4>
                            </div>
                            <div className="card-body">
                              {course.description}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "lessons" && (
                        <div className="tab-pane active show">
                          <div className="card">
                            <div className="card-header card-header-icon card-header-rose">
                              <div className="card-icon">
                                <i className="material-icons">assignment</i>
                              </div>
                              <h4 className="card-title">Lessons included</h4>
                            </div>
                            <div className="card-body">
                              <div className="table-responsive">
                                <table className="table">
                                  <thead className="text-primary">
                                    <tr>
                                      <th>No.</th>
                                      <th>Lesson Title</th>
                                      <th>Description</th>
                                      <th>Duration (mins)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {lessons.length > 0 ? (
                                      lessons.map((lesson, index) => (
                                        <tr key={lesson.id}>
                                          <td>{index + 1}</td>
                                          <td>{lesson.lessonTitle}</td>
                                          <td>{lesson.description}</td>
                                          <td>{lesson.duration || "N/A"}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="4" className="text-center">
                                          No lessons available.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "breeds" && (
                        <div className="tab-pane active show">
                          <div className="card">
                            <div className="card-header card-header-icon card-header-rose">
                              <div className="card-icon">
                                <i className="material-icons">pets</i>
                              </div>
                              <h4 className="card-title">Allowed breed list</h4>
                            </div>
                            <div className="card-body">
                              <div className="table-responsive">
                                <table className="table">
                                  <thead className="text-primary">
                                    <tr>
                                      <th>ID</th>
                                      <th>Breed Name</th>
                                      <th>Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {breeds.length > 0 ? (
                                      breeds.map((breed, index) => (
                                        <tr key={breed.id}>
                                          <td>{index + 1}</td>
                                          <td>{breed.name}</td>
                                          <td>{breed.description}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="3" className="text-center">
                                          No breeds available.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainerCoursesDetails;
