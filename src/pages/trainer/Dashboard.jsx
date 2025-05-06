import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useAuth } from "../../contexts/AuthContext";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [weeklySlots, setWeeklySlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good evening");
    else setGreeting("Good night");
  }, []);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        if (!user?.unique_name) {
          console.log("No user unique_name available, skipping API calls");
          setLoading(false);
          return;
        }

        const schedulesResponse = await axios.get("/api/schedules");
        const slotsResponse = await axios.get(
          `/api/slots/get-trainer-slots/${user.unique_name}`
        );

        if (schedulesResponse.data && slotsResponse.data.success) {
          setSchedules(schedulesResponse.data);

          const today = new Date();
          const sunday = new Date(today);
          sunday.setDate(today.getDate() - today.getDay());
          sunday.setHours(0, 0, 0, 0);

          const saturday = new Date(today);
          saturday.setDate(today.getDate() + (6 - today.getDay()));
          saturday.setHours(23, 59, 59, 999);

          const weekSlots = slotsResponse.data.objectList.filter((slot) => {
            const slotDate = new Date(slot.slotDate);
            return slotDate >= sunday && slotDate <= saturday;
          });

          setWeeklySlots(weekSlots);
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [user?.unique_name]);

  const getDaySlots = (dayOffset) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + dayOffset);
    const dateStr = date.toISOString().split("T")[0];
    const slots = weeklySlots.filter((slot) => slot.slotDate === dateStr);
    return slots;
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
                <div className="row">
                  <div className="col-md-12">
                    <h2>
                      {greeting}, {user?.name || "Trainer"}!
                    </h2>
                    <h4 className="text-muted">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </h4>
                  </div>
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-warning">
                        <h4 className="card-title">This Week's Schedule</h4>
                        <p className="card-category">
                          {new Date(
                            new Date().setDate(
                              new Date().getDate() - new Date().getDay()
                            )
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            new Date().setDate(
                              new Date().getDate() - new Date().getDay() + 6
                            )
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="card-body">
                        {loading ? (
                          <Loader />
                        ) : schedules.length === 0 ? (
                          <div className="alert alert-info">
                            No schedules available
                          </div>
                        ) : weeklySlots.length === 0 ? (
                          <div className="alert alert-info">
                            No slots scheduled for this week
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Time</th>
                                  {[
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                  ].map((day) => (
                                    <th key={day}>{day}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {schedules.map((schedule) => (
                                  <tr key={schedule.id}>
                                    <td>
                                      {schedule.startTime.substring(0, 5)} -{" "}
                                      {schedule.endTime.substring(0, 5)}
                                    </td>
                                    {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                                      const slot = getDaySlots(dayOffset).find(
                                        (s) => s.scheduleId === schedule.id
                                      );
                                      return (
                                        <td key={dayOffset}>
                                          {slot ? (
                                            <div className="badge badge-warning">
                                              {slot.className}
                                            </div>
                                          ) : (
                                            <div className="text-muted">-</div>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
      </body>
    </>
  );
};

export default TrainerDashboard;
