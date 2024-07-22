import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Container, Box, Tabs, Tab, Avatar, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "#3f51b5",
  },
  tab: {
    fontWeight: "bold",
  },
  activeTabIndicator: {
    height: "4px",
    backgroundColor: "#ffeb3b",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
  },
  detailsBox: {
    width: "80%",
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  paper: {
    padding: theme.spacing(3),
  },
}));

const DashboardPage = () => {
  const classes = useStyles();
  const { username } = useParams();
  const [value, setValue] = useState(0);
  const [loggedInUsername, setLoggedInUsername] = useState("");

  useEffect(() => {
    // Assume we have a function to get the logged-in user's username from local storage
    const storedUsername = localStorage.getItem("username");
    setLoggedInUsername(storedUsername);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Container>
        <Tabs value={value} onChange={handleChange} centered TabIndicatorProps={{ className: classes.activeTabIndicator }}>
          <Tab label="General Information" className={classes.tab} />
          {loggedInUsername === username && <Tab label="Files Shared By Me" className={classes.tab} />}
        </Tabs>
        <Box className={classes.content}>
          {value === 0 && (
            <Paper className={classes.detailsBox}>
              <Grid container spacing={3} justify="center">
                <Grid item>
                  <Avatar
                    alt="User Profile"
                    src="https://www.w3schools.com/howto/img_avatar.png" // Placeholder image URL
                    className={classes.avatar}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Name: {username}</Typography>
                  <Typography variant="h6">Email: {username}@example.com</Typography>
                  <Typography variant="h6">Date Created: January 1, 2021</Typography>
                  <Typography variant="h6">Total Files Shared: 10</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
          {value === 1 && loggedInUsername === username && (
            <Paper className={classes.detailsBox}>
              <Typography variant="h6">Files Shared By Me</Typography>
              <Typography variant="body1">List of files...</Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default DashboardPage;
