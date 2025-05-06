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
import { LineChart } from "@mui/x-charts";
import CustomTable from "../../assets/components/common/CustomTable";
import CustomFilter from "../../assets/components/common/CustomFilter";
import CustomPagination from "../../assets/components/common/CustomPagination";
import CustomSearch from "../../assets/components/common/CustomSearch";

const StaffStatistics = () => {
  const getLast12Months = () => {
    const months = [];
    const today = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      months.push(`${month}/${year}`);
    }

    return months;
  };

  const [accounts, setAccounts] = useState([]);
  const [monthlyAccounts, setMonthlyAccounts] = useState(
    getLast12Months().map((month) => ({ month, count: 0 }))
  );
  const customerRoleIds = [
    "a4b5c67890d1e2f3a4b5c67890d1e2f3",
    "b5c67890d1e2f3a4b5c67890d1e2f3a4",
  ];
  const [dogs, setDogs] = useState([]);
  const [monthlyDogs, setMonthlyDogs] = useState(
    getLast12Months().map((month) => ({ month, count: 0 }))
  );
  const [transactions, setTransactions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [wishlistPage, setWishlistPage] = useState(0);
  const [wishlistRowsPerPage, setWishlistRowsPerPage] = useState(5);
  const [wishlistSearch, setWishlistSearch] = useState("");
  const [wishlistFilter, setWishlistFilter] = useState("all");

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const response = await axios.get("/api/wishlists");
        if (response.data.success) {
          // Process wishlists to count course occurrences
          const courseCount = response.data.objectList.reduce(
            (acc, wishlist) => {
              const key = `${wishlist.courseId}-${wishlist.courseName}`;
              acc[key] = (acc[key] || 0) + 1;
              return acc;
            },
            {}
          );

          // Convert to array and sort by count
          const sortedWishlists = Object.entries(courseCount)
            .map(([key, count]) => ({
              id: key.split("-")[0],
              courseName: key.split("-")[1],
              count: count,
            }))
            .sort((a, b) => b.count - a.count);

          setWishlists(sortedWishlists);
        }
      } catch (error) {
        console.error("Error fetching wishlists:", error);
      }
    };

    fetchWishlists();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/transactions");
        if (response.data.success) {
          const transactionList = response.data.objectList;
          setTransactions(transactionList);

          // Calculate total revenue
          const total = transactionList.reduce(
            (sum, transaction) => sum + transaction.totalAmount,
            0
          );
          setTotalRevenue(total);

          // Calculate monthly revenue
          const today = new Date();
          const last12Months = getLast12Months();

          const monthlyData = last12Months.map((monthStr) => {
            const [month, year] = monthStr.split("/");
            const monthlyTotal = transactionList
              .filter((transaction) => {
                const transDate = new Date(transaction.paymentTime);
                return (
                  transDate.getMonth() + 1 === parseInt(month) &&
                  transDate.getFullYear().toString().slice(-2) === year
                );
              })
              .reduce((sum, transaction) => sum + transaction.totalAmount, 0);

            return {
              month: monthStr,
              revenue: monthlyTotal / 1000000, // Convert to millions
            };
          });

          setMonthlyRevenue(monthlyData);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await axios.get("/api/dogs");
        setDogs(response.data);

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Initialize last 12 months with 0 counts
        const newMonthlyDogs = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(currentYear, currentMonth - 11 + i, 1);
          return {
            month: date.toLocaleString("default", { month: "short" }),
            count: 0,
          };
        });

        response.data.forEach((dog) => {
          const dogDate = new Date(dog.registrationTime);
          const dogYear = dogDate.getFullYear();
          const dogMonth = dogDate.getMonth();

          const monthDiff =
            (currentYear - dogYear) * 12 + (currentMonth - dogMonth);

          if (monthDiff >= 0 && monthDiff < 12) {
            const index = 11 - monthDiff;
            newMonthlyDogs[index].count++;
          }
        });

        setMonthlyDogs(newMonthlyDogs);
      } catch (error) {
        console.error("Error fetching dogs:", error);
      }
    };

    fetchDogs();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/api/accounts");
        const customerAccounts = response.data.filter((account) =>
          customerRoleIds.includes(account.roleId)
        );

        setAccounts(customerAccounts);

        // Initialize 12 months of data (last 12 months including current)
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const newMonthlyAccounts = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(currentYear, currentMonth - 11 + i, 1);
          return {
            month: date.toLocaleString("default", { month: "short" }),
            count: 0,
          };
        });

        customerAccounts.forEach((account) => {
          const accountDate = new Date(account.registrationTime);
          const accountYear = accountDate.getFullYear();
          const accountMonth = accountDate.getMonth();
          const monthDiff =
            (currentYear - accountYear) * 12 + (currentMonth - accountMonth);

          if (monthDiff >= 0 && monthDiff < 12) {
            const monthIndex = 11 - monthDiff;
            newMonthlyAccounts[monthIndex].count++;
          }
        });

        setMonthlyAccounts(newMonthlyAccounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
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
                <div className="row">
                  <div className="col-md-3">
                    <div className="card card-chart">
                      <div className="card-header card-header-success">
                        <h4 className="card-title">Total revenue</h4>
                        <p className="card-category">Overall earnings</p>
                      </div>
                      <div className="card-body">
                        <h3>{totalRevenue.toLocaleString()} VND</h3>
                      </div>
                      <div class="card-footer">
                        <div class="stats">
                          <i class="material-icons">access_time</i> Last updated{" "}
                          {monthlyRevenue.length > 0
                            ? monthlyRevenue[monthlyRevenue.length - 1].month
                            : "Loading..."}
                        </div>
                      </div>
                    </div>
                    <div className="card card-chart">
                      <div className="card-header card-header-info">
                        <h4 className="card-title">Monthly revenue</h4>
                        <p className="card-category">
                          Revenue of the past month
                        </p>
                      </div>
                      <div className="card-body">
                        <h3>
                          {monthlyRevenue.length > 0 ? (
                            <>
                              {monthlyRevenue[
                                monthlyRevenue.length - 1
                              ].revenue.toLocaleString()}
                              M VND
                              {(() => {
                                const currentRevenue =
                                  monthlyRevenue[monthlyRevenue.length - 1]
                                    .revenue;
                                const previousRevenue =
                                  monthlyRevenue[monthlyRevenue.length - 2]
                                    .revenue;
                                const percentChange = (
                                  ((currentRevenue - previousRevenue) /
                                    previousRevenue) *
                                  100
                                ).toFixed(1);
                                const isIncrease =
                                  currentRevenue > previousRevenue;

                                return (
                                  <span
                                    style={{
                                      color: isIncrease ? "#4caf50" : "#f44336",
                                      fontSize: "inherit",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    <i
                                      className="material-icons"
                                      style={{
                                        fontSize: "24px",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      {isIncrease
                                        ? "trending_up"
                                        : "trending_down"}
                                    </i>
                                    {Math.abs(percentChange)}%
                                  </span>
                                );
                              })()}
                            </>
                          ) : (
                            "Loading..."
                          )}
                        </h3>
                      </div>
                      <div class="card-footer">
                        <div class="stats">
                          <i class="material-icons">access_time</i> Last updated{" "}
                          {monthlyRevenue.length > 0
                            ? monthlyRevenue[monthlyRevenue.length - 1].month
                            : "Loading..."}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="card">
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">trending_up</i>
                        </div>
                        <h4 className="card-title">Revenue Trend</h4>
                        <p class="card-category text-muted">
                          Total earnings for the past 12 months.
                        </p>
                      </div>
                      <div className="card-body">
                        <LineChart
                          xAxis={[
                            {
                              scaleType: "point",
                              data: monthlyRevenue.map((item) => item.month),
                            },
                          ]}
                          yAxis={[
                            {
                              width: 25,
                              tickFormatter: (value) => `${value / 1000}M VND`,
                            },
                          ]}
                          series={[
                            {
                              data: monthlyRevenue.map((item) => item.revenue),
                              color: "#d81b60",
                              valueFormatter: (value) =>
                                `${value.toLocaleString()}M VND`,
                            },
                          ]}
                          height={333}
                          width={850}
                          grid={{
                            vertical: true,
                            horizontal: true,
                            strokeDasharray: "3 3",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="card card-chart">
                      <div className="card-header card-header-warning">
                        <h4 className="card-title">Total Customers</h4>
                        <p className="card-category">
                          All registered customers
                        </p>
                      </div>
                      <div className="card-body">
                        <h3>{accounts.length} customer(s)</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">group</i> Total active
                          accounts
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card card-chart">
                      <div className="card-header card-header-success">
                        <h4 className="card-title">New Customers</h4>
                        <p className="card-category">This month</p>
                      </div>
                      <div className="card-body">
                        <h3>
                          {
                            accounts.filter((account) => {
                              const thirtyDaysAgo = new Date();
                              thirtyDaysAgo.setDate(
                                thirtyDaysAgo.getDate() - 30
                              );
                              return (
                                new Date(account.registrationTime) >=
                                thirtyDaysAgo
                              );
                            }).length
                          }{" "}
                          {(() => {
                            const currentMonth = new Date().getMonth();
                            const previousMonth =
                              currentMonth === 0 ? 11 : currentMonth - 1;
                            const currentCount =
                              monthlyAccounts[currentMonth].count;
                            const previousCount =
                              monthlyAccounts[previousMonth].count;

                            const percentChange =
                              previousCount === 0
                                ? 100
                                : (
                                    ((currentCount - previousCount) /
                                      previousCount) *
                                    100
                                  ).toFixed(1);
                            const isIncrease = currentCount >= previousCount;
                            return (
                              <span
                                style={{
                                  color: isIncrease ? "#4caf50" : "#f44336",
                                  fontSize: "inherit",
                                  marginLeft: "10px",
                                }}
                              >
                                <i
                                  className="material-icons"
                                  style={{
                                    fontSize: "24px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  {isIncrease ? "trending_up" : "trending_down"}
                                </i>
                                {Math.abs(percentChange)}%
                              </span>
                            );
                          })()}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">date_range</i> Last 30
                          days
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card card-chart">
                      <div className="card-header card-header-danger">
                        <h4 className="card-title">Total Dogs</h4>
                        <p className="card-category">All registered dogs</p>
                      </div>
                      <div className="card-body">
                        <h3>{dogs.length} dog(s)</h3>{" "}
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">pets</i> Total
                          registered pets
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card card-chart">
                      <div className="card-header card-header-info">
                        <h4 className="card-title">New Dogs</h4>
                        <p className="card-category">This month</p>
                      </div>
                      <div className="card-body">
                        <h3>
                          {
                            dogs.filter((dog) => {
                              const thirtyDaysAgo = new Date();
                              thirtyDaysAgo.setDate(
                                thirtyDaysAgo.getDate() - 30
                              );
                              return (
                                new Date(dog.registrationTime) >= thirtyDaysAgo
                              );
                            }).length
                          }{" "}
                          {(() => {
                            const currentMonth = new Date().getMonth();
                            const previousMonth =
                              currentMonth === 0 ? 11 : currentMonth - 1;
                            const currentCount =
                              monthlyDogs[currentMonth].count;
                            const previousCount =
                              monthlyDogs[previousMonth].count;

                            const percentChange =
                              previousCount === 0
                                ? 100
                                : (
                                    ((currentCount - previousCount) /
                                      previousCount) *
                                    100
                                  ).toFixed(1);
                            const isIncrease = currentCount >= previousCount;

                            return (
                              <span
                                style={{
                                  color: isIncrease ? "#4caf50" : "#f44336",
                                  fontSize: "inherit",
                                  marginLeft: "10px",
                                }}
                              >
                                <i
                                  className="material-icons"
                                  style={{
                                    fontSize: "24px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  {isIncrease ? "trending_up" : "trending_down"}
                                </i>
                                {Math.abs(percentChange)}%
                              </span>
                            );
                          })()}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">date_range</i> Last 30
                          days
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">group</i>
                        </div>
                        <h4 className="card-title">Customer Growth</h4>
                        <p className="card-category text-muted">
                          Total new customers registered in the past 12 months.
                        </p>
                      </div>
                      <div className="card-body">
                        <LineChart
                          xAxis={[
                            {
                              scaleType: "point",
                              data: monthlyAccounts.map((item) => item.month),
                            },
                          ]}
                          series={[
                            {
                              data: monthlyAccounts.map((item) => item.count),
                              color: "#ffa726",
                              valueFormatter: (value) => `${value} customers`,
                            },
                          ]}
                          height={300}
                          width={550}
                          grid={{
                            vertical: true,
                            horizontal: true,
                            strokeDasharray: "3 3",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header card-header-danger card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">pets</i>
                        </div>
                        <h4 className="card-title">Dog Registration</h4>
                        <p className="card-category text-muted">
                          Total new dogs registered in the past 12 months.
                        </p>
                      </div>
                      <div className="card-body">
                        <LineChart
                          xAxis={[
                            {
                              scaleType: "point",
                              data: monthlyDogs.map((item) => item.month),
                            },
                          ]}
                          yAxis={[]}
                          series={[
                            {
                              data: monthlyDogs.map((item) => item.count),
                              color: "#ef5350",
                              valueFormatter: (value) => `${value} dogs`,
                            },
                          ]}
                          height={300}
                          width={550}
                          grid={{
                            vertical: true,
                            horizontal: true,
                            strokeDasharray: "3 3",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">favorite</i>
                        </div>
                        <h4 className="card-title">Top Wishlisted Courses</h4>
                        <p className="card-category text-muted">
                          Most popular courses based on wishlist count
                        </p>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-3">
                          <div className="d-flex gap-3">
                            <CustomSearch
                              value={wishlistSearch}
                              onChange={setWishlistSearch}
                              placeholder="Search courses..."
                              setPage={setWishlistPage}
                            />
                            <CustomFilter
                              value={wishlistFilter}
                              onChange={setWishlistFilter}
                              options={[
                                { value: "all", label: "All Counts" },
                                { value: "high", label: "High (>5)" },
                                { value: "medium", label: "Medium (3-5)" },
                                { value: "low", label: "Low (1-2)" },
                              ]}
                              label="Filter by Count"
                              setPage={setWishlistPage}
                            />
                          </div>
                        </div>
                        <CustomTable
                          columns={[
                            { key: "courseName", label: "Course Name" },
                            {
                              key: "count",
                              label: "Wishlist Count",
                              render: (value) => (
                                <span className="badge badge-info">
                                  {value}
                                </span>
                              ),
                            },
                          ]}
                          data={wishlists
                            .filter((item) => {
                              const matchesSearch = item.courseName
                                .toLowerCase()
                                .includes(wishlistSearch.toLowerCase());

                              const matchesFilter =
                                wishlistFilter === "all"
                                  ? true
                                  : wishlistFilter === "high"
                                    ? item.count > 5
                                    : wishlistFilter === "medium"
                                      ? item.count >= 3 && item.count <= 5
                                      : item.count <= 2;

                              return matchesSearch && matchesFilter;
                            })
                            .slice(
                              wishlistPage * wishlistRowsPerPage,
                              wishlistPage * wishlistRowsPerPage +
                                wishlistRowsPerPage
                            )}
                          page={wishlistPage}
                          rowsPerPage={wishlistRowsPerPage}
                          orderBy="count"
                          order="desc"
                        />
                        <CustomPagination
                          count={
                            wishlists.filter((item) => {
                              const matchesSearch = item.courseName
                                .toLowerCase()
                                .includes(wishlistSearch.toLowerCase());

                              const matchesFilter =
                                wishlistFilter === "all"
                                  ? true
                                  : wishlistFilter === "high"
                                    ? item.count > 5
                                    : wishlistFilter === "medium"
                                      ? item.count >= 3 && item.count <= 5
                                      : item.count <= 2;

                              return matchesSearch && matchesFilter;
                            }).length
                          }
                          rowsPerPage={wishlistRowsPerPage}
                          page={wishlistPage}
                          onPageChange={(_, newPage) =>
                            setWishlistPage(newPage)
                          }
                          onRowsPerPageChange={(e) => {
                            setWishlistRowsPerPage(parseInt(e.target.value));
                            setWishlistPage(0);
                          }}
                        />
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
