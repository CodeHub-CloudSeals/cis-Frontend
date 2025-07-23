import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import robot from "../assets/login.png";
import logo from "../assets/logo.svg";
import backgroundImage from "../assets/login_bg.png";
// import { API_ROUTES } from "../constants/apiRoutes";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { MdMail } from "react-icons/md";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API url", API_BASE_URL);

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const clearMessage = () => {
    setTimeout(() => setMessage(""), 3000);
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");
    try {
        const res = await axios.post(`${API_BASE_URL}/cloudseal/v1/api/login`, {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      clearMessage();
      navigate("/dashboard");
    } catch (err) {
      setMessage(
        `Error logging in: ${err.response?.data?.message || err.message}`
      );
      clearMessage();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      clearMessage();
      return;
    }
    setMessage("Signing up...");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/cloudseal/v1/api/register`,
        {
          username,
          email,
          password,
          role: "admin",
          status: "active",
          organizations: { id: 2 },
        }
      );

      setMessage("Signup successful!");
      clearMessage();
      setIsSignUp(false);
    } catch (err) {
      setMessage(
        `Error signing up: ${err.response?.data?.message || err.message}`
      );
      clearMessage();
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex flex-col"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {message && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-4 py-8">
        {" "}
        <img src={logo} alt="Logo" className="w-24 mb-6" />
        <div className="flex flex-col lg:flex-row backdrop-blur-3xl rounded-xl overflow-hidden max-w-3xl w-full min-h-[500px] transition-all duration-500 border border-opacity-90 border-[#3c2958]">
          {/* Image section */}
          <div
            className={`w-full lg:w-1/2 ${isSignUp ? "order-2" : "order-1"}`}
          >
            <img
              src={robot}
              alt="Robot"
              className={`w-full h-64 lg:h-full object-cover transition-transform duration-500 ${
                isSignUp ? "scale-x-[-1]" : ""
              }`}
            />
          </div>

          {/* Form section */}
          <div
            className={`w-full lg:w-1/2 p-10 bg-[#0f0c2980] ${
              isSignUp ? "order-1" : "order-2"
            }`}
          >
            <h2 className="text-center text-xl font-semibold mb-6 text-white">
              {isSignUp ? "CREATE AN ACCOUNT" : "SIGN IN"}
            </h2>
            <form
              onSubmit={isSignUp ? handleSignup : handleLogin}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300 
              focus:outline-none focus:ring-2 focus:ring-[#3c2958] 
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {isSignUp && (
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300 
              focus:outline-none focus:ring-2 focus:ring-[#3c2958] 
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}
              <input
                type="password"
                placeholder={isSignUp ? "Create Password" : "Password"}
                className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300 
              focus:outline-none focus:ring-2 focus:ring-[#3c2958] 
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {isSignUp && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300 
              focus:outline-none focus:ring-2 focus:ring-[#3c2958] 
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}
              <button
                type="submit"
                className="w-full bg-[#552ea2] hover:bg-[#3166e8] text-white py-2 rounded-2xl"
              >
                {isSignUp ? "Sign Up" : "Login"}
              </button>
            </form>
            <p className="text-sm text-center mt-4 text-white uppercase font-light font-['Open_Sans']">
              {isSignUp
                ? "ALREADY HAVE AN ACCOUNT ?"
                : "DON'T HAVE AN ACCOUNT ?"}{" "}
              <span
                onClick={handleToggle}
                className="text-[#3166e8] cursor-pointer pl-2"
              >
                {isSignUp ? "SIGN IN." : "SIGN UP."}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full bg-black bg-opacity-80 py-4">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-center text-gray-300">
          <div className="flex justify-center space-x-4 mb-5">
            {[FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube, FaInstagram].map(
              (Icon, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer w-10 h-10 flex items-center justify-center
                      rounded-full border border-opacity-90 border-[#3c2958]
                      bg-black bg-opacity-80 text-white
                      transition-transform duration-300 ease-in-out
                      hover:scale-110 hover:bg-[#3166e8]"
                >
                  <Icon className="text-md" />
                </div>
              )
            )}
          </div>
          <p className="flex justify-center flex-wrap items-center gap-4 text-sm text-[#8b9199]">
            <span className="cursor-pointer hover:text-white transition-colors duration-200">
              Terms & Conditions
            </span>
            <span className="text-gray-500">|</span>
            <span className="cursor-pointer hover:text-white transition-colors duration-200">
              Privacy
            </span>
            <span className="text-gray-500">|</span>
            <span className="flex items-center gap-2">
              <MdMail className="text-lg" />
              info@cloudseals.com
            </span>
          </p>
        </div>
        <div className="backdrop-filter backdrop-blur-lg bg-opacity-80">
          <div className="w-full border-t border-[#3c2958] opacity-80 mt-3"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-400 mt-2">
              © 2025 CloudSeals | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
