import React, { useState } from "react";
import Header from "../Components/Header";
import SideMenu from "../Components/SideMenu";
import { Link } from "react-router-dom";

const data = [
  {
    resource: "DB-Server-1n",
    type: "DB",
    status: "Active",
    region: "us-east-1",
    action: "Patched by SecOps Agent",
  },
  {
    resource: "DB-Server-1n",
    type: "DB",
    status: "InActive",
    region: "us-east-1",
    action: "Patched by SecOps Agent",
  },
  {
    resource: "DB-Server-1n",
    type: "DB",
    status: "Active",
    region: "us-east-1",
    action: "Patched by SecOps Agent",
  },
  {
    resource: "DB-Server-1n",
    type: "DB",
    status: "Active",
    region: "us-east-1",
    action: "Patched by SecOps Agent",
  },
  {
    resource: "DB-Server-1n",
    type: "DB",
    status: "Active",
    region: "us-east-1",
    action: "Patched by SecOps Agent",
  },
  {
    resource: "DB-Server-1n",
    type: "DB",
    status: "Active",
    region: "us-east-1",
    action: "Patched by SecOps Agent",
  },
  {
    resource: "DB-Server-1n",
    type: "DB",
    status: "InActive",
    region: "us-east-1",
    action: "Patched by SecOps Agent",
  },
  {
    resource: "DB-Server-1n",
    type: "DB",
    status: "InActive",
    region: "us-east-1",
    action: "Patched by SecOps Agent",
  },
];

const agentLabels = {
  1: "FinOps Agent",
  2: "SecOps Agent",
  3: "DevOps Agent",
};

export default function ComputePage() {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("1");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidenav = () => setIsSidenavOpen(!isSidenavOpen);

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => setCurrentPage(page);

  const renderTable = () => (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-white bg-[#000030]">
          <tr>
            <th className="px-6 py-3 border-r">Resource</th>
            <th className="px-6 py-3 border-r">Type</th>
            <th className="px-6 py-3 border-r">Status</th>
            <th className="px-6 py-3 border-r">Region</th>
            <th className="px-6 py-3">AI-Agent Actions Taken</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => (
            <tr key={idx} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-3 border-r">{row.resource}</td>
              <td className="px-6 py-3 border-r">{row.type}</td>
              <td className="px-6 py-3 border-r">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    row.status === "Active"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-6 py-3 border-r">{row.region}</td>
              <td className="px-6 py-3">{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <Header toggleSidenav={toggleSidenav} />
      <SideMenu isSidenavOpen={isSidenavOpen} toggleSidenav={toggleSidenav} />

      <main className="p-8">
        {/* Title and Agent Dropdown */}
        <section className="mb-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-[#151D48]">
              Cloud Resource
            </h1>
            <select
              className="border border-gray-300 rounded px-4 py-2 text-sm shadow-sm"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              <option value="1">FinOps Agent</option>
              <option value="2">SecOps Agent</option>
              <option value="3">DevOps Agent</option>
            </select>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4 shadow-sm mb-4">
            <div className="text-sm text-gray-600">
              <Link to="/dashboard" className="text-blue-600 hover:underline">
                Home
              </Link>{" "}
              /
              <span className="text-gray-800 font-medium">
                {" "}
                Cloud Resources
              </span>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <h2 className="text-md font-semibold text-[#151D48]">
              {agentLabels[selectedAgent]}
            </h2>
          </div>
        </section>

        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Entries selector */}
          <div className="flex items-center space-x-2">
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-500">entries per page</span>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        {/* Table and Pagination */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          {renderTable()}

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4">
            <span className="text-sm text-gray-600 mb-2 md:mb-0">
              Showing <strong>{indexOfFirstItem + 1}</strong> to{" "}
              <strong>{Math.min(indexOfLastItem, filteredData.length)}</strong>{" "}
              of <strong>{filteredData.length}</strong> entries
            </span>
            <div className="flex space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                «
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-[#001e3c] text-white"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                ›
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                »
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
