import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack, Save } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../../components/FileUpload/FileUpload";
import ViewContent from "../../components/ViewContent/ViewContent";
import CourseService from "../../services/CourseService";
import { addCourse, updateCourse } from "../../reducers/courseSlice";

// Validation schema using Yup
const validationSchema = Yup.object({
  courseName: Yup.string()
    .required("Course name is required")
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name must be less than 100 characters"),
  courseCode: Yup.string()
    .required("Course code is required")
    .min(2, "Course code must be at least 2 characters")
    .max(20, "Course code must be less than 20 characters"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
});

const CourseForm = ({ mode = "add" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);

  const [loading, setLoading] = useState(mode === "edit" || mode === "view");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      courseName: "",
      courseCode: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!user || !user.userId) {
        setError("User not authenticated");
        return;
      }

      try {
        setSaving(true);
        setError(null);

        const coursePayload = {
          courseName: values.courseName,
          courseCode: values.courseCode,
          description: values.description,
          instructorId: user.userId,
        };

        let response;
        if (mode === "edit") {
          // Extract file objects if any files are selected
          const fileObjects = selectedFiles.map((f) => f.file);
          response = await CourseService.updateCourse(id, {
            courseData: coursePayload,
            files: fileObjects,
          });
          setSuccess("Course updated successfully!");
          dispatch(updateCourse(response));
          setSelectedFiles([]); // Clear selected files
          await fetchCourse(); // Refresh to show new content
        } else {
          // Extract file objects if any files are selected
          const fileObjects = selectedFiles.map((f) => f.file);
          response = await CourseService.createCourse({
            courseData: coursePayload,
            files: fileObjects,
          });
          setSuccess("Course created successfully!");
          dispatch(addCourse(response));
          setSelectedFiles([]); // Clear selected files

          // Navigate to edit mode
          setTimeout(() => {
            navigate(`/courses/edit/${response.id}`);
          }, 1500);
        }
      } catch (err) {
        console.error("Error saving course:", err);
        setError(err.message || "Failed to save course. Please try again.");
      } finally {
        setSaving(false);
      }
    },
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      fetchCourse();
    }
  }, [id, mode]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await CourseService.getCourseById(id);

      setCourseData(response);
      formik.setValues({
        courseName: response.courseName || "",
        courseCode: response.courseCode || "",
        description: response.description || "",
      });
    } catch (err) {
      console.error("Error fetching course:", err);
      setError(err.message || "Failed to fetch course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (files) => {
    // Store selected files to be uploaded with the course
    setSelectedFiles(files);
  };

  const handleFileUpload = async (files, onProgress) => {
    if (!id) {
      throw new Error("Course ID is required for file upload");
    }

    try {
      // Extract just the File objects from the file array
      const fileObjects = files.map((f) => f.file);

      // Update course with new files
      await CourseService.updateCourse(id, {
        courseData: {
          courseName: formik.values.courseName,
          courseCode: formik.values.courseCode,
          description: formik.values.description,
          instructorId: user.userId,
        },
        files: fileObjects,
      });

      setSuccess("Files uploaded successfully!");

      // Refresh course data to get updated contents
      await fetchCourse();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      throw new Error(err.message || "Failed to upload files");
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      await CourseService.deleteCourseContent(contentId);
      setSuccess("Content deleted successfully!");

      // Refresh course data
      await fetchCourse();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete content");
    }
  };

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
      <Box maxWidth={900}>
        {/* Header */}
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/home")}
            sx={{ textTransform: "none" }}
            variant="outline"
            size="small"
          >
            Back
          </Button>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {isViewMode
              ? "View Course"
              : isEditMode
              ? "Edit Course"
              : "Add New Course"}
          </Typography>
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Single Card for All Content */}
        <Paper sx={{ p: 4 }}>
          {/* Course Information Form */}
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Course Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Course Name"
                  name="courseName"
                  value={formik.values.courseName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.courseName &&
                    Boolean(formik.errors.courseName)
                  }
                  helperText={
                    formik.touched.courseName && formik.errors.courseName
                  }
                  required
                  disabled={isViewMode}
                  placeholder="e.g., Introduction to Java Programming"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Course Code"
                  name="courseCode"
                  value={formik.values.courseCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.courseCode &&
                    Boolean(formik.errors.courseCode)
                  }
                  helperText={
                    formik.touched.courseCode && formik.errors.courseCode
                  }
                  required
                  disabled={isViewMode}
                  placeholder="e.g., CS101"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  disabled={isViewMode}
                  multiline
                  rows={4}
                  placeholder="Describe what students will learn in this course..."
                />
              </Grid>

              {/* Display Instructor Info (read-only) */}
              {(mode === "edit" || mode === "view") && courseData && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Instructor"
                      value={courseData.instructorName || ""}
                      disabled
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Created Date"
                      value={
                        courseData.createdAt
                          ? new Date(courseData.createdAt).toLocaleDateString()
                          : ""
                      }
                      disabled
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </form>

          {/* Course Content Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Course Content {isAddMode && "(Optional)"}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* File Upload for Add Mode */}
            {isAddMode && (
              <>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  disabled={false}
                  initialFiles={selectedFiles}
                />

                {selectedFiles.length > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    {selectedFiles.length} file(s) selected. They will be
                    uploaded when you save the course.
                  </Alert>
                )}
              </>
            )}

            {/* File Upload for Edit/View Modes */}
            {id && (
              <>
                {!isViewMode && (
                  <Box sx={{ mb: 4 }}>
                    <FileUpload onUpload={handleFileUpload} courseId={id} />
                  </Box>
                )}

                <ViewContent courseId={id} />
              </>
            )}
          </Box>

          {/* Save Button Section */}
          {!isViewMode && (
            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/home")}
                  disabled={saving}
                  sx={{ textTransform: "none" }}
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  onClick={formik.handleSubmit}
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                  disabled={saving || !formik.isValid}
                  size="small"
                  sx={{
                    px: 4,
                    py: 1,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                    },
                  }}
                >
                  {saving ? "Saving..." : "Save Course"}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default CourseForm;
