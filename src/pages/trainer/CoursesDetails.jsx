import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import "../../assets/css/course-details-custom.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

import { useLoading } from "../../contexts/LoadingContext";

const TrainerCoursesDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const { loading, setLoading } = useLoading();
  const [trainerName, setTrainerName] = useState("");

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

      const fetchCategory = async () => {
        try {
          const res = await axios.get(`/api/categories/${course.categoryId}`);
          setCategoryName(res.data.object.name);
        } catch (error) {
          console.error(`Error fetching category:`, error);
        }
      };
      const fetchTrainer = async () => {
        try {
          const res = await axios.get(
            `/api/accounts/${course.createdTrainerId}`
          );
          setTrainerName(res.data.fullName);
        } catch (error) {
          console.error(`Error fetching trainer:`, error);
        }
      };

      fetchTrainer();
      fetchCategory();
      fetchLessons();
      fetchBreeds();
    }
  }, [course]);

  if (!course) return <p className="text-center">Course not found.</p>;

  return (
    <>
      <Head />
      <div className="pattern-background" />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel ps-container ps-theme-default">
          <Navbar />
          <div className="content">
            <div className="container-fluid">
              {loading ? (
                <div className="text-center p-5">
                  <Loader />
                </div>
              ) : (
                <>
                  {/* First Row */}
                  <div className="row">
                    <div className="col-md-9">
                      <div className="card">
                        <div className="card-header card-header-primary">
                          <h4 className="card-title">Course Information</h4>
                          <p className="card-category">Basic Details</p>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <h6>Course Name</h6>
                              <p
                                className="text-primary"
                                style={{ fontSize: "1.25rem" }}
                              >
                                {course.name}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <h6>Category</h6>
                              <p
                                className="text-info"
                                style={{ fontSize: "1.25rem" }}
                              >
                                {categoryName || "Loading..."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-warning btn-block">
                        <i className="material-icons">edit</i> Update Course
                      </button>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="row">
                    <div className="col-md-9">
                      <div className="card">
                        <div className="card-header card-header-warning">
                          <h4 className="card-title">Course Details</h4>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12">
                              <h6>Description</h6>
                              <p>{course.description}</p>
                            </div>
                            <div className="col-md-4">
                              <h6>Duration</h6>
                              <p>{course.durationInWeeks} week(s)</p>
                            </div>
                            <div className="col-md-4">
                              <h6>Schedule</h6>
                              <p>
                                {course.daysPerWeek} days/week,{" "}
                                {course.slotsPerDay} slots/day
                              </p>
                            </div>
                            <div className="col-md-4">
                              <h6>Trainers Required</h6>
                              <p>
                                {course.minTrainers} - {course.maxTrainers}
                              </p>
                            </div>
                            <div className="col-md-4">
                              <h6>Complexity</h6>
                              <div style={{ verticalAlign: "middle" }}>
                                {[...Array(5)].map((_, index) => (
                                  <i
                                    key={index}
                                    className="material-icons"
                                    style={{ fontSize: "18px" }}
                                  >
                                    {index < course.complexity
                                      ? "star"
                                      : "star_border"}
                                  </i>
                                ))}
                              </div>
                            </div>
                            <div className="col-md-4">
                              <h6>Status</h6>
                              <p
                                className={
                                  course.status === 1
                                    ? "text-success"
                                    : "text-warning"
                                }
                              >
                                {course.status === 1 ? "Active" : "Inactive"}
                              </p>
                            </div>
                            <div className="col-md-4">
                              <h6>Price</h6>
                              <p>{course.price.toLocaleString()} VND</p>
                            </div>
                            <div className="col-md-12 text-right mt-3">
                              <button className="btn btn-info btn-sm">
                                <i className="material-icons">image</i> View
                                Image
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card">
                        <div className="card-header card-header-info">
                          <h4 className="card-title">Author</h4>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12">
                              <h6>Trainer:</h6>
                              <p className="text-primary">
                                {trainerName || "Loading..."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third Row */}
                  <div className="row">
                    <div className="col-md-9">
                      <div className="card">
                        <div className="card-header card-header-rose">
                          <h4 className="card-title">Course Content</h4>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row mb-4">
                                <div className="col-md-12">
                                  <h6>Lessons</h6>
                                  {lessons.length > 0 ? (
                                    <div className="table-responsive">
                                      <table className="table">
                                        <thead className="text-primary">
                                          <tr>
                                            <th>Title</th>
                                            <th>Environment</th>
                                            <th>Duration (hours)</th>
                                            <th className="text-right">
                                              Actions
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {lessons.map((lesson) => (
                                            <tr key={lesson.id}>
                                              <td>{lesson.lessonTitle}</td>
                                              <td>{lesson.environment}</td>
                                              <td>{lesson.duration}</td>
                                              <td className="text-right">
                                                <button
                                                  className="btn btn-info btn-sm"
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
                                    </div>
                                  ) : (
                                    <p className="text-muted">
                                      No lessons assigned
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <h6>Dog Breeds</h6>
                              <div className="d-flex flex-wrap">
                                {breeds.map((breed) => (
                                  <span
                                    key={breed.id}
                                    className="badge badge-pill badge-info"
                                    style={{
                                      fontSize: "12px",
                                      padding: "6px 10px",
                                      margin: "0 3px 3px 0",
                                    }}
                                  >
                                    <i
                                      className="material-icons"
                                      style={{
                                        fontSize: "12px",
                                        marginRight: "3px",
                                      }}
                                    >
                                      pets
                                    </i>
                                    {breed.name}
                                  </span>
                                ))}
                                {breeds.length === 0 && (
                                  <p className="text-muted">
                                    No specific breed requirements
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainerCoursesDetails;
