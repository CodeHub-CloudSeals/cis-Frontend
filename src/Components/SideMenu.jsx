import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaUserTie,
  FaDatabase,
  FaCog,
  FaHeartbeat,
  FaNetworkWired,
  FaChartArea,
  FaCalculator,
  FaTools,
  FaFileInvoiceDollar,
  FaAngleLeft,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  FaServer,
  FaRegHardDrive,
  FaComputer,
  FaUsers,
  FaSitemap,
} from "react-icons/fa6";
import { GoGraph } from "react-icons/go";

export default function SideMenu({ isSidenavOpen, toggleSidenav }) {
  const [activeSidebarMenu, setActiveSidebarMenu] = useState({});
  const navigate = useNavigate();

  const toggleTreeview = (menuName) => {
    setActiveSidebarMenu((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token"); // 🔐 Remove token on logout
    navigate("/login"); // 🔁 Redirect to login page
  };

  return (
    <section
      className={`fixed top-0 left-0 h-full bg-[#000030] overflow-y-auto transition-all duration-500 z-[9999] pt-16 pb-20 ${
        isSidenavOpen ? "w-72" : "w-0"
      }`}
    >
      <a
        href="#"
        className="absolute top-0 right-6 text-3xl ml-12 text-white"
        onClick={toggleSidenav}
      >
        &times;
      </a>
      <ul className="list-none pl-0 relative">
        <li className="py-3 px-4 text-white bg-[#1e2145] text-base font-medium">
          Menu
        </li>
        <li>
          <Link
            to="/dashboard"
            onClick={toggleSidenav}
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
          >
            <FaUsers className="w-8 text-base" />
            <span>Home</span>
          </Link>
        </li>
        <li className="treeview">
          <a
            href="#"
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
            onClick={() => toggleTreeview("cloudResources")}
          >
            <FaDatabase className="w-8 text-base" />
            <span className="flex-grow">Cloud Resources</span>
            <FaAngleLeft
              className={`ml-auto text-sm transition-transform duration-300 ${
                activeSidebarMenu.cloudResources ? "-rotate-90" : ""
              }`}
            />
          </a>
          {activeSidebarMenu.cloudResources && (
            <ul
              className={`list-none p-0 m-0 pl-1 bg-[#1e2145] transition-all duration-300 ease-in-out overflow-hidden ${
                activeSidebarMenu.cloudResources ? "max-h-96" : "max-h-0"
              }`}
            >
              <li>
                <a
                  href="#"
                  className="flex items-center py-1.5 px-4 text-sm text-[#8aa4af] bg-[#1e2145] hover:text-white transition-colors duration-200"
                >
                  <FaComputer className="w-8 text-base" />
                  Compute
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center py-1.5 px-4 text-sm text-[#8aa4af] bg-[#1e2145] hover:text-white transition-colors duration-200"
                >
                  <FaRegHardDrive className="w-8 text-base" />
                  Storage
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center py-1.5 px-4 text-sm text-[#8aa4af] bg-[#1e2145] hover:text-white transition-colors duration-200"
                >
                  <FaServer className="w-8 text-base" />
                  Database
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center py-1.5 px-4 text-sm text-[#8aa4af] bg-[#1e2145] hover:text-white transition-colors duration-200"
                >
                  <FaNetworkWired className="w-8 text-base" />
                  Network
                </a>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link
            to="/ai-agents"
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
          >
            <FaUsers className="w-8 text-base" />
            <span>Ai Agents</span>
          </Link>
        </li>

        <li className="treeview">
          <a
            href="#"
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
            onClick={() => toggleTreeview("workflows")}
          >
            <FaSitemap className="w-8 text-base" />
            <span>Workflows / Automations</span>
          </a>
          {/* Submenu for Workflows if needed */}
        </li>
        <li className="treeview">
          <a
            href="#"
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
            onClick={() => toggleTreeview("costOptimization")}
          >
            <GoGraph className="w-8 text-base" />
            <span>Cost Optimization</span>
          </a>
          {/* Submenu for Cost Optimization if needed */}
        </li>
        <li className="treeview">
          <a
            href="#"
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
            onClick={() => toggleTreeview("complianceSecurity")}
          >
            <FaShieldAlt className="w-8 text-base" />
            <span>Compliance & Security</span>
          </a>
          {/* Submenu for Compliance & Security if needed */}
        </li>
        <li className="treeview">
          <a
            href="#"
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
            onClick={() => toggleTreeview("biasFairness")}
          >
            <FaChartArea className="w-8 text-base" />
            <span>Bias / Fairness Analytics</span>
          </a>
          {/* Submenu for Bias / Fairness Analytics if needed */}
        </li>
        <li>
          <a
            href="#"
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
          >
            <FaHeartbeat className="w-8 text-base" />
            <span>AgentOps (Monitoring & Health)</span>
          </a>
        </li>
        <li>
          <Link
            to="/audit-logs"
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
          >
            <FaCalculator className="w-8 text-base" />
            <span>Audit Logs</span>
          </Link>
        </li>
        <li className="treeview">
          <a
            href="#"
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
            onClick={() => toggleTreeview("settings")}
          >
            <FaCog className="w-8 text-base" /> <span>Settings</span>
          </a>
          {/* Submenu for Settings if needed */}
        </li>
        <li className="py-3 px-4 text-white bg-[#1e2145] text-base font-semibold">
          Admin Control
        </li>
        <li className="treeview">
          <a
            href="#"
            className="flex items-center py-3 px-4 border-l-3 border-transparent text-[#b8c7ce] text-sm hover:text-white hover:bg-[#013357] hover:border-[#6c5ffc] transition-colors duration-200"
            onClick={() => toggleTreeview("admin")}
          >
            <FaUserTie className="w-8 text-base" />
            <span>Admin</span>
            <FaAngleLeft
              className={`ml-auto text-sm transition-transform duration-300 ${
                activeSidebarMenu.admin ? "-rotate-90" : ""
              }`}
            />
          </a>
          {activeSidebarMenu.admin && (
            <ul
              className={`list-none p-0 m-0 pl-1 bg-[#1e2145] transition-all duration-300 ease-in-out overflow-hidden ${
                activeSidebarMenu.admin ? "max-h-96" : "max-h-0"
              }`}
            >
              <li>
                <a
                  href="#"
                  className="flex items-center py-1.5 px-4 text-sm text-[#8aa4af] bg-[#1e2145] hover:text-white transition-colors duration-200"
                >
                  <FaUser className="w-8 text-base" />
                  User Management
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center py-1.5 px-4 text-sm text-[#8aa4af] bg-[#1e2145] hover:text-white transition-colors duration-200"
                >
                  <FaTools className="w-8 text-base" />
                  Org Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center py-1.5 px-4 text-sm text-[#8aa4af] bg-[#1e2145] hover:text-white transition-colors duration-200"
                >
                  <FaFileInvoiceDollar className="w-8 text-base" />
                  Billing
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className="mt-5 px-4">
          <a
            href="#"
            className="flex justify-center items-center py-2 text-white rounded transition-colors duration-200"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="w-8 text-base" />
          </a>
        </li>
      </ul>
    </section>
  );
}

//
