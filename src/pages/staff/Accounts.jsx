import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";
import {
  TablePagination,
  TableSortLabel,
  TextField,
  MenuItem,
} from "@mui/material";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import CustomPagination from "../../assets/components/common/CustomPagination";
import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomFilter from "../../assets/components/common/CustomFilter";

import { useNavigate } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";

const Accounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const { loading, setLoading } = useLoading();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("registrationTime");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [counts, setCounts] = useState({
    total: 0,
    admin: 0,
    customers: 0,
    trainers: 0,
    staff: 0,
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewDetails = (account) => {
    const { role } = getRoleAndSubRole(account.roleId);
    switch (role.toLowerCase()) {
      case "customer":
        navigate(`/staff/accounts/customer/details/${account.id}`);
        break;
      case "trainer":
        navigate(`/staff/accounts/trainer/details/${account.id}`);
        break;
      case "staff":
        // Will be implemented later
        alert("Staff details page coming soon");
        break;
      case "admin":
        // Will be implemented later
        alert("Admin details page coming soon");
        break;
      default:
        alert("Unknown role type");
    }
  };

  const getRoleAndSubRole = (roleId) => {
    switch (roleId) {
      case "d1e2f3a4b5c67890d1e2f3a4b5c67890":
        return { role: "Admin", subRole: "-" };
      case "67890d1e2f3a4b5c67890d1e2f3a4b5c":
        return { role: "Staff", subRole: "Manager" };
      case "c67890d1e2f3a4b5c67890d1e2f3a4b5":
        return { role: "Staff", subRole: "Employee" };
      case "f3a4b5c67890d1e2f3a4b5c67890d1e2":
        return { role: "Trainer", subRole: "Lead" };
      case "e2f3a4b5c67890d1e2f3a4b5c67890d1":
        return { role: "Trainer", subRole: "Member" };
      case "a4b5c67890d1e2f3a4b5c67890d1e2f3":
        return { role: "Customer", subRole: "Individual" };
      case "b5c67890d1e2f3a4b5c67890d1e2f3a4":
        return { role: "Customer", subRole: "Organization" };
      default:
        return { role: "Unknown", subRole: "Unknown" };
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    setPage(0); // Reset to first page
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedAccounts = React.useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === "registrationTime") {
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

    return [...accounts]
      .filter((account) => {
        const matchesSearch = Object.values(account).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        const { role } = getRoleAndSubRole(account.roleId);
        const matchesRole =
          roleFilter === "all" || role.toLowerCase() === roleFilter;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "1" && account.status === 1) ||
          (statusFilter === "0" && account.status === 0) ||
          (statusFilter === "-1" && account.status === -1);
        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort(comparator);
  }, [accounts, order, orderBy, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      const startTime = Date.now();

      try {
        const response = await axios.get("/api/accounts");
        const accountsData = response.data;
        setAccounts(accountsData);

        const total = accountsData.length;
        const admin = accountsData.filter(
          (acc) => getRoleAndSubRole(acc.roleId).role === "Admin"
        ).length;
        const customers = accountsData.filter(
          (acc) => getRoleAndSubRole(acc.roleId).role === "Customer"
        ).length;
        const trainers = accountsData.filter(
          (acc) => getRoleAndSubRole(acc.roleId).role === "Trainer"
        ).length;
        const staff = accountsData.filter(
          (acc) => getRoleAndSubRole(acc.roleId).role === "Staff"
        ).length;

        setCounts({ total, admin, customers, trainers, staff });
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case -1:
        return "Disabled";
      case 0:
        return "Inactive";
      case 1:
        return "Active";
      default:
        return "Unknown";
    }
  };

  const getProfileTypeText = (profileType) => {
    switch (profileType) {
      case 1:
        return "Customer";
      case 2:
        return "Trainer";
      case 3:
        return "Staff";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case -1:
        return "text-danger";
      case 0:
        return "text-warning";
      case 1:
        return "text-success";
      default:
        return "";
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
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">group</i>
                        </div>
                        <p className="card-category">Total accounts</p>
                        <h3 className="card-title">{counts.total}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">
                            <span className="material-symbols-outlined">
                              accessibility_new
                            </span>
                          </i>
                        </div>
                        <p className="card-category">Customers</p>
                        <h3 className="card-title">{counts.customers}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-success card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">person_add</i>
                        </div>
                        <p className="card-category">Trainers</p>
                        <h3 className="card-title">{counts.trainers}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">manage_accounts</i>
                        </div>
                        <p className="card-category">Staff</p>
                        <h3 className="card-title">{counts.staff}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <i className="material-icons">update</i> Just Updated
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">groups</i>
                        </div>
                        <h4 className="card-title">Account management</h4>
                        <p class="card-category text-muted">
                          Create new accounts, view account details, and manage
                          their permissions.
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
                                <CustomFilter
                                  value={roleFilter}
                                  onChange={setRoleFilter}
                                  setPage={setPage}
                                  label="Role"
                                  options={[
                                    { value: "all", label: "All Roles" },
                                    { value: "admin", label: "Admin" },
                                    { value: "staff", label: "Staff" },
                                    { value: "trainer", label: "Trainer" },
                                    { value: "customer", label: "Customer" },
                                  ]}
                                />
                                <CustomFilter
                                  value={statusFilter}
                                  onChange={setStatusFilter}
                                  setPage={setPage}
                                  label="Status"
                                  options={[
                                    { value: "all", label: "All Status" },
                                    { value: "1", label: "Active" },
                                    { value: "0", label: "Inactive" },
                                    { value: "-1", label: "Disabled" },
                                  ]}
                                />
                              </div>
                              <button className="btn btn-info">
                                <i className="material-icons">add</i> Create
                                Account
                              </button>
                            </div>
                            <CustomTable
                              columns={[
                                { key: "username", label: "Username" },
                                { key: "email", label: "Email" },
                                { key: "fullName", label: "Full Name" },
                                {
                                  key: "roleId",
                                  label: "Role",
                                  render: (value, row) =>
                                    getRoleAndSubRole(value).role,
                                },
                                {
                                  key: "roleId",
                                  label: "Position",
                                  render: (value, row) =>
                                    getRoleAndSubRole(value).subRole,
                                },
                                {
                                  key: "status",
                                  label: "Status",
                                  render: (value, row) => (
                                    <span className={getStatusClass(value)}>
                                      {getStatusText(value)}
                                    </span>
                                  ),
                                },
                                {
                                  key: "registrationTime",
                                  label: "Registration Date",
                                  render: (value) => formatDate(value),
                                },
                              ]}
                              data={sortedAccounts}
                              page={page}
                              rowsPerPage={rowsPerPage}
                              orderBy={orderBy}
                              order={order}
                              onSort={handleSort}
                              renderActions={(row) => (
                                <button
                                  type="button"
                                  rel="tooltip"
                                  className="btn btn-info btn-sm"
                                  data-original-title="View Details"
                                  title="View Details"
                                  onClick={() => handleViewDetails(row)}
                                >
                                  <i className="material-icons">more_vert</i>
                                </button>
                              )}
                            />
                            <CustomPagination
                              count={sortedAccounts.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={(e) =>
                                handleChangeRowsPerPage(e)
                              }
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

export default Accounts;
