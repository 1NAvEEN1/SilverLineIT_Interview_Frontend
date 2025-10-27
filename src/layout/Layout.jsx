import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
} from "@mui/material";
import { Person, Logout, School } from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../reducers/userSlice";
import UserService from "../services/UserService";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogout = async () => {
    try {
      await UserService.logout();
      dispatch(clearAuth());
      navigate("/");
      handleMenuClose();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local state
      dispatch(clearAuth());
      navigate("/");
      handleMenuClose();
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "Instructor";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email || "Instructor";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <School sx={{ fontSize: 32, color: "white" }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
                letterSpacing: "0.5px",
              }}
              onClick={() => navigate("/home")}
            >
              CourseHub
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
                {getUserDisplayName()}
              </Typography>
            </Box>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{
                ml: 2,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  //   bgcolor: "-moz-initial",
                  fontWeight: 600,
                  fontSize: "1rem",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {getInitials(getUserDisplayName())}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 0.5,
            minWidth: 150,
            borderRadius: 2,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={handleProfile}
          sx={{
            py: 1,
            "&:hover": {
              bgcolor: "primary.lighter",
            },
            borderRadius: 1,
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1,
            "&:hover": {
              bgcolor: "error.lighter",
            },
            borderRadius: 1,
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f7fa",
          minHeight: "calc(100vh - 65px)",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
