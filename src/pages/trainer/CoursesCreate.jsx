import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import Swal from "sweetalert2";
import "../../assets/css/material-dashboard.min.css";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import Loader from "../../assets/components/common/Loader";
import Sidebar from "../../assets/components/trainer/Sidebar";
import Head from "../../assets/components/common/Head";
import Navbar from "../../assets/components/trainer/Navbar";

import { useLoading } from "../../contexts/LoadingContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const TrainerCoursesCreate = () => {
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();
  const [complexity, setComplexity] = useState(1);
  const [complexityHover, setComplexityHover] = useState(-1);
  const [openLessonModal, setOpenLessonModal] = useState(false);
  const [openBreedModal, setOpenBreedModal] = useState(false);
  const [openPrereqModal, setOpenPrereqModal] = useState(false);
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [lessonPage, setLessonPage] = useState(0);
  const [lessonRowsPerPage, setLessonRowsPerPage] = useState(5);
  const [lessonOrderBy, setLessonOrderBy] = useState("lessonTitle");
  const [lessonOrder, setLessonOrder] = useState("asc");
  const [lessonSearchTerm, setLessonSearchTerm] = useState("");
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [breedPage, setBreedPage] = useState(0);
  const [breedRowsPerPage, setBreedRowsPerPage] = useState(5);
  const [breedOrderBy, setBreedOrderBy] = useState("name");
  const [breedOrder, setBreedOrder] = useState("asc");
  const [breedSearchTerm, setBreedSearchTerm] = useState("");
  const [prerequisites, setPrerequisites] = useState([]);
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);
  const [prereqPage, setPrereqPage] = useState(0);
  const [prereqRowsPerPage, setPrereqRowsPerPage] = useState(5);
  const [prereqOrderBy, setPrereqOrderBy] = useState("name");
  const [prereqOrder, setPrereqOrder] = useState("asc");
  const [prereqSearchTerm, setPrereqSearchTerm] = useState("");
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    durationInWeeks: 1,
    daysPerWeek: 1,
    slotsPerDay: 1,
    price: 0,
    minTrainers: 1,
    maxTrainers: 1,
    complexity: 1,
    categoryId: "",
    lessons: [],
    breeds: [],
    prerequisites: [],
  });
  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = {
      name: "Course Name",
      description: "Description",
      categoryId: "Category",
      durationInWeeks: "Duration",
      daysPerWeek: "Days per Week",
      slotsPerDay: "Slots per Day",
      price: "Price",
      minTrainers: "Min Trainers",
      maxTrainers: "Max Trainers",
    };

    const missingFields = Object.entries(requiredFields).filter(
      ([key]) => !formData[key]
    );

    if (selectedLessons.length === 0) {
      missingFields.push(["lessons", "Lessons"]);
    }
    if (selectedBreeds.length === 0) {
      missingFields.push(["breeds", "Dog Breeds"]);
    }

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Required Fields Missing",
        html: `Please fill in the following fields:<br/><br/>
          ${missingFields.map(([_, label]) => `- ${label}`).join("<br/>")}`,
      });

      missingFields.forEach(([key]) => {
        const element = document.querySelector(`[name="${key}"]`);
        if (element) {
          element.style.border = "1px solid red";
          element.addEventListener(
            "input",
            function () {
              this.style.border = "";
            },
            { once: true }
          );
        }
      });

      return;
    }

    try {
      Swal.fire({
        title: "Creating course...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let imageUrl = "";
      if (courseImage) {
        const formData = new FormData();
        formData.append("file", courseImage);
        const uploadResponse = await axios.post("/api/uploadFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrl = uploadResponse.data;
      }

      const courseData = {
        ...formData,
        status: 0,
        imageUrl,
        minDogs: 1,
        maxDogs: 5,
        createdTrainerId: user.unique_name,
        lessonIds: selectedLessons,
        dogBreedIds: selectedBreeds,
      };

      const courseResponse = await axios.post("/api/courses", courseData);
      if (courseResponse.data.success) {
        const courseId = courseResponse.data.object.id;
        for (const prerequisiteCourseId of selectedPrereqs) {
          await axios.post("/api/prerequisites", {
            courseId: courseId,
            prerequisiteCourseId: prerequisiteCourseId,
          });
        }

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Course created successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/trainer/courses");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to create course",
      });
      console.error("Error creating course:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.data.success && response.data.objectList) {
          setCategories(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectPrereq = (prereqId) => {
    setSelectedPrereqs((prev) =>
      prev.includes(prereqId)
        ? prev.filter((id) => id !== prereqId)
        : [...prev, prereqId]
    );
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCourseImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    const fetchPrerequisites = async () => {
      try {
        const response = await axios.get("api/courses");
        if (response.data.success && response.data.objectList) {
          setPrerequisites(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching prerequisites:", error);
      }
    };

    fetchPrerequisites();
  }, []);

  const handlePrereqSort = (property) => {
    const isAsc = prereqOrderBy === property && prereqOrder === "asc";
    setPrereqOrder(isAsc ? "desc" : "asc");
    setPrereqOrderBy(property);
  };

  const sortedPrereqs = React.useMemo(() => {
    const comparator = (a, b) => {
      if (prereqOrder === "asc") {
        return a[prereqOrderBy] < b[prereqOrderBy] ? -1 : 1;
      } else {
        return b[prereqOrderBy] < a[prereqOrderBy] ? -1 : 1;
      }
    };

    return [...prerequisites]
      .filter((prereq) =>
        prereq.name.toLowerCase().includes(prereqSearchTerm.toLowerCase())
      )
      .sort(comparator);
  }, [prerequisites, prereqOrder, prereqOrderBy, prereqSearchTerm]);

  const handleSelectBreed = (breedId) => {
    setSelectedBreeds((prev) =>
      prev.includes(breedId)
        ? prev.filter((id) => id !== breedId)
        : [...prev, breedId]
    );
  };

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get("api/dogBreeds");
        if (response.data) {
          setBreeds(response.data);
        }
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };

    fetchBreeds();
  }, []);

  const handleBreedSort = (property) => {
    const isAsc = breedOrderBy === property && breedOrder === "asc";
    setBreedOrder(isAsc ? "desc" : "asc");
    setBreedOrderBy(property);
  };

  const sortedBreeds = React.useMemo(() => {
    const comparator = (a, b) => {
      if (breedOrder === "asc") {
        return a[breedOrderBy] < b[breedOrderBy] ? -1 : 1;
      } else {
        return b[breedOrderBy] < a[breedOrderBy] ? -1 : 1;
      }
    };

    return [...breeds]
      .filter((breed) =>
        breed.name.toLowerCase().includes(breedSearchTerm.toLowerCase())
      )
      .sort(comparator);
  }, [breeds, breedOrder, breedOrderBy, breedSearchTerm]);

  const handleSelectLesson = (lessonId) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get("api/lessons");
        if (response.data.success && response.data.objectList) {
          setLessons(response.data.objectList);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const complexityLabels = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
    4: "Expert",
    5: "Master",
  };

  const handleLessonSort = (property) => {
    const isAsc = lessonOrderBy === property && lessonOrder === "asc";
    setLessonOrder(isAsc ? "desc" : "asc");
    setLessonOrderBy(property);
  };

  const sortedLessons = React.useMemo(() => {
    const comparator = (a, b) => {
      if (lessonOrder === "asc") {
        return a[lessonOrderBy] < b[lessonOrderBy] ? -1 : 1;
      } else {
        return b[lessonOrderBy] < a[lessonOrderBy] ? -1 : 1;
      }
    };

    return [...lessons]
      .filter((lesson) =>
        lesson.lessonTitle
          .toLowerCase()
          .includes(lessonSearchTerm.toLowerCase())
      )
      .sort(comparator);
  }, [lessons, lessonOrder, lessonOrderBy, lessonSearchTerm]);

  return (
    <>
      <Head />
      <body>
        <div className="pattern-background" />
        <div class="wrapper">
          <Sidebar />
          <div class="main-panel ps-container ps-theme-default">
            <Navbar />
            <div class="content">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-9">
                    <div class="card">
                      <div class="card-header card-header-info">
                        <h4 class="card-title">Create a new course</h4>
                        <p class="card-category">Enter the basic information</p>
                      </div>
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-8">
                            <div class="form-group">
                              <label class="bmd-label-floating">
                                Course Name{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                name="name"
                                class="form-control"
                                value={formData.name}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group">
                              <label class="bmd-label-floating">
                                Category <span style={{ color: "red" }}>*</span>
                              </label>
                              <FormControl
                                sx={{ mt: 0.3 }}
                                fullWidth
                                variant="standard"
                              >
                                <Select
                                  labelId="category-select-label"
                                  id="category-select"
                                  name="categoryId"
                                  value={formData.categoryId}
                                  label="Category"
                                  onChange={handleInputChange}
                                  class="form-control"
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {categories.map((category) => (
                                    <MenuItem
                                      key={category.id}
                                      value={category.id}
                                    >
                                      {category.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card">
                      <div class="card-header card-header-primary">
                        <h4 class="card-title">
                          Course Lessons <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                      <div class="card-body">
                        <button
                          type="button"
                          class="btn btn-primary btn-block"
                          onClick={() => setOpenLessonModal(true)}
                        >
                          <i class="material-icons">add</i> Add Lesson
                          {selectedLessons.length > 0 &&
                            ` (${selectedLessons.length} chosen)`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-9">
                    <div class="card">
                      <div class="card-header card-header-primary">
                        <h4 class="card-title">Course Details</h4>
                        <p class="card-category">Fill in the course details</p>
                      </div>
                      <div class="card-body">
                        <div class="form-group">
                          <label>
                            Description <span style={{ color: "red" }}>*</span>
                          </label>
                          <textarea
                            name="description"
                            class="form-control"
                            rows="5"
                            value={formData.description}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                        <div class="row mt-4">
                          <div class="col-md-4">
                            <div class="form-group">
                              <label>
                                Duration (weeks){" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="number"
                                name="durationInWeeks"
                                class="form-control"
                                min="1"
                                value={formData.durationInWeeks}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group">
                              <label>
                                Days per Week{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="number"
                                name="daysPerWeek"
                                class="form-control"
                                min="1"
                                max="7"
                                value={formData.daysPerWeek}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group">
                              <label>
                                Slots per Day{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="number"
                                name="slotsPerDay"
                                class="form-control"
                                min="1"
                                max="4"
                                value={formData.slotsPerDay}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div class="row mt-4">
                          <div class="col-md-4">
                            <div class="form-group">
                              <label>
                                Min Trainers{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="number"
                                name="minTrainers"
                                class="form-control"
                                min="1"
                                value={formData.minTrainers}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group">
                              <label>
                                Max Trainers{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="number"
                                name="maxTrainers"
                                class="form-control"
                                min="1"
                                value={formData.maxTrainers}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group">
                              <label>
                                Complexity{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  height: "36px",
                                }}
                              >
                                <Rating
                                  name="complexity"
                                  value={complexity}
                                  precision={1}
                                  max={5}
                                  onChange={(event, newValue) => {
                                    setComplexity(newValue);
                                    setFormData((prev) => ({
                                      ...prev,
                                      complexity: newValue,
                                    }));
                                  }}
                                  onChangeActive={(event, newHover) => {
                                    setComplexityHover(newHover);
                                  }}
                                  icon={
                                    <StarIcon
                                      style={{
                                        fontSize: "2rem",
                                        color: "#ffd700",
                                      }}
                                    />
                                  }
                                  emptyIcon={
                                    <StarIcon
                                      style={{ opacity: 0.6, fontSize: "2rem" }}
                                    />
                                  }
                                  sx={{
                                    fontSize: "2rem",
                                    marginTop: "4px",
                                    "& .MuiRating-iconHover": {
                                      color: "#ffd700",
                                    },
                                  }}
                                />
                                {complexity !== null && (
                                  <Box sx={{ ml: 2, fontSize: "1rem" }}>
                                    {
                                      complexityLabels[
                                        complexityHover !== -1
                                          ? complexityHover
                                          : complexity
                                      ]
                                    }
                                  </Box>
                                )}
                              </Box>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-4">
                          <div class="col-md-4">
                            <div class="form-group">
                              <label>
                                Price (VND){" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <div class="input-group">
                                <input
                                  type="number"
                                  name="price"
                                  class="form-control"
                                  min="0"
                                  step="1000"
                                  value={formData.price}
                                  onChange={handleInputChange}
                                />
                                <div class="input-group-prepend">
                                  <span class="input-group-text">VND</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-4">
                          <div class="col-md-12">
                            <div class="form-group">
                              <label>
                                Course Image{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "16px",
                                  }}
                                >
                                  <Button
                                    component="label"
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                  >
                                    Upload Image
                                    <VisuallyHiddenInput
                                      type="file"
                                      onChange={handleImageUpload}
                                      accept="image/*"
                                    />
                                  </Button>
                                  {courseImage && (
                                    <span className="text-muted">
                                      {courseImage.name}
                                    </span>
                                  )}
                                </div>
                                {imagePreview && (
                                  <div>
                                    <img
                                      src={imagePreview}
                                      alt="Course preview"
                                      style={{
                                        maxWidth: "200px",
                                        maxHeight: "200px",
                                        objectFit: "contain",
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
                    <div class="row mt-3">
                      <div class="col-12 text-right">
                        <button
                          type="button"
                          class="btn btn-primary"
                          onClick={handleSubmit}
                        >
                          <i class="material-icons">save</i> Create Course
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card">
                      <div class="card-header card-header-primary">
                        <h4 class="card-title">
                          Suitable Dog Breeds{" "}
                          <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                      <div class="card-body">
                        <button
                          type="button"
                          class="btn btn-primary btn-block"
                          onClick={() => setOpenBreedModal(true)}
                        >
                          <i class="material-icons">pets</i> Add Breeds
                          {selectedBreeds.length > 0 &&
                            ` (${selectedBreeds.length} chosen)`}
                        </button>
                      </div>
                    </div>
                    <br />
                    <div class="card mt-4">
                      <div class="card-header card-header-primary">
                        <h4 class="card-title">Prerequisite Courses</h4>
                      </div>
                      <div class="card-body">
                        <button
                          type="button"
                          class="btn btn-primary btn-block"
                          onClick={() => setOpenPrereqModal(true)}
                        >
                          <i class="material-icons">library_books</i> Add
                          Courses
                          {selectedPrereqs.length > 0 &&
                            ` (${selectedPrereqs.length} chosen)`}
                        </button>
                      </div>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={openLessonModal}
          onClose={() => setOpenLessonModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add Course Lesson</DialogTitle>
          <DialogContent>
            {loading ? (
              <div className="text-center p-4">
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
                      label="Search lesson..."
                      variant="outlined"
                      size="small"
                      value={lessonSearchTerm}
                      onChange={(e) => setLessonSearchTerm(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        window.open("/trainer/lessons/create", "_blank")
                      }
                    >
                      <i className="material-icons">add</i> Create New Lesson
                    </Button>
                  </div>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const response = await axios.get("api/lessons");
                        if (response.data.success && response.data.objectList) {
                          setLessons(response.data.objectList);
                        }
                      } catch (error) {
                        console.error("Error fetching lessons:", error);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <i className="material-icons">refresh</i> Refresh
                  </Button>
                </div>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={
                            sortedLessons.length > 0 &&
                            sortedLessons.every((lesson) =>
                              selectedLessons.includes(lesson.id)
                            )
                          }
                          onChange={() => {
                            const allSelected =
                              sortedLessons.length > 0 &&
                              sortedLessons.every((lesson) =>
                                selectedLessons.includes(lesson.id)
                              );
                            setSelectedLessons(
                              allSelected
                                ? []
                                : sortedLessons.map((lesson) => lesson.id)
                            );
                          }}
                        />
                      </th>
                      {[
                        ["lessonTitle", "Title"],
                        ["environment", "Environment"],
                        ["duration", "Duration (slots)"],
                      ].map(([key, label]) => (
                        <th key={key}>
                          <TableSortLabel
                            active={lessonOrderBy === key}
                            direction={
                              lessonOrderBy === key ? lessonOrder : "asc"
                            }
                            onClick={() => handleLessonSort(key)}
                          >
                            {label}
                          </TableSortLabel>
                        </th>
                      ))}
                      <th class="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLessons
                      .slice(
                        lessonPage * lessonRowsPerPage,
                        lessonPage * lessonRowsPerPage + lessonRowsPerPage
                      )
                      .map((lesson) => (
                        <tr key={lesson.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedLessons.includes(lesson.id)}
                              onChange={() => handleSelectLesson(lesson.id)}
                            />
                          </td>
                          <td>{lesson.lessonTitle}</td>
                          <td>{lesson.environment}</td>
                          <td>{lesson.duration}</td>
                          <td className="td-actions text-right">
                            <button
                              type="button"
                              rel="tooltip"
                              className="btn btn-info btn-sm mr-2"
                              onClick={() => handleSelectLesson(lesson.id)}
                            >
                              <i className="material-icons">
                                {selectedLessons.includes(lesson.id)
                                  ? "remove"
                                  : "add"}
                              </i>
                            </button>
                            <button
                              type="button"
                              rel="tooltip"
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                console.log(
                                  "View details of lesson:",
                                  lesson.id
                                );
                              }}
                            >
                              <i className="material-icons">info</i>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={sortedLessons.length}
                  rowsPerPage={lessonRowsPerPage}
                  page={lessonPage}
                  onPageChange={(event, newPage) => setLessonPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setLessonRowsPerPage(parseInt(event.target.value, 10));
                    setLessonPage(0);
                  }}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  lessons: selectedLessons,
                }));
                setOpenLessonModal(false);
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openBreedModal}
          onClose={() => setOpenBreedModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add Dog Breeds</DialogTitle>
          <DialogContent>
            {loading ? (
              <div className="text-center p-4">
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
                  <TextField
                    label="Search breed..."
                    variant="outlined"
                    size="small"
                    value={breedSearchTerm}
                    onChange={(e) => setBreedSearchTerm(e.target.value)}
                  />
                </div>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={
                            sortedBreeds.length > 0 &&
                            sortedBreeds.every((breed) =>
                              selectedBreeds.includes(breed.id)
                            )
                          }
                          onChange={() => {
                            const allSelected =
                              sortedBreeds.length > 0 &&
                              sortedBreeds.every((breed) =>
                                selectedBreeds.includes(breed.id)
                              );
                            setSelectedBreeds(
                              allSelected
                                ? []
                                : sortedBreeds.map((breed) => breed.id)
                            );
                          }}
                        />
                      </th>
                      <th>
                        <TableSortLabel
                          active={breedOrderBy === "name"}
                          direction={
                            breedOrderBy === "name" ? breedOrder : "asc"
                          }
                          onClick={() => handleBreedSort("name")}
                        >
                          Name
                        </TableSortLabel>
                      </th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBreeds
                      .slice(
                        breedPage * breedRowsPerPage,
                        breedPage * breedRowsPerPage + breedRowsPerPage
                      )
                      .map((breed) => (
                        <tr key={breed.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedBreeds.includes(breed.id)}
                              onChange={() => handleSelectBreed(breed.id)}
                            />
                          </td>
                          <td>{breed.name}</td>
                          <td className="td-actions text-right">
                            <button
                              type="button"
                              rel="tooltip"
                              className="btn btn-info btn-sm mr-2"
                              onClick={() => handleSelectBreed(breed.id)}
                            >
                              <i className="material-icons">
                                {selectedBreeds.includes(breed.id)
                                  ? "remove"
                                  : "add"}
                              </i>
                            </button>
                            <button
                              type="button"
                              rel="tooltip"
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                console.log("View details of breed:", breed.id);
                              }}
                            >
                              <i className="material-icons">info</i>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={sortedBreeds.length}
                  rowsPerPage={breedRowsPerPage}
                  page={breedPage}
                  onPageChange={(event, newPage) => setBreedPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setBreedRowsPerPage(parseInt(event.target.value, 10));
                    setBreedPage(0);
                  }}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  breeds: selectedBreeds,
                }));
                setOpenBreedModal(false);
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openPrereqModal}
          onClose={() => setOpenPrereqModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add Prerequisites</DialogTitle>
          <DialogContent>
            {loading ? (
              <div className="text-center p-4">
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
                      label="Search prerequisite..."
                      variant="outlined"
                      size="small"
                      value={prereqSearchTerm}
                      onChange={(e) => setPrereqSearchTerm(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        window.open("/trainer/courses/create", "_blank")
                      }
                    >
                      <i className="material-icons">add</i> Create New Course
                    </Button>
                  </div>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const response = await axios.get("api/courses");
                        if (response.data.success && response.data.objectList) {
                          setPrerequisites(response.data.objectList);
                        }
                      } catch (error) {
                        console.error("Error fetching prerequisites:", error);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <i className="material-icons">refresh</i> Refresh
                  </Button>
                </div>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={
                            sortedPrereqs.length > 0 &&
                            sortedPrereqs.every((prereq) =>
                              selectedPrereqs.includes(prereq.id)
                            )
                          }
                          onChange={() => {
                            const allSelected =
                              sortedPrereqs.length > 0 &&
                              sortedPrereqs.every((prereq) =>
                                selectedPrereqs.includes(prereq.id)
                              );
                            setSelectedPrereqs(
                              allSelected
                                ? []
                                : sortedPrereqs.map((prereq) => prereq.id)
                            );
                          }}
                        />
                      </th>
                      {[
                        ["name", "Name"],
                        ["complexity", "Complexity"],
                      ].map(([key, label]) => (
                        <th key={key}>
                          <TableSortLabel
                            active={prereqOrderBy === key}
                            direction={
                              prereqOrderBy === key ? prereqOrder : "asc"
                            }
                            onClick={() => handlePrereqSort(key)}
                          >
                            {label}
                          </TableSortLabel>
                        </th>
                      ))}
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPrereqs
                      .slice(
                        prereqPage * prereqRowsPerPage,
                        prereqPage * prereqRowsPerPage + prereqRowsPerPage
                      )
                      .map((prereq) => (
                        <tr key={prereq.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedPrereqs.includes(prereq.id)}
                              onChange={() => handleSelectPrereq(prereq.id)}
                            />
                          </td>
                          <td>{prereq.name}</td>
                          <td style={{ verticalAlign: "middle" }}>
                            {[...Array(5)].map((_, index) => (
                              <i
                                key={index}
                                className="material-icons"
                                style={{ fontSize: "18px" }}
                              >
                                {index < prereq.complexity
                                  ? "star"
                                  : "star_border"}
                              </i>
                            ))}
                          </td>
                          <td className="td-actions text-right">
                            <button
                              type="button"
                              rel="tooltip"
                              className="btn btn-info btn-sm mr-2"
                              onClick={() => handleSelectPrereq(prereq.id)}
                            >
                              <i className="material-icons">
                                {selectedPrereqs.includes(prereq.id)
                                  ? "remove"
                                  : "add"}
                              </i>
                            </button>
                            <button
                              type="button"
                              rel="tooltip"
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                console.log(
                                  "View details of prereq:",
                                  prereq.id
                                );
                              }}
                            >
                              <i className="material-icons">info</i>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={sortedPrereqs.length}
                  rowsPerPage={prereqRowsPerPage}
                  page={prereqPage}
                  onPageChange={(event, newPage) => setPrereqPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setPrereqRowsPerPage(parseInt(event.target.value, 10));
                    setPrereqPage(0);
                  }}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  prerequisites: selectedPrereqs,
                }));
                setOpenPrereqModal(false);
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </body>
    </>
  );
};

export default TrainerCoursesCreate;
