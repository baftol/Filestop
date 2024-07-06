import React, { useState, useEffect } from "react";
import { handleRegister } from "../components/RegisterUser";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; // Import the CSS file

const LoginPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/register") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    // // Assume login is successful
    const username = "loggedInUser"; // Replace with actual username from response
    navigate(`/profile/${username}`);
  };

  return (
    <div className="login-page">
      <div className="backgroundimage" />
      <div className="form-container">
        <div className={`login-form ${isLogin ? "active" : "hidden"}`}>
          <h1 className="text-3xl font-bold text-white mb-4 text-center">Welcome back!</h1>
          <p className="text-gray-400 mb-6 text-center">We're so excited to see you again!</p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required />
              <p className="text-sm text-blue-500 hover:underline cursor-pointer">Forgot your password?</p>
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                Log In
              </button>
            </div>
          </form>
          <p className="text-center text-gray-400 mt-4">
            Need an account?{" "}
            <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => setIsLogin(false)}>
              Register
            </span>
          </p>
          {message && <p>{message}</p>}
        </div>
        <div className={`register-form ${!isLogin ? "active" : "hidden"}`}>
          <h1 className="text-3xl font-bold text-white mb-4 text-center">Create an account</h1>
          <form onSubmit={handleRegister}>
            <div className="mb-4"></div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
              Name
            </label>
            <input type="Name" id="Name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                Register
              </button>
            </div>
          </form>
          <p className="text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => setIsLogin(true)}>
              Log In
            </span>
          </p>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
