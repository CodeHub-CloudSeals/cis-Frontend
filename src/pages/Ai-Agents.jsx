import React, { useEffect, useState, useRef } from "react";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import SideMenu from "../Components/SideMenu";

export default function AiAgents() {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleOpenModal = (agent) => {
    setSelectedAgent(agent);
  };

  // Dummy data for AI Agents table
  const [aiAgentsData, setAiAgentsData] = useState([
    { name: "Airi Satou", deployedAt: "2025-06-01", status: "Idle" },
    { name: "Angelica Ramos", deployedAt: "2025-06-01", status: "Running" },
    { name: "Ashton Cox", deployedAt: "2025-06-01", status: "Running" },
    { name: "Bradley Greer", deployedAt: "2025-06-01", status: "Running" },
    { name: "Brielle Williamson", deployedAt: "2025-06-01", status: "Running" },
    { name: "Caesar Vance", deployedAt: "2025-06-01", status: "Running" },
    { name: "Cedric Kelly", deployedAt: "2025-06-01", status: "Running" },
    { name: "Charde Marshall", deployedAt: "2025-06-01", status: "Running" },
    { name: "Colleen Hurst", deployedAt: "2025-06-01", status: "Running" },
    { name: "Dai Rios", deployedAt: "2025-06-01", status: "Idle" },
    // Add more dummy data to reach 29 entries for pagination example
    { name: "Gavin Joyce", deployedAt: "2025-06-02", status: "Running" },
    { name: "Jennifer Chang", deployedAt: "2025-06-02", status: "Idle" },
    { name: "Michael Bruce", deployedAt: "2025-06-02", status: "Running" },
    { name: "Donna Snider", deployedAt: "2025-06-02", status: "Idle" },
    { name: "Tiger Nixon", deployedAt: "2025-06-03", status: "Running" },
    { name: "Garrett Winters", deployedAt: "2025-06-03", status: "Idle" },
    { name: "Ashton Cox", deployedAt: "2025-06-03", status: "Running" },
    { name: "Cedric Kelly", deployedAt: "2025-06-03", status: "Running" },
    { name: "Airi Satou", deployedAt: "2025-06-04", status: "Idle" },
    { name: "Brielle Williamson", deployedAt: "2025-06-04", status: "Running" },
    { name: "Herrod Chandler", deployedAt: "2025-06-04", status: "Running" },
    { name: "Rhona Davidson", deployedAt: "2025-06-04", status: "Idle" },
    { name: "Colleen Hurst", deployedAt: "2025-06-05", status: "Running" },
    { name: "Jena Gaines", deployedAt: "2025-06-05", status: "Idle" },
    { name: "Quinn Flynn", deployedAt: "2025-06-05", status: "Running" },
    { name: "Haley Kennedy", deployedAt: "2025-06-05", status: "Running" },
    { name: "Tatyana Fitzpatrick", deployedAt: "2025-06-06", status: "Idle" },
    { name: "Michael Silva", deployedAt: "2025-06-06", status: "Running" },
    { name: "Paul Byrd", deployedAt: "2025-06-06", status: "Running" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered data based on search term
  const filteredAgents = aiAgentsData.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredAgents.length / entriesPerPage);

  // Get current agents for the page
  const indexOfLastAgent = currentPage * entriesPerPage;
  const indexOfFirstAgent = indexOfLastAgent - entriesPerPage;
  const currentAgents = filteredAgents.slice(
    indexOfFirstAgent,
    indexOfLastAgent
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to toggle sidebar
  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };
  return (
    <div className="p-6 mt-20">
      {/* Header Component */}
      <Header toggleSidenav={toggleSidenav} />
      {/* Sidenav Component */}
      <SideMenu isSidenavOpen={isSidenavOpen} toggleSidenav={toggleSidenav} />

      {/* Main Content Area */}
      <div
        className={`p-2 pt-2 transition-all duration-500 ${
          isSidenavOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        <h1 className="text-md font-bold text-[#151D48] mb-4">AI Agents</h1>
        {/* Breadcrumbs */}
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
              className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page on entries change
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-400 whitespace-nowrap">
              entries per page
            </span>
          </div>
          <div className="flex items-center w-full md:w-auto">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdSearch className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="table-search"
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search:"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
          </div>
        </div>

        {/* AI Agents Table */}
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700 border-collapse">
            <thead className="text-xs text-white bg-[#000030]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 rounded-tl-lg border-r border-gray-300"
                >
                  Name
                </th>
                <th scope="col" className="px-6 py-3 border-r border-gray-300">
                  Deployed At
                </th>
                <th scope="col" className="px-6 py-3 border-r border-gray-300">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg">
                  View Details
                </th>
              </tr>
            </thead>
            <tbody>
              {currentAgents.length > 0 ? (
                currentAgents.map((agent, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap border-r border-gray-300">
                      {agent.name}
                    </td>
                    <td className="px-6 py-3 border-r border-gray-300">
                      {agent.deployedAt}
                    </td>
                    <td className="px-6 py-3 border-r border-gray-300">
                      <span
                        className={`px-3 py-1 rounded-md text-xs cursor-pointer font-semibold ${
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
                        onClick={() => handleOpenModal(agent)}
                        className="bg-indigo-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-indigo-600 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b">
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
            {/* First Page */}
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

            {/* Previous */}
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

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i}>
                <button
                  onClick={() => paginate(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? "bg-[#001e3c] text-white"
                      : "text-blue-600 bg-white hover:bg-blue-50"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            {/* Next */}
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

            {/* Last Page */}
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

        {selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 pt-24">
            <div className="bg-white rounded-md shadow-lg w-full max-w-md mx-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">AI Agents Details</h2>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Name:</strong> {selectedAgent.name}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAgent.status}
                </p>
                <p>
                  <strong>Deployed At:</strong> {selectedAgent.deployedAt}
                </p>
              </div>
              <div className="flex justify-end p-3 border-t">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
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
