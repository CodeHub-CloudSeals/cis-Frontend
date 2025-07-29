import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import SideMenu from "../Components/SideMenu";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../Constants/apiRoutes";

export default function AuditLogs() {
  const navigate = useNavigate();
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleOpenModal = (log) => {
    setSelectedLog(log);
  };

  // use effect for Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}${API_ROUTES.AUDIT_LOG}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAuditLogs(response.data);
        setError(null);
      } catch (err) {
        console.error(
          "Failed to fetch audit logs:",
          err?.response || err.message
        );
        setError("Unauthorized or failed to fetch audit logs.");
        setAuditLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered data based on search term
  const filteredLogs = auditLogs.filter((log) =>
    log.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredLogs.length / entriesPerPage);

  // Get current agents for the page
  const indexOfLastLog = currentPage * entriesPerPage;
  const indexOfFirstLog = indexOfLastLog - entriesPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <h1 className="text-md font-bold text-[#151D48] mb-4">Audit Logs</h1>
        {/* Breadcrumbs */}
        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4 mb-6 shadow-sm">
          <div className="text-sm text-gray-600">
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              Home
            </Link>{" "}
            / <span className="text-gray-800 font-medium">Audit Logs</span>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700 border-collapse">
            <thead className="text-xs text-white bg-[#000030]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 rounded-tl-lg border-r border-gray-300 w-1/3"
                >
                  Event Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 border-r border-gray-300 w-1/3"
                >
                  Event Time
                </th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg">
                  View Details
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-red-500">
                    Error: {error}
                  </td>
                </tr>
              ) : currentLogs.length > 0 ? (
                currentLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap border-r border-gray-300">
                      <span
                        className={`px-3 py-1 rounded-md text-xs cursor-pointer font-semibold ${
                          log.eventType === "USER_LOGIN"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {log.eventType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3 border-r border-gray-300">
                      {new Date(log.eventTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleOpenModal(log)}
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
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No audit logs found.
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
              {filteredLogs.length > 0 ? indexOfFirstLog + 1 : 0} to{" "}
              {Math.min(indexOfLastLog, filteredLogs.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {filteredLogs.length}
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

        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 pt-24 overflow-y-auto">
            <div className="bg-white rounded-md shadow-lg w-full max-w-md mx-auto my-8">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Audit Log Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Event ID:</strong> {selectedLog.id}
                </p>
                <p>
                  <strong>Event Type:</strong>{" "}
                  {selectedLog.eventType.replace(/_/g, " ")}
                </p>
                <p>
                  <strong>Event Time:</strong>{" "}
                  {new Date(selectedLog.eventTime).toLocaleString()}
                </p>
                <p>
                  <strong>User ID:</strong> {selectedLog.userId}
                </p>
                <p>
                  <strong>Agent ID:</strong> {selectedLog.agentId}
                </p>
                <p>
                  <strong>Organization ID:</strong> {selectedLog.organizationId}
                </p>
                <div>
                  <strong>Details:</strong>
                  <pre className="bg-gray-100 p-2 rounded-md mt-1 text-xs whitespace-pre-wrap break-all">
                    {JSON.stringify(
                      JSON.parse(selectedLog.detailsJson),
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
              <div className="flex justify-end p-3 border-t">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
