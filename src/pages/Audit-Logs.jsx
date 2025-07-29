import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import SideMenu from "../Components/SideMenu";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../Constants/apiRoutes";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AuditLogs() {
  const navigate = useNavigate();
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [columnVisibility, setColumnVisibility] = useState({
    eventType: true,
    eventTime: true,
    viewDetails: true,
  });

  const columnDropdownRef = useRef(null);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  const columns = [
    {
      id: "eventType",
      name: "Event Type",
      selector: (log) => log.eventType.replace(/_/g, " "),
      visible: true,
    },
    {
      id: "eventTime",
      name: "Event Time",
      selector: (log) => new Date(log.eventTime).toLocaleString(),
      visible: true,
    },
  ];

  const handleOpenModal = (log) => {
    setSelectedLog(log);
  };

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

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
  }, [API_BASE_URL]);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered data based on search term
  const filteredLogs = auditLogs.filter((log) =>
    Object.values(log).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
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

  // --- Column Visibility Handlers ---
  const toggleColumnVisibility = (columnId) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [columnId]: !prevState[columnId],
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target)
      ) {
        setIsColumnDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const getTableDataForExport = (includeHiddenColumns = false) => {
    const headerRow = [];
    const dataRows = [];

    const exportableColumns = columns.filter(
      (col) => includeHiddenColumns || columnVisibility[col.id]
    );

    exportableColumns.forEach((col) => {
      headerRow.push(col.name);
    });
    if (columnVisibility.viewDetails) {
      headerRow.push("View Details");
    }

    filteredLogs.forEach((log) => {
      const row = [];
      exportableColumns.forEach((col) => {
        row.push(col.selector(log));
      });
      if (columnVisibility.viewDetails) {
        row.push("View Details (See App)");
      }
      dataRows.push(row);
    });

    return { header: headerRow, data: dataRows };
  };

  const handleCopy = () => {
    const { header, data } = getTableDataForExport(true);
    let csvContent = header.join("\t") + "\n";
    data.forEach((row) => {
      csvContent += row.join("\t") + "\n";
    });

    const textArea = document.createElement("textarea");
    textArea.value = csvContent;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      alert("Table data copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy table data.");
    }
    document.body.removeChild(textArea);
  };

  const handleExportExcel = () => {
    const { header, data } = getTableDataForExport(true);
    let csvContent = header.join(",") + "\n";
    data.forEach((row) => {
      csvContent +=
        row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(",") +
        "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // Feature detection for download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "audit_logs.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(
        "Your browser does not support downloading files directly. Please copy the data manually."
      );
    }
  };

  const handleExportPdf = () => {
    const { header, data } = getTableDataForExport(true);

    const doc = new jsPDF();
    autoTable(doc, {
      head: [header],
      body: data,
      startY: 20,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [0, 0, 48], // #000030
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        // Example: Adjust column widths if needed
        // 0: { cellWidth: 30 },
        // 1: { cellWidth: 40 },
      },
    });

    const blob = doc.output("blob");
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "audit_logs.pdf");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert(
        "Your browser does not support downloading files directly. Please try a different browser."
      );
    }
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

        {/* Action Buttons and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          {/* Segmented Button Group */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 text-white text-sm font-medium bg-[#6c5ffc]  transition-colors
                                rounded-l-md border border-r-0 border-indigo-700 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Copy
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center px-4 py-2 text-white text-sm font-medium bg-[#6c5ffc]  transition-colors
                                border-t border-b border-indigo-700 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              Excel
            </button>
            <button
              onClick={handleExportPdf}
              className="flex items-center px-4 py-2 text-white text-sm font-medium bg-[#6c5ffc]  transition-colors
                                border-t border-b border-r border-indigo-700 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              PDF
            </button>

            <div className="relative" ref={columnDropdownRef}>
              <button
                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                className="flex items-center px-4 py-2 text-white text-sm font-medium bg-[#6c5ffc]  transition-colors
                                    rounded-r-md border border-indigo-700 focus:z-10 focus:ring-2"
              >
                Column visibility
                <svg
                  className={`ml-2 w-4 h-4 transition-transform ${
                    isColumnDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {isColumnDropdownOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {columns.map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        checked={columnVisibility[col.id]}
                        onChange={() => toggleColumnVisibility(col.id)}
                      />
                      <span className="ml-2">{col.name}</span>
                    </label>
                  ))}
                  <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                      checked={columnVisibility.viewDetails}
                      onChange={() => toggleColumnVisibility("viewDetails")}
                    />
                    <span className="ml-2">View Details Button</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700 border-collapse">
            <thead className="text-xs text-white bg-[#000030]">
              <tr>
                {columns.map(
                  (col) =>
                    columnVisibility[col.id] && (
                      <th
                        key={col.id}
                        scope="col"
                        className={`px-6 py-3 ${
                          col.id === "eventType" ? "rounded-tl-lg" : ""
                        } border-r border-gray-300`}
                      >
                        {col.name}
                      </th>
                    )
                )}
                {columnVisibility.viewDetails && (
                  <th scope="col" className="px-6 py-3 rounded-tr-lg">
                    View Details
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      Object.values(columnVisibility).filter((v) => v).length
                    }
                    className="text-center py-4"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={
                      Object.values(columnVisibility).filter((v) => v).length
                    }
                    className="text-center py-4 text-red-500"
                  >
                    Error: {error}
                  </td>
                </tr>
              ) : currentLogs.length > 0 ? (
                currentLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    {columnVisibility.eventType && (
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
                    )}
                    {columnVisibility.eventTime && (
                      <td className="px-6 py-3 border-r border-gray-300">
                        {new Date(log.eventTime).toLocaleString()}
                      </td>
                    )}
                    {columnVisibility.viewDetails && (
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleOpenModal(log)}
                          className="bg-indigo-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-[#6c5ffc] transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b">
                  <td
                    colSpan={
                      Object.values(columnVisibility).filter((v) => v).length
                    }
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
