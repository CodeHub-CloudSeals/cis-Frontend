import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import SideMenu from "../Components/SideMenu";
import { API_ROUTES } from "../Constants/apiRoutes";

export default function AiAgents() {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [aiAgentsData, setAiAgentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token not available yet. Waiting...");
      return;
    }

    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ROUTES.AI_AGENT}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rawData = Array.isArray(response.data)
          ? response.data
          : [response.data];

        const transformed = rawData.map((item) => ({
          id: item.id,
          name: item.name || "Unnamed Agent",
          deployedAt: new Date(item.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          status: item.status === "active" ? "Running" : "Idle",
        }));

        setAiAgentsData(transformed);
        setLoading(false);
      } catch (err) {
        console.error(
          "Failed to fetch AI Agents:",
          err?.response || err.message
        );
        setError("Unauthorized or failed to fetch AI agents");
        setLoading(false);
      }
    };

    fetchAgents();
  }, [localStorage.getItem("token")]);

  const handleViewDetails = async (agentId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ROUTES.AI_AGENT}/${agentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      const agentDetails = {
        id: data.id,
        name: data.name,
        status: data.status,
        agentType: data.agentType,
        config: JSON.parse(data.configJson || "{}"),
        deployedAt: new Date(data.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        user: {
          username: data.createdBy?.username || "N/A",
          email: data.createdBy?.email || "N/A",
          role: data.createdBy?.role || "N/A",
          status: data.createdBy?.status || "N/A",
        },
      };

      console.log("Fetched agent details:", agentDetails);
      setSelectedAgent(agentDetails);
    } catch (err) {
      console.error("Error fetching agent details:", err);

      if (err.response) {
        console.error(
          "Server responded with:",
          err.response.status,
          err.response.data
        );
      } else if (err.request) {
        console.error(
          "Request was made but no response received:",
          err.request
        );
      } else {
        console.error(
          "Something went wrong setting up the request:",
          err.message
        );
      }
    }
  };

  const filteredAgents = aiAgentsData.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgents.length / entriesPerPage);
  const indexOfLastAgent = currentPage * entriesPerPage;
  const indexOfFirstAgent = indexOfLastAgent - entriesPerPage;
  const currentAgents = filteredAgents.slice(
    indexOfFirstAgent,
    indexOfLastAgent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 mt-20">
      <Header toggleSidenav={toggleSidenav} />
      <SideMenu isSidenavOpen={isSidenavOpen} toggleSidenav={toggleSidenav} />

      <div
        className={`p-2 pt-2 transition-all duration-500 ${
          isSidenavOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        <h1 className="text-md font-bold text-[#151D48] mb-4">AI Agents</h1>

        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4 mb-6 shadow-sm">
          <div className="text-sm text-gray-600">
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>{" "}
            / <span className="text-gray-800 font-medium">AI Agents</span>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              className="border border-gray-300 rounded-md p-2 text-sm"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-400">entries per page</span>
          </div>

          <div className="flex items-center w-full md:w-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdSearch className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search:"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="block p-2 pl-10 text-sm border border-gray-300 rounded-lg w-full"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <div className="text-center p-4 text-gray-500">
            Loading AI agents...
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-white bg-[#000030]">
                <tr>
                  <th className="px-6 py-3 border-r">Name</th>
                  <th className="px-6 py-3 border-r">Deployed At</th>
                  <th className="px-6 py-3 border-r">Status</th>
                  <th className="px-6 py-3">View Details</th>
                </tr>
              </thead>
              <tbody>
                {currentAgents.length > 0 ? (
                  currentAgents.map((agent, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-3 border-r">{agent.name}</td>
                      <td className="px-6 py-3 border-r">{agent.deployedAt}</td>
                      <td className="px-6 py-3 border-r">
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-semibold ${
                            agent.status === "Running"
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleViewDetails(agent.id)}
                          className="bg-indigo-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-indigo-600"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center px-6 py-4 text-gray-500"
                    >
                      No agents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <nav className="flex flex-col md:flex-row justify-between items-center pt-4">
          <span className="text-sm font-normal text-gray-700 mb-4 md:mb-0">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {indexOfFirstAgent + 1} to{" "}
              {Math.min(indexOfLastAgent, filteredAgents.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {filteredAgents.length}
            </span>{" "}
            entries
          </span>

          <ul className="inline-flex items-center space-x-1 bg-[#f5f8fc] px-2 py-1 rounded-lg shadow-sm">
            <li>
              <button
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-blue-600 bg-white hover:bg-blue-50"
                }`}
              >
                «
              </button>
            </li>
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-blue-600 bg-white hover:bg-blue-50"
                }`}
              >
                ‹
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i}>
                <button
                  onClick={() => paginate(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                    currentPage === i + 1
                      ? "bg-[#001e3c] text-white"
                      : "text-blue-600 bg-white hover:bg-blue-50"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-blue-600 bg-white hover:bg-blue-50"
                }`}
              >
                ›
              </button>
            </li>
            <li>
              <button
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-blue-600 bg-white hover:bg-blue-50"
                }`}
              >
                »
              </button>
            </li>
          </ul>
        </nav>

        {/* Modal */}
        {selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 pt-24">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-4 border-b bg-gray-100">
                <h2 className="text-lg font-bold text-gray-800">
                  AI Agent Details
                </h2>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-500 hover:text-red-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 text-sm text-gray-700 space-y-3">
                {[
                  { label: "Agent Name", value: selectedAgent.name },
                  { label: "Agent Status", value: selectedAgent.status },
                  { label: "Deployed At", value: selectedAgent.deployedAt },
                  { label: "Username", value: selectedAgent.user.username },
                  { label: "Email", value: selectedAgent.user.email },
                  { label: "Role", value: selectedAgent.user.role },
                  { label: "User Status", value: selectedAgent.user.status },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium text-gray-600 w-32">
                      {item.label}:
                    </span>
                    <span className="text-gray-900 break-words text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-end px-6 py-3 border-t bg-gray-50">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
