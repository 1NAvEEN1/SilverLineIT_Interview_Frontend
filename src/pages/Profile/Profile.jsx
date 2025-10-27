import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Divider,
  IconButton,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import {
  CameraAlt,
  Email,
  Person,
  School,
  CalendarToday,
  ArrowBack,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/generateInitials";
import { getColorFromName } from "../../utils/getColorFromName";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";
  const displayInitials = getInitials(fullName);
  const avatarColor = getColorFromName(fullName);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "text.primary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          Back to Home
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
          My Profile
        </Typography>
      </Box>
      {/* Profile Header Card */}
      <Paper
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: avatarColor,
                fontSize: "2.5rem",
                fontWeight: 700,
                border: "4px solid rgba(255,255,255,0.3)",
              }}
            >
              {displayInitials}
            </Avatar>
            <IconButton
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
                boxShadow: 2,
              }}
              size="small"
            >
              <CameraAlt fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              {fullName}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
              {user?.email || "No email provided"}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<School sx={{ color: "white !important" }} />}
                label="Instructor"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<CalendarToday sx={{ color: "white !important" }} />}
                label={`Joined ${new Date(
                  user?.createdAt || Date.now()
                ).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>
        </Box>
      </Paper>
      {/* Profile Information */}{" "}
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          Personal Information
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Person sx={{ color: "text.secondary", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                >
                  First Name
                </Typography>
              </Stack>
              <Typography variant="body1" fontWeight={600}>
                {user?.firstName || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Person sx={{ color: "text.secondary", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                >
                  Last Name
                </Typography>
              </Stack>
              <Typography variant="body1" fontWeight={600}>
                {user?.lastName || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Email sx={{ color: "text.secondary", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                >
                  Email Address
                </Typography>
              </Stack>
              <Typography variant="body1" fontWeight={600}>
                {user?.email || "N/A"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
