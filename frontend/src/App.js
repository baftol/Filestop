// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <nav className="bg-white shadow p-4">
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-blue-500">
                Home
              </a>
            </li>
            <li>
              <a href="/login" className="text-blue-500">
                Login
              </a>
            </li>
            <li>
              <a href="/register" className="text-blue-500">
                Register
              </a>
            </li>
            <li>
              <a href="/upload" className="text-blue-500">
                Upload
              </a>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/upload" element={<HomePage />} />
          <Route path="/profile/:username" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
