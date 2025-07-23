import React, { useState } from "react";
import {
  FaBars,
  FaUser,
  FaEnvelope,
  FaCog,
  FaHeadset,
  FaSignOutAlt,
  FaRegCommentAlt,
} from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";

import { MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import avatar from "../assets/avatar-3.jpg";
import { Link } from "react-router-dom";

export default function Header({ toggleSidenav }) {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] =
    useState(false);
  const [isSearchBoxExpanded, setIsSearchBoxExpanded] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token"); // 🔐 Remove token on logout
    navigate("/login"); // 🔁 Redirect to login page
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 flex items-center justify-between px-6 bg-white shadow-md transition-all duration-500 z-50">
      <div className="container-fluid flex items-center justify-between w-full">
        <div className="cursor-pointer" onClick={toggleSidenav}>
          <FaBars className="text-base" />
        </div>
        <Link to="/dashboard" className="navbar-brand ps-3">
          <img src={logo} className="h-10" alt="Logo" />
        </Link>
        <div className="flex items-center ms-auto me-4">
          <ul className="flex items-center space-x-5">
            <li className="hidden lg:block md:block relative">
              <div
                className={`relative h-10 rounded-full flex items-center transition-all duration-400 ${
                  isSearchBoxExpanded ? "w-72" : "w-10"
                }`}
                onMouseEnter={() => setIsSearchBoxExpanded(true)}
                onMouseLeave={() => setIsSearchBoxExpanded(false)}
              >
                <input
                  className={`border-none bg-transparent outline-none p-0 text-black text-base transition-all duration-400 flex-grow ${
                    isSearchBoxExpanded ? "w-60 px-1.5" : "w-0"
                  }`}
                  type="text"
                  placeholder="Type to Search"
                />
                <a
                  className="text-[#4097FF] w-10 h-10 rounded-full bg-transparent flex justify-center items-center transition-all duration-400 flex-shrink-0 hover:bg-white"
                  href="#"
                >
                  <MdSearch className="text-2xl" />{" "}
                </a>
              </div>
            </li>
            <li className="relative">
              <div className="dropdown">
                <a
                  className="nav-link dropdown-toggle p-0 cursor-pointer"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  <img
                    src={avatar}
                    className="rounded-full"
                    width="35"
                    height="35"
                    alt="Profile"
                  />
                </a>
                {isProfileDropdownOpen && (
                  <ul className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 text-sm z-50">
                    <li>
                      <a
                        className="flex items-center px-4 py-2 hover:bg-[#013357] hover:text-white transition-colors duration-200"
                        href="#"
                      >
                        <FaUser className="mr-3 text-base" /> Profile
                      </a>
                    </li>
                    <li>
                      <a
                        className="flex items-center px-4 py-2 hover:bg-[#013357] hover:text-white transition-colors duration-200"
                        href="#"
                      >
                        <FaEnvelope className="mr-3 text-base" /> Inbox
                      </a>
                    </li>
                    <li>
                      <a
                        className="flex items-center px-4 py-2 hover:bg-[#013357] hover:text-white transition-colors duration-200"
                        href="#"
                      >
                        <FaCog className="mr-3 text-base" /> Settings
                      </a>
                    </li>
                    <li>
                      <a
                        className="flex items-center px-4 py-2 hover:bg-[#013357] hover:text-white transition-colors duration-200"
                        href="#"
                      >
                        <FaHeadset className="mr-3 text-base" /> Support
                      </a>
                    </li>
                    <li>
                      <hr className="my-1 border-t border-gray-200" />
                    </li>
                    <li>
                      <a
                        className="flex items-center px-4 py-2 hover:bg-[#013357] hover:text-white transition-colors duration-200"
                        href="#"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="mr-3 text-base" />
                        Logout
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li className="relative">
              <div className="dropdown">
                <button
                  type="button"
                  className="p-0 relative border-0 cursor-pointer"
                  onClick={() =>
                    setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen)
                  }
                >
                  <FaRegBell className="text-sky-500 text-2xl" />
                  <span className="absolute -top-1 -right-1 inline-flex px-[15%] py-[10%] text-xs font-medium leading-none text-white bg-red-500 rounded-full">
                    4<span className="sr-only">unread messages</span>
                  </span>
                </button>
                {isNotificationsDropdownOpen && (
                  <ul className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 text-sm z-50">
                    <li>
                      <a
                        className="text-blue-500 flex justify-center items-center px-4 py-2"
                        href="#"
                      >
                        Unread
                      </a>
                    </li>
                    <li>
                      <hr className="my-1 border-t border-gray-200" />
                    </li>
                    <li>
                      <a
                        className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                        href="#"
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                        href="#"
                      >
                        Something else here
                      </a>
                    </li>
                    <li>
                      <hr className="my-1 border-t border-gray-200" />
                    </li>
                    <li>
                      <a
                        className="text-blue-500 flex justify-center items-center px-4 py-2"
                        href="#"
                      >
                        View all Notifications
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <button
                type="button"
                className="p-0 relative border-0 cursor-pointer"
              >
                <FaRegCommentAlt className="text-sky-500 text-2xl" />
                <span className="absolute -top-1 -right-1 inline-flex items-right px-[15%] py-[10%] text-xs font-medium leading-none text-white bg-red-500 rounded-full">
                  10
                  <span className="sr-only">unread messages</span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
