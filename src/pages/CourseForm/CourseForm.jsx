import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack, Save } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileUpload from "../../components/FileUpload/FileUpload";
import ViewContent from "../../components/ViewContent/ViewContent";
import CourseService from "../../services/CourseService";
import { useDispatch } from "react-redux";
import { addCourse, updateCourse } from "../../reducers/courseSlice";

// Validation schema using Yup
const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  instructor: Yup.string()
    .required("Instructor name is required")
    .min(2, "Instructor name must be at least 2 characters"),
  duration: Yup.string(),
  category: Yup.string()
    .required("Category is required")
    .min(2, "Category must be at least 2 characters"),
  level: Yup.string()
    .required("Level is required")
    .oneOf(["Beginner", "Intermediate", "Advanced"], "Invalid level"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["Draft", "Published", "Archived"], "Invalid status"),
});

const CourseForm = ({ mode = "add" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(mode === "edit" || mode === "view");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      instructor: "",
      duration: "",
      status: "Draft",
      category: "",
      level: "Beginner",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setSaving(true);
        setError(null);

        let response;
        if (mode === "edit") {
          response = await CourseService.updateCourse(id, values);
        } else {
          response = await CourseService.createCourse(values);
        }

        if (response.success) {
          setSuccess(
            mode === "edit"
              ? "Course updated successfully!"
              : "Course created successfully!"
          );

          if (mode === "edit") {
            dispatch(updateCourse({ id, ...values }));
          } else {
            dispatch(addCourse({ id: response.data.id, ...values }));
          }

          // Navigate after a short delay
          setTimeout(() => {
            if (mode === "add" && response.data?.id) {
              // Stay on page to allow content upload
              navigate(`/courses/edit/${response.data.id}`);
            } else {
              navigate("/home");
            }
          }, 1500);
        } else {
          setError(response.message || "Failed to save course");
        }
      } catch (err) {
        setError("An error occurred while saving course");
        console.error(err);
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
      const response = await CourseService.getCourseById(id);

      if (response.success) {
        formik.setValues({
          title: response.data.title || "",
          description: response.data.description || "",
          instructor: response.data.instructor || "",
          duration: response.data.duration || "",
          status: response.data.status || "Draft",
          category: response.data.category || "",
          level: response.data.level || "Beginner",
        });
      } else {
        setError(response.message || "Failed to fetch course");
      }
    } catch (err) {
      setError("An error occurred while fetching course");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files, onProgress) => {
    try {
      const response = await CourseService.uploadCourseContent(
        id,
        files,
        onProgress
      );

      if (response.success) {
        setSuccess("Files uploaded successfully!");
        // Refresh content list
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err) {
      throw err;
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
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/home")}
          sx={{ textTransform: "none" }}
        >
          Back to Courses
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

      {/* Course Information Form */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Course Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Course Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                required
                disabled={isViewMode}
                placeholder="e.g., Introduction to Web Development"
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
                required
                disabled={isViewMode}
                multiline
                rows={3}
                placeholder="Describe what students will learn in this course..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Instructor Name"
                name="instructor"
                value={formik.values.instructor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.instructor && Boolean(formik.errors.instructor)
                }
                helperText={
                  formik.touched.instructor && formik.errors.instructor
                }
                required
                disabled={isViewMode}
                placeholder="e.g., John Doe"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Duration"
                name="duration"
                value={formik.values.duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.duration && Boolean(formik.errors.duration)
                }
                helperText={formik.touched.duration && formik.errors.duration}
                disabled={isViewMode}
                placeholder="e.g., 8 weeks, 40 hours"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                helperText={formik.touched.category && formik.errors.category}
                required
                disabled={isViewMode}
                placeholder="e.g., Programming, Design, Business"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Level"
                name="level"
                value={formik.values.level}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.level && Boolean(formik.errors.level)}
                helperText={formik.touched.level && formik.errors.level}
                disabled={isViewMode}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
                disabled={isViewMode}
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Archived">Archived</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {!isViewMode && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/home")}
                disabled={saving}
                sx={{ textTransform: "none" }}
                size="small"
              >
                Cancel
              </Button>{" "}
              <Button
                type="submit"
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
          )}
        </form>
      </Paper>

      {/* File Upload Section - Only show for edit/view modes */}
      {(isEditMode || isViewMode) && id && (
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Course Content
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {!isViewMode && (
            <Box sx={{ mb: 4 }}>
              <FileUpload onUpload={handleFileUpload} courseId={id} />
            </Box>
          )}

          <ViewContent courseId={id} />
        </Paper>
      )}
    </Box>
  );
};

export default CourseForm;
