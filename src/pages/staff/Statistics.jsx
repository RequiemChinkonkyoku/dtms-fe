import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import { useLoading } from "../../contexts/LoadingContext";

import { BarChart } from "@mui/x-charts/BarChart";

const StaffStatistics = () => {
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
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h4 className="card-title">Statistics</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <BarChart
                            xAxis={[
                              {
                                id: "barCategories",
                                data: ["bar A", "bar B", "bar C"],
                                scaleType: "band",
                              },
                            ]}
                            series={[
                              {
                                data: [2, 5, 3],
                              },
                            ]}
                            height={300}
                          />
                        </div>
                      </div>
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

export default StaffStatistics;
