import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/staff/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/staff/Navbar";
import CustomPagination from "../../assets/components/common/CustomPagination";
import CustomTable from "../../assets/components/common/CustomTable";
import CustomSearch from "../../assets/components/common/CustomSearch";
import CustomFilter from "../../assets/components/common/CustomFilter";
import { Modal, TextField, Select, MenuItem, Dialog } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";
import { softDelay } from "../../utils/softDelay";
import { showToast } from "../../utils/toastConfig";

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
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [documentPage, setDocumentPage] = useState(0);
  const [documentRowsPerPage, setDocumentRowsPerPage] = useState(5);
  const [documentOrderBy, setDocumentOrderBy] = useState("latestTime");
  const [documentOrder, setDocumentOrder] = useState("desc");
  const [documentSearchTerm, setDocumentSearchTerm] = useState("");
  const [customerDetails, setCustomerDetails] = useState({});
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    roleName: "",
    imageUrl:
      "https://res.cloudinary.com/djy6ydaxz/image/upload/v1744168717/waccatxqnji44dxgwxhf.png",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const handleCreate = async () => {
    try {
      const response = await axios.post("/api/accounts", createFormData);
      if (response.data.success) {
        // Close modal first
        setOpenCreateModal(false);

        // Reset form
        setCreateFormData({
          username: "",
          email: "",
          password: "",
          fullName: "",
          phoneNumber: "",
          address: "",
          dateOfBirth: "",
          gender: "",
          roleName: "",
          imageUrl:
            "https://res.cloudinary.com/djy6ydaxz/image/upload/v1744168717/waccatxqnji44dxgwxhf.png",
        });

        // Show success message
        showToast.success("Account created successfully!");

        // Reload the accounts list
        await fetchAccounts();
      }
    } catch (error) {
      console.error("Error creating account:", error);
      showToast.error("Failed to create account");
    }
  };

  const validateForm = (formData = createFormData) => {
    const errors = {};

    if (accounts.some((acc) => acc.username === formData.username)) {
      errors.username = "Username already exists";
    }

    if (accounts.some((acc) => acc.email === formData.email)) {
      errors.email = "Email already exists";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Password must be at least 8 characters with 1 uppercase, 1 special character, and 1 number";
    }

    const phoneRegex = /^\d{9,11}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be between 9-11 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      year: "numeric",
    })
  );

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
      // Handle virtual columns
      if (orderBy === "role") {
        const roleA = getRoleAndSubRole(a.roleId).role;
        const roleB = getRoleAndSubRole(b.roleId).role;
        return order === "asc"
          ? roleA.localeCompare(roleB)
          : roleB.localeCompare(roleA);
      }
      if (orderBy === "position") {
        const posA = getRoleAndSubRole(a.roleId).subRole;
        const posB = getRoleAndSubRole(b.roleId).subRole;
        return order === "asc"
          ? posA.localeCompare(posB)
          : posB.localeCompare(posA);
      }
      // Default sorting for other columns
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

      try {
        const response = await axios.get("/api/accounts");
        const accountsData = response.data.filter(
          (acc) => acc.roleId !== "d1e2f3a4b5c67890d1e2f3a4b5c67890"
        );
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
        await softDelay();
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
      case 2:
        return "Deactivated";
      case 0:
        return "Inactive";
      case 1:
        return "Active";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 2:
        return "text-danger";
      case 0:
        return "text-warning";
      case 1:
        return "text-success";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchLegalDocuments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/legalDocument");
        if (response.data.success) {
          const documents = response.data.objectList;

          const customerDocuments = documents
            .filter((doc) => doc.status === 0)
            .reduce((acc, doc) => {
              const existing = acc.find((item) => item[0] === doc.customerId);
              if (existing) {
                existing[1]++;
                if (new Date(doc.createdTime) > new Date(existing[2])) {
                  existing[2] = doc.createdTime;
                }
              } else {
                acc.push([doc.customerId, 1, doc.createdTime]);
              }
              return acc;
            }, []);

          setPendingDocuments(customerDocuments);
        }
        await softDelay();
      } catch (error) {
        console.error("Error fetching legal documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLegalDocuments();
  }, []);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoading(true);
      try {
        const promises = pendingDocuments.map(([customerId]) =>
          axios.get(`/api/accounts/${customerId}`)
        );
        const responses = await Promise.all(promises);
        const details = {};
        responses.forEach((response, index) => {
          const customerId = pendingDocuments[index][0];
          details[customerId] = response.data;
        });
        setCustomerDetails(details);
        await softDelay();
      } catch (error) {
        console.error("Error fetching customer details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pendingDocuments.length > 0) {
      fetchCustomerDetails();
    }
  }, [pendingDocuments]);

  const handleDocumentSort = (property) => {
    const isAsc = documentOrderBy === property && documentOrder === "asc";
    setDocumentOrder(isAsc ? "desc" : "asc");
    setDocumentOrderBy(property);
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
                          <i className="material-icons">calendar_today</i> Last
                          updated {currentDate}
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
                          <i className="material-icons">calendar_today</i> Last
                          updated {currentDate}
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
                          <i className="material-icons">calendar_today</i> Last
                          updated {currentDate}
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
                          <i className="material-icons">calendar_today</i> Last
                          updated {currentDate}
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
                          Create new accounts, view user details, and manage
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
                                    { value: "2", label: "Deactivated" },
                                  ]}
                                />
                              </div>
                              <button
                                className="btn btn-info"
                                onClick={() => setOpenCreateModal(true)}
                              >
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
                                  key: "role",
                                  label: "Role",
                                  render: (value, row) =>
                                    getRoleAndSubRole(row.roleId).role,
                                },
                                {
                                  key: "position",
                                  label: "Position",
                                  render: (value, row) =>
                                    getRoleAndSubRole(row.roleId).subRole,
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
                              renderActions={(row) => {
                                // Don't show action button for Staff Manager and Staff Employee
                                if (
                                  row.roleId ===
                                    "67890d1e2f3a4b5c67890d1e2f3a4b5c" ||
                                  row.roleId ===
                                    "c67890d1e2f3a4b5c67890d1e2f3a4b5"
                                ) {
                                  return null;
                                }
                                return (
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
                                );
                              }}
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
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">description</i>
                        </div>
                        <h4 className="card-title">Pending Legal Documents</h4>
                        <p className="card-category text-muted">
                          Documents requiring review and approval.
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
                                value={documentSearchTerm}
                                onChange={setDocumentSearchTerm}
                                placeholder="Search customer..."
                                setPage={setDocumentPage}
                              />
                            </div>
                            <CustomTable
                              columns={[
                                {
                                  key: "username",
                                  label: "Username",
                                  render: (value, row) =>
                                    customerDetails[row.customerId]?.username ||
                                    "Loading...",
                                },
                                {
                                  key: "fullName",
                                  label: "Full Name",
                                  render: (value, row) =>
                                    customerDetails[row.customerId]?.fullName ||
                                    "Loading...",
                                },
                                {
                                  key: "count",
                                  label: "Pending Documents",
                                  render: (value) => `${value} document(s)`,
                                },
                                {
                                  key: "latestTime",
                                  label: "Latest Submission",
                                  render: (value) =>
                                    new Date(value).toLocaleString(),
                                },
                              ]}
                              data={pendingDocuments
                                .filter((doc) => {
                                  const customer = customerDetails[doc[0]];
                                  if (!customer) return true; // Show while loading
                                  return (
                                    customer.username
                                      .toLowerCase()
                                      .includes(
                                        documentSearchTerm.toLowerCase()
                                      ) ||
                                    customer.fullName
                                      .toLowerCase()
                                      .includes(
                                        documentSearchTerm.toLowerCase()
                                      )
                                  );
                                })
                                .map(([customerId, count, latestTime]) => ({
                                  customerId,
                                  count,
                                  latestTime,
                                }))}
                              page={documentPage}
                              rowsPerPage={documentRowsPerPage}
                              orderBy={documentOrderBy}
                              order={documentOrder}
                              onSort={handleDocumentSort}
                              renderActions={(row) => (
                                <button
                                  type="button"
                                  rel="tooltip"
                                  className="btn btn-info btn-sm"
                                  data-original-title="View Details"
                                  title="View Details"
                                  onClick={() =>
                                    navigate(
                                      `/staff/accounts/customer/details/${row.customerId}`
                                    )
                                  }
                                >
                                  <i className="material-icons">more_vert</i>
                                </button>
                              )}
                            />
                            <CustomPagination
                              count={pendingDocuments.length}
                              rowsPerPage={documentRowsPerPage}
                              page={documentPage}
                              onPageChange={(e, newPage) =>
                                setDocumentPage(newPage)
                              }
                              onRowsPerPageChange={(e) => {
                                setDocumentRowsPerPage(
                                  parseInt(e.target.value, 10)
                                );
                                setDocumentPage(0);
                              }}
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
      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        aria-labelledby="create-account-modal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <h3>Create New Account</h3>
          <TextField
            fullWidth
            label="Username"
            value={createFormData.username}
            onChange={(e) => {
              const newFormData = {
                ...createFormData,
                username: e.target.value,
              };
              setCreateFormData(newFormData);
              validateForm(newFormData);
            }}
            margin="normal"
            required
            error={!!formErrors.username}
            helperText={formErrors.username}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={createFormData.email}
            onChange={(e) => {
              const newFormData = { ...createFormData, email: e.target.value };
              setCreateFormData(newFormData);
              validateForm(newFormData);
            }}
            margin="normal"
            required
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={createFormData.password}
            onChange={(e) => {
              const newFormData = {
                ...createFormData,
                password: e.target.value,
              };
              setCreateFormData(newFormData);
              validateForm(newFormData);
            }}
            margin="normal"
            required
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
          <TextField
            fullWidth
            label="Full Name"
            value={createFormData.fullName}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, fullName: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={createFormData.phoneNumber}
            onChange={(e) => {
              const newFormData = {
                ...createFormData,
                phoneNumber: e.target.value,
              };
              setCreateFormData(newFormData);
              validateForm(newFormData);
            }}
            margin="normal"
            required
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber}
          />
          <TextField
            fullWidth
            label="Address"
            value={createFormData.address}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, address: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="date"
            label="Date of Birth"
            value={createFormData.dateOfBirth}
            onChange={(e) =>
              setCreateFormData({
                ...createFormData,
                dateOfBirth: e.target.value,
              })
            }
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: new Date().toISOString().split("T")[0], // Sets max date to today
            }}
          />
          <Select
            fullWidth
            value={createFormData.gender}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, gender: e.target.value })
            }
            margin="normal"
            style={{ marginTop: "16px" }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Gender
            </MenuItem>
            <MenuItem value={0}>Male</MenuItem>
            <MenuItem value={1}>Female</MenuItem>
          </Select>
          <Select
            fullWidth
            value={createFormData.roleName}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, roleName: e.target.value })
            }
            margin="normal"
            style={{ marginTop: "16px" }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Role
            </MenuItem>
            <MenuItem value="Staff_Manager">Staff_Manager</MenuItem>
            <MenuItem value="Staff_Employee">Staff_Employee</MenuItem>
            <MenuItem value="Trainer_Lead">Trainer_Lead</MenuItem>
            <MenuItem value="Trainer_Member">Trainer_Member</MenuItem>
            <MenuItem value="Customer_Individual">Customer_Individual</MenuItem>
            <MenuItem value="Customer_Organizational">
              Customer_Organization
            </MenuItem>
          </Select>
          <div style={{ marginTop: "20px" }}>
            <button
              className="btn btn-info"
              onClick={handleCreate}
              disabled={
                !createFormData.username ||
                !createFormData.email ||
                !createFormData.password ||
                !createFormData.fullName ||
                !createFormData.phoneNumber ||
                !createFormData.address ||
                !createFormData.dateOfBirth ||
                createFormData.gender === "" || // Changed this line
                !createFormData.roleName ||
                Object.keys(formErrors).length > 0
              }
            >
              Create
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => setOpenCreateModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Accounts;
