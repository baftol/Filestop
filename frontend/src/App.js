// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from "@material-ui/core";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
import DecryptFile from "./pages/ServeFile";

const App = () => {
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "username") {
        window.location.reload();
        setUsername(localStorage.getItem("username"));
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
              FileStop
            </Typography>
            {username ? (
              <div>
                <Button color="inherit" onClick={handleMenuClick}>
                  Hello, {username}
                </Button>
                <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem component={Link} to={`/profile/${username}`}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                  <MenuItem
                    onClick={() => {
                      localStorage.removeItem("username");
                      setUsername("");
                      handleMenuClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <div>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/profile/:username" element={<DashboardPage username="baftol" />} />
          <Route path="/uploads/:filename" element={<DecryptFile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
