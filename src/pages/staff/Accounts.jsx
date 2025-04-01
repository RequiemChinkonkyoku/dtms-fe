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

import { useNavigate } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";

const Accounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const { loading, setLoading } = useLoading();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("username");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [counts, setCounts] = useState({
    total: 0,
    admin: 0,
    customers: 0,
    trainers: 0,
    staff: 0,
  });

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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Add sorting function
  const sortedAccounts = React.useMemo(() => {
    const comparator = (a, b) => {
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
        return matchesSearch && matchesRole;
      })
      .sort(comparator);
  }, [accounts, order, orderBy, searchTerm, roleFilter]);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      const startTime = Date.now();

      try {
        const response = await axios.get("/api/accounts");
        const accountsData = response.data;
        setAccounts(accountsData);

        // Calculate counts based on roles
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
                                <TextField
                                  label="Search..."
                                  variant="outlined"
                                  size="small"
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                />
                                <TextField
                                  select
                                  label="Role"
                                  value={roleFilter}
                                  onChange={(e) =>
                                    setRoleFilter(e.target.value)
                                  }
                                  variant="outlined"
                                  size="small"
                                  style={{ minWidth: "120px" }}
                                >
                                  <MenuItem value="all">All Roles</MenuItem>
                                  <MenuItem value="admin">Admin</MenuItem>
                                  <MenuItem value="staff">Staff</MenuItem>
                                  <MenuItem value="trainer">Trainer</MenuItem>
                                  <MenuItem value="customer">Customer</MenuItem>
                                </TextField>
                              </div>
                              <button className="btn btn-info">
                                <i className="material-icons">add</i> Create
                                Account
                              </button>
                            </div>
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th className="text-center">#</th>
                                  {[
                                    ["username", "Username"],
                                    ["email", "Email"],
                                    ["fullName", "Full Name"],
                                    ["roleId", "Role"],
                                    ["subRole", "Position"],
                                    ["status", "Status"],
                                  ].map(([key, label]) => (
                                    <th key={key}>
                                      <TableSortLabel
                                        active={orderBy === key}
                                        direction={
                                          orderBy === key ? order : "asc"
                                        }
                                        onClick={() => handleSort(key)}
                                      >
                                        {label}
                                      </TableSortLabel>
                                    </th>
                                  ))}
                                  <th className="text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sortedAccounts
                                  .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                  .map((account, index) => {
                                    const { role, subRole } = getRoleAndSubRole(
                                      account.roleId
                                    );
                                    return (
                                      <tr key={account.id}>
                                        <td className="text-center">
                                          {page * rowsPerPage + index + 1}
                                        </td>
                                        <td>{account.username}</td>
                                        <td>{account.email}</td>
                                        <td>{account.fullName}</td>
                                        <td>{role}</td>
                                        <td>{subRole}</td>
                                        <td
                                          className={getStatusClass(
                                            account.status
                                          )}
                                        >
                                          {getStatusText(account.status)}
                                        </td>
                                        <td className="td-actions text-right">
                                          <button
                                            type="button"
                                            rel="tooltip"
                                            className="btn btn-info btn-sm"
                                            data-original-title="View Details"
                                            title="View Details"
                                            onClick={() =>
                                              handleViewDetails(account)
                                            }
                                          >
                                            <i className="material-icons">
                                              more_vert
                                            </i>
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25]}
                              component="div"
                              count={sortedAccounts.length}
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

export default Accounts;
