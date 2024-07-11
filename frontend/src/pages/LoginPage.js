import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../components/LoginUser";
import { Box, TextField, Button, Typography, Paper, Link, CssBaseline, Container, Grid, InputLabel } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import backgroundImage from "../assets/background-image.png"; // Ensure this path is correct

const theme = createTheme();

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [message, setmessage] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          overflow: "hidden",
          padding: "0 1rem",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      >
        <Container component="main" maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, backgroundColor: "#2c2f33" }}>
            <Box>
              <Typography variant="h4" sx={{ mb: 5 }} component="h1" align="center" color="#e0e0e0" gutterBottom>
                Welcome back!
              </Typography>
              <form onSubmit={(e) => handleLogin(e, username, password, setmessage, navigate)}>
                <InputLabel htmlFor="username" style={{ color: "#e0e0e0" }}>
                  Username*
                </InputLabel>
                <TextField margin="normal" required fullWidth id="username" name="username" autoComplete="username" autoFocus value={username} onChange={(e) => setusername(e.target.value)} sx={{ mb: 3, mt: 0, backgroundColor: "#000", input: { color: "#fff" }, borderRadius: 1 }} />
                <InputLabel htmlFor="password" style={{ color: "#e0e0e0" }}>
                  Password*
                </InputLabel>
                <TextField margin="normal" required fullWidth name="password" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setpassword(e.target.value)} sx={{ mb: 3, mt: 0, backgroundColor: "#000", input: { color: "#fff" }, borderRadius: 1 }} />
                <Link href="#" variant="body2" display="block" align="center">
                  Forgot your password?
                </Link>
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                  Log In
                </Button>
              </form>
              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="body2" color="#e0e0e0">
                    Need an account?{" "}
                    <Link href="#" variant="body2" onClick={() => navigate("/register")}>
                      Register
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
              {message && (
                <Typography variant="body2" color="error">
                  {message}
                </Typography>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
