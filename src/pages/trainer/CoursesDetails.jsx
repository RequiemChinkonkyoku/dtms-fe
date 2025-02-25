import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import "../../assets/css/custom.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

const TrainerCoursesDetails = () => {
  const { id } = useParams(); // Get course ID from URL
  const [course, setCourse] = useState(null);
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
                      height: "400px", // Adjust as needed
                    }}
                  >
                    <div className="overlay"></div> {/* Dark overlay */}
                    <div className="card-header card-header-icon card-header-rose">
                      <div className="card-icon">
                        <i className="material-icons">assignment</i>
                      </div>
                      <h1 className="card-title">{course.name}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div className="col-md-8 ml-auto mr-auto">
                  <div className="page-categories">
                    <h3 className="title text-center">Page Subcategories</h3>
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
                          <i className="material-icons">info</i> Description
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${activeTab === "location" ? "active show" : ""}`}
                          onClick={() => setActiveTab("location")}
                        >
                          <i className="material-icons">location_on</i> Location
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${activeTab === "legal" ? "active show" : ""}`}
                          onClick={() => setActiveTab("legal")}
                        >
                          <i className="material-icons">gavel</i> Legal Info
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${activeTab === "help" ? "active show" : ""}`}
                          onClick={() => setActiveTab("help")}
                        >
                          <i className="material-icons">help_outline</i> Help
                          Center
                        </a>
                      </li>
                    </ul>

                    <div className="tab-content tab-space tab-subcategories">
                      {activeTab === "description" && (
                        <div className="tab-pane active show">
                          <div className="card">
                            <div className="card-header">
                              <h4 className="card-title">
                                Description about product
                              </h4>
                              <p className="card-category">
                                More information here
                              </p>
                            </div>
                            <div className="card-body">
                              Collaboratively administrate empowered markets via
                              plug-and-play networks...
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "location" && (
                        <div className="tab-pane active show">
                          <div className="card">
                            <div className="card-header">
                              <h4 className="card-title">
                                Location of the product
                              </h4>
                              <p className="card-category">
                                More information here
                              </p>
                            </div>
                            <div className="card-body">
                              Efficiently unleash cross-media information
                              without cross-media value...
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "legal" && (
                        <div className="tab-pane active show">
                          <div className="card">
                            <div className="card-header">
                              <h4 className="card-title">
                                Legal info of the product
                              </h4>
                              <p className="card-category">
                                More information here
                              </p>
                            </div>
                            <div className="card-body">
                              Completely synergize resource taxing relationships
                              via premier niche markets...
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "help" && (
                        <div className="tab-pane active show">
                          <div className="card">
                            <div className="card-header">
                              <h4 className="card-title">Help center</h4>
                              <p className="card-category">
                                More information here
                              </p>
                            </div>
                            <div className="card-body">
                              From the seamless transition of glass and metal to
                              the streamlined profile...
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
