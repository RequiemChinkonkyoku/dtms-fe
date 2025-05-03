import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import { Link } from "react-router-dom";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import { useLoading } from "../../contexts/LoadingContext";
import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomPagination from "../../assets/components/common/CustomPagination";
import CustomFilter from "../../assets/components/common/CustomFilter";

const StaffTransactions = () => {
  const { loading, setLoading } = useLoading();
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("paymentTime");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/transactions");
        if (response.data.success) {
          setTransactions(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [setLoading]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = transactions
    .filter((transaction) =>
      Object.values(transaction).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (orderBy === "paymentTime") {
        return order === "asc"
          ? new Date(a[orderBy]) - new Date(b[orderBy])
          : new Date(b[orderBy]) - new Date(a[orderBy]);
      }
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });

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
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">receipt</i>
                        </div>
                        <h4 className="card-title">Transactions</h4>
                        <p className="card-category text-muted">
                          View and manage transaction records
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
                              <CustomSearch
                                value={searchTerm}
                                onChange={setSearchTerm}
                                setPage={setPage}
                                placeholder="Search transactions..."
                              />
                            </div>
                            <CustomTable
                              columns={[
                                { key: "paymentId", label: "Payment ID" },
                                { key: "dogName", label: "Dog Name" },
                                { key: "courseName", label: "Course" },
                                { key: "className", label: "Class" },
                                {
                                  key: "totalAmount",
                                  label: "Amount",
                                  render: (value) =>
                                    value.toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }),
                                },
                                {
                                  key: "paymentTime",
                                  label: "Payment Time",
                                  render: (value) =>
                                    new Date(value).toLocaleString("en-GB", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }),
                                },
                              ]}
                              data={filteredData}
                              page={page}
                              rowsPerPage={rowsPerPage}
                              orderBy={orderBy}
                              order={order}
                              onSort={handleSort}
                            />
                            <CustomPagination
                              count={filteredData.length}
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
        </div>
      </body>
    </>
  );
};

export default StaffTransactions;
