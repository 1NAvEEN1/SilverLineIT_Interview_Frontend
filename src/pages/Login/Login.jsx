import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // placeholder: integrate real auth here
    setTimeout(() => {
      console.log({ email, password, remember });
      setSubmitting(false);
      // next: route to app, show success, etc.
    }, 500);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100svh"
      px={2}
    >
      <Paper elevation={6} sx={{ maxWidth: 380, width: "100%", p: { xs: 2, md: 4 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={12}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Welcome back
              </Typography>
              <Typography color="text.secondary" mb={3}>
                Sign in to continue to the application.
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  autoComplete="email"
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  autoComplete="current-password"
                  size="small"
                />

                <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          size="small"
                        />
                      }
                      label={<Typography variant="body2">Remember me</Typography>}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
                      Forgot password?
                    </Typography>
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="center" mt={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    size="small"
                    sx={{ px: 4, py:1 }}
                  >
                    {submitting ? "Signing in..." : "Sign in"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={0} sx={{ display: { xs: "none", md: "none" } }}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              {/* Decorative / placeholder area. Replace with an image or illustration if desired */}
              <Box sx={{ width: "100%", maxWidth: 320, textAlign: "center" }}>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Clean, focused UI
                </Typography>
                <Typography color="text.secondary">
                  A simple login form ready to wire to your authentication service.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Login;
