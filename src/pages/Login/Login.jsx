import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  School,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../reducers/userSlice";
import UserService from "../../services/UserService";
import AuthService from "../../services/AuthService";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be >= 6 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");

    try {
      // Call the login API
      const response = await UserService.login(email, password);

      // Store auth data in Redux
      dispatch(
        setAuthData({
          user: {
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            userId: response.userId,
          },
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })
      );

      // Setup automatic token refresh
      AuthService.setupTokenRefresh();

      // Navigate to home
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setApiError(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
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
            maxWidth: { xs: 340, sm: 380 },
            width: "100%",
            p: { xs: 2.5, sm: 3.5 },
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
              Welcome Back
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: { xs: "0.813rem", sm: "0.875rem" },
              }}
            >
              Sign in to access your courses
            </Typography>
          </Box>

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

            {/* Email Field */}
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Password Field */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              size="small"
              error={Boolean(errors.password)}
              helperText={errors.password}
              autoComplete="current-password"
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
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Remember Me & Forgot Password */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    size="small"
                    sx={{
                      color: "#667eea",
                      "&.Mui-checked": {
                        color: "#667eea",
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Remember me
                  </Typography>
                }
              />
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#667eea",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Sign In Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="small"
              disabled={submitting}
              sx={{
                mt: 3,
                py: 1.2,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              {submitting ? "Signing in..." : "Sign In"}
            </Button>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "#667eea",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
