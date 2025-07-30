import React, { useState } from "react";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import SideMenu from "../Components/SideMenu";
import { FaCopy } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

export default function WorkflowPage() {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidenav = () => setIsSidenavOpen(!isSidenavOpen);

  const dummyData = [
    {
      id: 1,
      aiPrediction: "SecOps prediction: SSL certificate expiring",
      approval: "Approval required",
      status: "Rejected",
    },
    {
      id: 2,
      aiPrediction: "SecOps prediction: SSL certificate expiring",
      approval: "Approval required",
      status: "Waiting for Approval",
    },
    {
      id: 3,
      aiPrediction: "SecOps prediction: SSL certificate expiring",
      approval: "Approval required",
      status: "Approved",
    },
    {
      id: 4,
      aiPrediction: "SecOps prediction: SSL certificate expiring",
      approval: "Approval required",
      status: "Approved",
    },
  ];

  const filteredData = dummyData.filter((item) =>
    item.aiPrediction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const statusClasses = {
    Approved: "bg-[#0dcaf0]",
    Rejected: "bg-[#dc3545]",
    "Waiting for Approval": "bg-[#6c5ffc]",
  };

  return (
    <div className="p-6 mt-20">
      <Header toggleSidenav={toggleSidenav} />
      <SideMenu isSidenavOpen={isSidenavOpen} toggleSidenav={toggleSidenav} />

      <div
        className={`transition-all duration-500 ${
          isSidenavOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        <h1 className="text-md font-bold text-[#151D48] mb-4">
          Workflow/Automations
        </h1>

        {/* Breadcrumb */}
        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4 mb-6 shadow-sm">
          <div className="text-sm text-gray-600">
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <span className="text-gray-800 font-medium">
              Workflow - Automations
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <select
              className="border border-gray-300 rounded-md p-2 text-sm"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-400">entries per page</span>
          </div>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
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
              className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-white bg-[#000030]">
              <tr>
                <th className="px-6 py-3 border-r">AI Prediction</th>
                <th className="px-6 py-3 border-r">Manual Approval</th>
                <th className="px-6 py-3 border-r">Automated Action</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-3 border-r">{item.aiPrediction}</td>
                  <td className="px-6 py-3 border-r">{item.approval}</td>
                  <td className="px-6 py-3 border-r">
                    <span
                      className={`px-3 py-1 rounded-md text-xs text-white font-semibold ${
                        statusClasses[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex items-center space-x-2 text-lg">
                    <FaCopy className="text-purple-600 cursor-pointer" />
                    <span className="text-gray-400">/</span>
                    <FaEdit
                      className="text-red-500 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav className="flex flex-col md:flex-row justify-between items-center pt-4">
          <span className="text-sm font-normal text-gray-700 mb-4 md:mb-0">
            Showing{" "}
            <span className="text-sm text-gray-900">
              {indexOfFirst + 1} to {Math.min(indexOfLast, filteredData.length)}
            </span>{" "}
            of{" "}
            <span className="text-sm text-gray-900">{filteredData.length}</span>{" "}
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
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 pt-24">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
              <div className="flex justify-between items-center px-5 py-4 border-b bg-gray-100">
                <h2 className="text-lg font-bold text-gray-800">
                  Edit Details
                </h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-red-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="px-6 py-10 text-sm text-gray-700 space-y-3">
                {/* <p>{selectedItem.aiPrediction}</p>
                <p>Status: {selectedItem.status}</p>
                <p>Approval: {selectedItem.approval}</p> */}
                <p>show the log details and give option to edit</p>
              </div>
              <div className="flex justify-end px-6 py-3 border-t bg-gray-50">
                <button
                  onClick={() => setSelectedItem(null)}
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
