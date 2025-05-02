import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { useAuth } from "../../contexts/AuthContext";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";

import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Badge } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers";

function CustomDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isHighlighted = highlightedDays.some(
    (d) => d.format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
  );

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isHighlighted ? "+" : undefined}
      color="info"
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

const StaffDashboard = () => {
  const { user } = useAuth();
  const [accountDetails, setAccountDetails] = useState(null);
  const [counts, setCounts] = useState({
    classes: 0,
    accounts: 0,
    dogs: 0,
  });
  const [recentDogs, setRecentDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [todayClasses, setTodayClasses] = useState([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good evening");
    else setGreeting("Good night");
  }, []);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get(`/api/accounts/${user.unique_name}`);
        setAccountDetails(response.data);
      } catch (error) {
        console.error("Error fetching account info:", error);
      }
    };

    if (user?.unique_name) {
      fetchAccountInfo();
    }
  }, [user]);

  useEffect(() => {
    fetchCounts();
    fetchTodayClasses();
  }, []);

  const fetchTodayClasses = async () => {
    try {
      const classesRes = await axios.get("/api/class");
      const classes = classesRes.data.objectList || [];

      const today = dayjs().format("YYYY-MM-DD");
      const todayClasses = [];

      for (const classItem of classes) {
        const slotsRes = await axios.get(
          `/api/class/get-class-slots/${classItem.id}`
        );

        const slots = slotsRes.data.object?.slots || [];
        const hasSlotToday = slots.some((slot) => {
          const slotDate = dayjs(slot.date).format("YYYY-MM-DD");
          return slotDate === today;
        });

        if (hasSlotToday) {
          todayClasses.push(classItem);
        }
      }

      setTodayClasses(todayClasses);
    } catch (error) {
      console.error("Error fetching today's classes:", error);
    }
  };

  const fetchCounts = async () => {
    try {
      const [classesRes, accountsRes, dogsRes] = await Promise.all([
        axios.get("/api/class"),
        axios.get("/api/accounts"),
        axios.get("/api/dogs"),
      ]);

      setCounts({
        classes: classesRes.data.objectList?.length || 0,
        accounts: accountsRes.data?.length || 0,
        dogs: dogsRes.data?.length || 0,
      });

      const now = new Date();
      const oneMonthAgo = new Date(now.setDate(now.getDate() - 30));

      const recentDogs =
        dogsRes.data?.filter((dog) => {
          const registrationDate = new Date(dog.registrationTime);
          return (
            registrationDate >= oneMonthAgo && registrationDate <= new Date()
          );
        }) || [];

      const oneMonthFromNow = new Date(now.setMonth(now.getMonth() + 1));

      const upcoming =
        classesRes.data.objectList?.filter((classItem) => {
          const startDate = new Date(classItem.startingDate);
          return startDate > new Date() && startDate <= oneMonthFromNow;
        }) || [];

      const classStartDates =
        classesRes.data.objectList?.map((classItem) =>
          dayjs(classItem.startingDate)
        ) || [];
      setHighlightedDays(classStartDates);

      // Count customers based on roleId
      const customerRoleIds = [
        "a4b5c67890d1e2f3a4b5c67890d1e2f3",
        "b5c67890d1e2f3a4b5c67890d1e2f3a4",
      ];
      const customerCount =
        accountsRes.data?.filter((account) =>
          customerRoleIds.includes(account.roleId)
        ).length || 0;

      setUpcomingClasses(upcoming);
      setRecentDogs(recentDogs);
      setCustomerCount(customerCount); // Set the customer count
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
                <div className="row">
                  <div className="col-md-8">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="card">
                          <div class="card-header card-header-success card-header-icon">
                            <h2 class="card-title">
                              {greeting}, {accountDetails?.fullName || "Staff"}!{" "}
                            </h2>
                            <h4 class="card-categor text-muted">
                              Here are the schedules and documents for you
                              today.
                            </h4>
                          </div>
                          <br />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 col-sm-6">
                        <div className="card card-stats">
                          <div className="card-header card-header-info card-header-icon">
                            <div className="card-icon">
                              <i className="material-icons">pets</i>
                            </div>
                            <p className="card-category">Total dogs</p>
                            <h3 className="card-title">{counts.dogs}</h3>
                          </div>
                          <div className="card-footer">
                            <div className="stats">
                              <i className="material-icons">update</i> All dogs
                              in the database
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="card card-stats">
                          <div className="card-header card-header-info card-header-icon">
                            <div className="card-icon">
                              <i className="material-icons">post_add</i>
                            </div>
                            <p className="card-category">Recent dogs</p>
                            <h3 className="card-title">{recentDogs.length}</h3>
                          </div>
                          <div className="card-footer">
                            <div className="stats">
                              <i className="material-icons">update</i> Newly
                              registered dogs in 30 days
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="card card-stats">
                          <div className="card-header card-header-info card-header-icon">
                            <div className="card-icon">
                              <i className="material-icons">post_add</i>
                            </div>
                            <p className="card-category">Customers</p>
                            <h3 className="card-title">{customerCount}</h3>{" "}
                          </div>
                          <div className="card-footer">
                            <div className="stats">
                              <i className="material-icons">update</i> Active
                              customers
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-8">
                        <div class="card">
                          <div className="card-header card-header-warning">
                            <h4 className="card-title">Today's classes</h4>
                            <p className="card-category">
                              Classes scheduled for today
                            </p>
                          </div>
                          <div className="card-body table-responsive">
                            <table className="table table-hover">
                              <thead className="text-warning">
                                <tr>
                                  <th>Class Name</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {todayClasses.length === 0 ? (
                                  <tr>
                                    <td colSpan="2" className="text-center">
                                      No class for today
                                    </td>
                                  </tr>
                                ) : (
                                  todayClasses.map((classItem) => (
                                    <tr key={classItem.id}>
                                      <td>
                                        <strong>{classItem.name}</strong>
                                        <br />
                                        <small className="text-muted">
                                          {classItem.courseName}
                                        </small>
                                      </td>
                                      <td>
                                        <button className="btn btn-info btn-sm">
                                          View Details
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="card">
                          <div className="card-header card-header-warning">
                            <h4 className="card-title">Upcoming classes</h4>
                            <p className="card-category">
                              Starting date in 1 month
                            </p>
                          </div>
                          <div className="card-body table-responsive">
                            <table className="table table-hover">
                              {/* <thead className="text-warning">
                                <tr>
                                  <th>Class Name</th>
                                  <th>Action</th>
                                </tr>
                              </thead> */}
                              <tbody>
                                {upcomingClasses.length === 0 ? (
                                  <tr>
                                    <td className="text-center">
                                      No upcoming classes
                                    </td>
                                  </tr>
                                ) : (
                                  upcomingClasses.map((classItem) => (
                                    <tr key={classItem.id}>
                                      <td>
                                        <p className="mb-0">
                                          <strong>{classItem.name}</strong>
                                        </p>
                                        <small className="text-muted">
                                          {classItem.courseName}
                                        </small>
                                        <br />
                                        <small className="text-info">
                                          Starts:{" "}
                                          {new Date(
                                            classItem.startingDate
                                          ).toLocaleDateString()}
                                        </small>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="col-md-12">
                      <div className="card ">
                        <div className="card-body">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                              value={dayjs()}
                              readOnly
                              slots={{
                                day: CustomDay,
                              }}
                              slotProps={{
                                day: {
                                  highlightedDays,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="row">
                  <div className="col-lg-8 col-md-8">
                    <div className="card">
                      <div className="card-header card-header-warning">
                        <h4 className="card-title">Today's Classes</h4>
                        <p className="card-category">
                          Classes scheduled for today
                        </p>
                      </div>
                      <div className="card-body table-responsive">
                        <table className="table table-hover">
                          <thead className="text-warning">
                            <tr>
                              <th>Class Name</th>
                              <th>Time</th>
                              <th>Trainer</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan="4" className="text-center">
                                Data will be implemented later
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="card">
                      <div className="card-header card-header-info">
                        <h4 className="card-title">Upcoming Classes</h4>
                        <p className="card-category">
                          Next scheduled classes within 1 month
                        </p>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table">
                            <tbody>
                              {upcomingClasses.length === 0 ? (
                                <tr>
                                  <td className="text-center">
                                    No upcoming classes
                                  </td>
                                </tr>
                              ) : (
                                upcomingClasses.map((classItem) => (
                                  <tr key={classItem.id}>
                                    <td>
                                      <p className="mb-0">
                                        <strong>{classItem.name}</strong>
                                      </p>
                                      <small className="text-muted">
                                        {classItem.courseName}
                                      </small>
                                      <br />
                                      <small className="text-info">
                                        Starts:{" "}
                                        {new Date(
                                          classItem.startingDate
                                        ).toLocaleDateString()}
                                      </small>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default StaffDashboard;
