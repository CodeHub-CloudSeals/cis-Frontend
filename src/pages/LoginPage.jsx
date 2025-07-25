import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import robot from "../assets/login.png";
import logo from "../assets/logo.svg";
import backgroundImage from "../assets/login_bg.png";
import { API_ROUTES } from "../Constants/apiRoutes";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { MdMail } from "react-icons/md";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [orgName, setOrgName] = useState("");
  const [domain, setDomain] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [isOtherOrg, setIsOtherOrg] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(
          "http://34.45.198.251:9092/cloudseal/v1/api/organizations"
        );
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations", error);
      }
    };

    fetchOrganizations();
  }, []);

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
      const res = await axios.post(`${API_BASE_URL}${API_ROUTES.LOGIN}`, {
        username,
        password,
      });

      const token = res.data;

      if (token) {
        console.log("Saving token:", token);
        localStorage.setItem("token", token);
        setTimeout(() => {
          setMessage("Login successful!");
          clearMessage();
          navigate("/dashboard");
        }, 100);
      } else {
        console.error("Token not received:", res);
        setMessage("Login failed: Token not received.");
        clearMessage();
      }
    } catch (err) {
      console.error("Login error:", err.response || err.message);
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
        "http://34.45.198.251:9092/cloudseal/v1/api/register",
        {
          username,
          email,
          password,
          phone,
          role: "admin",
          status: "Active",
          organizations: {
            name: orgName,
            domain,
            companyName,
            companyAddress,
            country,
            state: stateName,
            zipCode,
          },
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
                <>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#3c2958]
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                    required
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3c2958] hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                      required
                    />
                    <div
                      className="absolute right-3 top-3 cursor-pointer text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3c2958] hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                      required
                    />
                    <div
                      className="absolute right-3 top-3 cursor-pointer text-gray-400"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#3c2958]
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                  />
                  <div>
                    <select
                      className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3c2958] hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                      value={selectedOrgId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedOrgId(val);

                        if (val === "") {
                          setIsOtherOrg(false);
                          setOrgName("");
                          setDomain("");
                          setCompanyName("");
                          setCompanyAddress("");
                          setCountry("");
                          setStateName("");
                          setZipCode("");
                          return;
                        }

                        if (val === "other") {
                          setIsOtherOrg(true);
                          setOrgName("");
                          setDomain("");
                          setCompanyName("");
                          setCompanyAddress("");
                          setCountry("");
                          setStateName("");
                          setZipCode("");
                        } else {
                          setIsOtherOrg(false);
                          const selectedOrg = organizations.find(
                            (org) => org.id.toString() === val
                          );
                          if (selectedOrg) {
                            setOrgName(selectedOrg.name);
                            setDomain(selectedOrg.domain || "");
                            setCompanyName(selectedOrg.companyName || "");
                            setCompanyAddress(selectedOrg.companyAddress || "");
                            setCountry(selectedOrg.country || "");
                            setStateName(selectedOrg.state || "");
                            setZipCode(selectedOrg.zipCode || "");
                          }
                        }
                      }}
                    >
                      <option value="" disabled hidden>
                        Select Organization
                      </option>
                      {organizations.map((org) => (
                        <option
                          key={org.id}
                          value={org.id}
                          className="bg-[#0f0c29] text-white"
                        >
                          {org.name}
                        </option>
                      ))}
                      <option value="other" className="bg-[#0f0c29] text-white">
                        Others
                      </option>
                    </select>

                    {isOtherOrg && (
                      <input
                        type="text"
                        placeholder="Enter Organization Name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="mt-2 w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3c2958] hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                      />
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#3c2958]
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#3c2958]
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                  />
                  <input
                    type="text"
                    placeholder="Company Address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#3c2958]
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#3c2958]
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#3c2958]
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#3c2958]
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
                  />
                </>
              )}

              {!isSignUp && (
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0b20] bg-opacity-20 text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#3c2958]
              hover:ring-2 hover:ring-[#3c2958] transition duration-200 font-light font-['Open_Sans']"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-center text-gray-300">
          <div className="flex justify-center space-x-4 mb-5">
            {[FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube, FaInstagram].map(
              (Icon, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border border-opacity-90 border-[#3c2958] bg-black bg-opacity-80 text-white transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-[#3166e8]"
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
