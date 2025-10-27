import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Fab,
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CourseCard from "../../components/CourseCard/CourseCard";
import CourseService from "../../services/CourseService";
import {
  setCourses,
  appendCourses,
  setSearchQuery,
  setCurrentPage,
  setHasMore,
  setTotalCourses,
  resetCourses,
  deleteCourse as deleteCourseAction,
} from "../../reducers/courseSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { courses, searchQuery, currentPage, hasMore } = useSelector(
    (state) => state.course
  );

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  // Fetch courses
  const fetchCourses = useCallback(
    async (page = 1, search = "", append = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await CourseService.getCourses(page, 9, search);

        if (response.success) {
          if (append) {
            dispatch(appendCourses(response.data.courses));
          } else {
            dispatch(setCourses(response.data.courses));
          }
          
          dispatch(setTotalCourses(response.data.total));
          dispatch(setCurrentPage(page));
          dispatch(setHasMore(response.data.courses.length === 9));
        } else {
          setError(response.message || "Failed to fetch courses");
        }
      } catch (err) {
        setError("An error occurred while fetching courses");
        console.error(err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [dispatch]
  );

  // Initial load
  useEffect(() => {
    fetchCourses(1, searchQuery);
  }, []);

  // Search handler with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== searchQuery) {
        dispatch(resetCourses());
        dispatch(setSearchQuery(searchTerm));
        fetchCourses(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, searchQuery, dispatch, fetchCourses]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 300 &&
        hasMore &&
        !loading
      ) {
        fetchCourses(currentPage + 1, searchQuery, true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, hasMore, loading, searchQuery, fetchCourses]);

  const handleAddCourse = () => {
    navigate("/courses/add");
  };

  const handleEditCourse = (course) => {
    navigate(`/courses/edit/${course.id}`);
  };

  const handleViewCourse = (course) => {
    navigate(`/courses/view/${course.id}`);
  };

  const handleDeleteCourse = async (course) => {
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      try {
        const response = await CourseService.deleteCourse(course.id);
        if (response.success) {
          dispatch(deleteCourseAction(course.id));
        } else {
          alert(response.message || "Failed to delete course");
        }
      } catch (err) {
        alert("An error occurred while deleting the course");
        console.error(err);
      }
    }
  };

  if (initialLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
            }}
          >
            My Courses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and organize your course materials
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddCourse}
          size="small"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            px: 2,
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
              boxShadow: "0 6px 16px rgba(102, 126, 234, 0.5)",
            },
          }}
        >
          Add New Course
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search courses..."
        value={searchTerm}
        size="small"
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            bgcolor: "white",
            borderRadius: 2,
            "&:hover fieldset": {
              borderColor: "#667eea",
            },
          },
        }}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Course Grid */}
      {courses.length === 0 && !loading ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "white",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No courses found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery
              ? "Try adjusting your search terms"
              : "Get started by adding your first course"}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddCourse}
              size="small"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Add Course
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <CourseCard
                course={course}
                onEdit={handleEditCourse}
                onView={handleViewCourse}
                onDelete={handleDeleteCourse}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Loading Indicator for Pagination */}
      {loading && !initialLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Floating Add Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddCourse}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: { xs: "flex", md: "none" },
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
          },
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Home;
