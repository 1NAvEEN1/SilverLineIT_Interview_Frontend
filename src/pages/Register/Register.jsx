import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  Grid,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Alert,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  School,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from "../../reducers/userSlice";
import UserService from "../../services/UserService";
import AuthService from "../../services/AuthService";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "Instructor",
    organization: "",
    bio: "",
  });

  const steps = ["Account Info", "Personal Details", "Review"];

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateStep = (step) => {
    const e = {};

    if (step === 0) {
      if (!formData.email) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        e.email = "Enter a valid email";

      if (!formData.password) e.password = "Password is required";
      else if (formData.password.length < 6)
        e.password = "Password must be at least 6 characters";

      if (!formData.confirmPassword)
        e.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }

    if (step === 1) {
      if (!formData.firstName) e.firstName = "First name is required";
      if (!formData.lastName) e.lastName = "Last name is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitting(true);
    setApiError("");

    try {
      // Call the register API
      const response = await UserService.register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );

      // Store auth data in Redux
      dispatch(setAuthData({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }));

      // Setup automatic token refresh
      AuthService.setupTokenRefresh();

      // Navigate to home
      navigate("/home");
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(error.message || "Registration failed. Please try again.");
      // Go back to first step to fix errors
      setActiveStep(0);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              fullWidth
              margin="normal"
              size="small"
              error={Boolean(errors.email)}
              helperText={errors.email}
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange("password")}
              fullWidth
              margin="normal"
              size="small"
              error={Boolean(errors.password)}
              helperText={errors.password}
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              fullWidth
              margin="normal"
              size="small"
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                  fullWidth
                  margin="normal"
                  size="small"
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                  fullWidth
                  margin="normal"
                  size="small"
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            <TextField
              select
              label="Role"
              value={formData.role}
              onChange={handleChange("role")}
              fullWidth
              margin="normal"
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <MenuItem value="Instructor">Instructor</MenuItem>
              <MenuItem value="Student" disabled>Student</MenuItem>
              <MenuItem value="Admin" disabled>Admin</MenuItem>
            </TextField>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Review Your Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formData.email}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formData.firstName} {formData.lastName}
              </Typography>
            </Box>

            {formData.phone && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formData.phone}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formData.role}
              </Typography>
            </Box>

            {formData.organization && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Organization
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formData.organization}
                </Typography>
              </Box>
            )}

            {formData.bio && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Bio
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formData.bio}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "rgba(102, 126, 234, 0.1)",
                borderRadius: 2,
                border: "1px solid rgba(102, 126, 234, 0.3)",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                By clicking "Create Account", you agree to our Terms of Service
                and Privacy Policy.
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: -100,
          left: -100,
          filter: "blur(40px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          bottom: -50,
          right: -50,
          filter: "blur(40px)",
        }}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Paper
          elevation={24}
          sx={{
            maxWidth: { xs: 360, sm: 480, md: 550 },
            width: "100%",
            p: { xs: 2.5, sm: 3.5, md: 4 },
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <School
              sx={{
                fontSize: { xs: 44, sm: 50 },
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            />
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mt: 1,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Create Account
            </Typography>
            <Typography 
              color="text.secondary" 
              sx={{ 
                mt: 0.5,
                fontSize: { xs: "0.813rem", sm: "0.875rem" },
              }}
            >
              Join CourseHub and start learning
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel 
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* API Error Alert */}
            {apiError && (
              <Alert 
                severity="error" 
                onClose={() => setApiError("")}
                sx={{ mb: 2, borderRadius: 2 }}
              >
                {apiError}
              </Alert>
            )}

            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  startIcon={<ArrowBack fontSize="small" />}
                  variant="outlined"
                  size="small"
                  sx={{
                    flex: 1,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    borderColor: "#667eea",
                    color: "#667eea",
                    "&:hover": {
                      borderColor: "#5568d3",
                      bgcolor: "rgba(102, 126, 234, 0.05)",
                    },
                  }}
                >
                  Back
                </Button>
              )}

              {activeStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  endIcon={<ArrowForward fontSize="small" />}
                  variant="contained"
                  size="small"
                  sx={{
                    flex: 1,
                    py: 1,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                      boxShadow: "0 6px 16px rgba(102, 126, 234, 0.5)",
                    },
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={submitting}
                  sx={{
                    flex: 1,
                    py: 1,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                      boxShadow: "0 6px 16px rgba(102, 126, 234, 0.5)",
                    },
                    "&:disabled": {
                      background:
                        "linear-gradient(135deg, #9fa8da 0%, #b39ddb 100%)",
                    },
                  }}
                >
                  {submitting ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </Box>

            {/* Sign In Link */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  onClick={() => navigate("/")}
                  sx={{
                    color: "#667eea",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;
