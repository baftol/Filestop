import React from "react";
import { useParams } from "react-router-dom";
import "../styles/DashboardPage.css";

const DashboardPage = () => {
  const { username } = useParams();

  return (
    <div className="dashboard">
      <h1>Welcome, {username}</h1>
      <div className="dashboard-content">
        <p>Total Files Uploaded: 10</p>
        <p>Anonymous Files Uploaded: 3</p>
        {/* Add more content here */}
      </div>
    </div>
  );
};

export default DashboardPage;
