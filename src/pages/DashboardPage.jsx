import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";
import { FaArrowUp, FaArrowDown, FaExternalLinkAlt } from "react-icons/fa";
import {
  FaPersonCircleCheck,
  FaPersonCircleExclamation,
  FaServer,
} from "react-icons/fa6";
import { MdMonitorHeart, MdRule } from "react-icons/md";
import { TbMoneybag, TbCloudUpload } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import SideMenu from "../Components/SideMenu";

export default function DashboardPage() {
  const navigate = useNavigate();

  // State for UI elements
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("FinOps");

  // Refs for chart elements
  const pieChartRef = useRef(null);
  const costTrendChartRef = useRef(null);
  const complianceHeatmapChartRef = useRef(null);
  const salesOvertimeChartRef = useRef(null);

  // Function to toggle sidebar (now passed to Header and SideMenu)
  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  useEffect(() => {
    const counters = document.querySelectorAll(".counter");
    counters.forEach((counter) => {
      const target = parseInt(counter.textContent.replace(/[^0-9.-]/g, ""));
      let current = 0;
      const duration = 4000;
      const increment = target / (duration / 10);

      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      updateCounter();
    });
  }, []);

  // use effect for Prevent back button
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // use effect for Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const pieChartOptions = {
      series: [
        {
          name: "Series 1",
          data: [20, 100, 40, 30, 50, 80, 33],
        },
      ],
      chart: {
        height: 350,
        type: "radar",
        toolbar: { show: true },
      },
      title: {
        text: "Radar with Polygon Fill",
        align: "left",
        style: {
          color: "#151D48",
          fontSize: "14px",
          fontFamily: "Open Sans, sans-serif",
          fontWeight: 600,
        },
      },
      dataLabels: { enabled: true },
      plotOptions: {
        radar: {
          size: 140,
          polygons: {
            strokeColors: "#e9e9e9",
            fill: { colors: ["#f8f8f8", "#fff"] },
          },
        },
      },
      colors: ["#FF4560"],
      markers: {
        size: 4,
        colors: ["#fff"],
        strokeColor: "#FF4560",
        strokeWidth: 2,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      xaxis: {
        categories: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
      yaxis: {
        labels: {
          formatter: function (val, i) {
            if (i % 2 === 0) {
              return val;
            } else {
              return "";
            }
          },
        },
      },
    };
    const pieChart = new ApexCharts(pieChartRef.current, pieChartOptions);
    pieChart.render();

    // Cost Trend Line Chart
    const costTrendOptions = {
      series: [{ data: [0, -41, 35, -51, 0, 62, -69, 32, -32, 54, 16, -50] }],
      chart: {
        height: 350,
        type: "area",
        zoom: { enabled: false },
        toolbar: { show: true },
      },
      dataLabels: { enabled: false },
      title: {
        text: "Negative color for values less than 0",
        align: "left",
        style: {
          color: "#151D48",
          fontSize: "14px",
          fontFamily: "Open Sans, sans-serif",
          fontWeight: 600,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      stroke: { width: 0 },
      plotOptions: {
        line: {
          colors: {
            threshold: 0,
            colorAboveThreshold: "#B3E5FC",
            colorBelowThreshold: "#B3E5FC",
          },
        },
      },
    };
    const costTrendChart = new ApexCharts(
      costTrendChartRef.current,
      costTrendOptions
    );
    costTrendChart.render();

    // Compliance Heatmap Chart
    const complianceHeatmapOptions = {
      series: [
        {
          data: [
            { x: "2008", y: [2800, 4500] },
            { x: "2009", y: [3200, 4100] },
            { x: "2010", y: [2950, 7800] },
            { x: "2011", y: [3000, 4600] },
            { x: "2012", y: [3500, 4100] },
            { x: "2013", y: [4500, 6500] },
            { x: "2014", y: [4100, 5600] },
          ],
        },
      ],
      chart: {
        height: 350,
        type: "rangeBar",
        zoom: { enabled: false },
        toolbar: { show: true },
      },
      plotOptions: {
        bar: {
          isDumbbell: true,
          columnWidth: 3,
          dumbbellColors: [["#008FFB", "#00E396"]],
        },
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        position: "top",
        horizontalAlign: "left",
        customLegendItems: ["Product A", "Product B"],
      },
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          gradientToColors: ["#00E396"],
          inverseColors: true,
          stops: [0, 100],
        },
      },
      grid: {
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
      },
      xaxis: { tickPlacement: "on" },
    };
    const complianceHeatmapChart = new ApexCharts(
      complianceHeatmapChartRef.current,
      complianceHeatmapOptions
    );
    complianceHeatmapChart.render();

    // Sales Overtime Chart (Line Chart)
    const salesOvertimeOptions = {
      series: [
        {
          name: "Revenue",
          data: [9, 15, 6, 10, 16, 9, 13, 17, 12, 10, 14, 17], // sample data
        },
        {
          name: "Order",
          data: [5, 3, 12, 5, 9, 14, 18, 9, 3, 13, 10, 8], // sample data
        },
      ],
      chart: {
        height: 350,
        type: "area",
        toolbar: { show: false },
      },
      colors: ["#7367F0", "#28C76F"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 95, 100],
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        markers: {
          radius: 12,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            colors: "#6e6b7b",
            fontSize: "13px",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => `$${val}K`,
          style: {
            colors: "#6e6b7b",
            fontSize: "13px",
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `$${val}K`,
        },
      },
      grid: {
        borderColor: "#e7e7e7",
        strokeDashArray: 4,
      },
    };
    const salesOvertimeChart = new ApexCharts(
      salesOvertimeChartRef.current,
      salesOvertimeOptions
    );
    salesOvertimeChart.render();

    // Cleanup function for charts
    return () => {
      pieChart.destroy();
      costTrendChart.destroy();
      complianceHeatmapChart.destroy();
      salesOvertimeChart.destroy();
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  return (
    <div className="font-poppins bg-[#F0F3F9] min-h-screen">
      {/* Header Component */}
      <Header toggleSidenav={toggleSidenav} />

      {/* Sidenav Component */}
      <SideMenu isSidenavOpen={isSidenavOpen} toggleSidenav={toggleSidenav} />

      {/* Main Content Area */}
      <main
        className={`pt-24 transition-all duration-500 ${
          isSidenavOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        {/* KPI Widgets Section */}
        <section className="mt-5 px-4">
          <div className="container-fluid">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg text-[#151D48] font-bold font-open-sans">
                KPI Widgets
              </h1>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 bg-white text-[#151D48] focus:outline-none"
              >
                <option value="FinOps">FinOps Agent</option>
                <option value="SecOps">SecOps Agent</option>
                <option value="DevOps">DevOps Agent</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center justify-center">
              {selectedAgent === "FinOps" && (
                <>
                  <h2 className="text-[#151D48] text-lg font-medium col-span-full">
                    FinOps Predicted Spend
                  </h2>
                  {/* Cloud Spend */}
                  <div className="bg-white rounded-lg shadow-md p-4 min-h-[110px] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TbCloudUpload className="text-[#6c5ffc] text-xl" />
                        <h5 className="text-base font-medium text-[#151D48]">
                          Cloud Spend
                        </h5>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-medium text-black">$102</p>
                        <p className="text-xs text-gray-500 -mt-1">Per month</p>
                        <p className="text-sm text-black -mt-1">
                          -10 <FaArrowUp className="inline-block" />
                        </p>
                      </div>
                    </div>
                    <svg
                      viewBox="0 0 100 40"
                      preserveAspectRatio="none"
                      className="w-full h-12 mt-2"
                    >
                      <defs>
                        <linearGradient
                          id="cloudGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#00CFE8"
                            stopOpacity="0.4"
                          />
                          <stop
                            offset="100%"
                            stopColor="#00CFE8"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 35 C 20 25, 40 30, 60 20 C 80 10, 100 30, 100 30 L100 40 L0 40 Z"
                        fill="url(#cloudGradient)"
                      />
                      <path
                        d="M0 35 C 20 25, 40 30, 60 20 C 80 10, 100 30, 100 30"
                        fill="none"
                        stroke="#00CFE8"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  {/* Cost Savings */}
                  <div className="bg-white rounded-lg shadow-md p-4 min-h-[130px] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TbMoneybag className="text-[#6c5ffc] text-xl" />
                        <h5 className="text-base font-medium text-[#151D48]">
                          Cost Savings
                        </h5>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-medium text-black">$102</p>
                        <p className="text-xs text-gray-500 -mt-1">Per month</p>
                        <p className="text-sm text-black -mt-1">
                          -10 <FaArrowDown className="inline-block" />
                        </p>
                      </div>
                    </div>
                    <svg
                      viewBox="0 0 100 40"
                      preserveAspectRatio="none"
                      className="w-full h-12 mt-2"
                    >
                      <defs>
                        <linearGradient
                          id="savingsGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#28C76F"
                            stopOpacity="0.4"
                          />
                          <stop
                            offset="100%"
                            stopColor="#28C76F"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 30 C 20 20, 40 25, 60 25 C 80 25, 100 20, 100 20 L100 40 L0 40 Z"
                        fill="url(#savingsGradient)"
                      />
                      <path
                        d="M0 30 C 20 20, 40 25, 60 25 C 80 25, 100 20, 100 20"
                        fill="none"
                        stroke="#28C76F"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </>
              )}

              {selectedAgent === "SecOps" && (
                <>
                  <h2 className="text-[#151D48] text-lg font-semibold col-span-full">
                    SecOps Compliance Insights
                  </h2>
                  {/* Compliance Status */}
                  <div className="bg-white rounded-lg shadow-md p-4 min-h-[140px] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MdRule className="text-[#6c5ffc] text-xl" />
                        <h5 className="text-base font-medium text-[#151D48]">
                          Compliance Status
                        </h5>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-base font-medium text-black">
                          $101.21
                        </p>
                        <p className="text-xs text-gray-500 -mt-1">Per month</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[25%]" />
                    </div>
                    <div className="flex justify-between text-xs text-[#151D48] mt-2 px-1">
                      <span>
                        Start Date: <strong>10th JAN</strong>
                      </span>
                      <span>
                        End Date: <strong>29th JAN</strong>
                      </span>
                    </div>
                  </div>

                  {/* Agent Health */}
                  <div className="bg-white rounded-lg shadow-md p-4 min-h-[140px] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MdMonitorHeart className="text-[#6c5ffc] text-xl" />
                        <h5 className="text-base font-medium text-[#151D48]">
                          Agent Health
                        </h5>
                      </div>
                      <p className="text-base font-medium text-black">Good</p>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[40%]" />
                    </div>
                    <div className="flex justify-between text-xs text-[#151D48] mt-2 px-1">
                      <span>
                        Start Date: <strong>10th JAN</strong>
                      </span>
                      <span>
                        End Date: <strong>29th JAN</strong>
                      </span>
                    </div>
                  </div>
                </>
              )}

              {selectedAgent === "DevOps" && (
                <>
                  <h2 className="text-[#151D48] text-lg font-medium col-span-full">
                    DevOps Agent
                  </h2>
                  <div className="bg-white rounded-lg shadow-md p-4 min-h-[140px] flex flex-col justify-between col-span-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MdMonitorHeart className="text-[#6c5ffc] text-xl" />
                        <h5 className="text-base font-medium text-[#151D48]">
                          Agent Health
                        </h5>
                      </div>
                      <p className="text-base font-medium text-black">Good</p>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[40%]" />
                    </div>
                    <div className="flex justify-between text-xs text-[#151D48] mt-2 px-1">
                      <span>
                        Start Date: <strong>10th JAN</strong>
                      </span>
                      <span>
                        End Date: <strong>29th JAN</strong>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Total Revenue Section */}
        <section className="mt-8 px-4">
          <div className="container-fluid">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Usage Graph */}
              <div className="bg-white rounded-lg shadow-md p-4 pt-2">
                <h2 className="text-base text-[#151D48] font-medium font-open-sans mt-5 mb-2">
                  Usage Graph
                </h2>
                <hr className="my-2 border-gray-400" />
                <div
                  id="sales-overtime"
                  ref={salesOvertimeChartRef}
                  className="apex-charts w-full h-[350px]"
                ></div>
              </div>
              {/* Recent Activity Feed */}
              <div className="bg-white rounded-lg shadow-md p-4 pt-2">
                <h2 className="text-base text-[#151D48] font-medium font-open-sans mt-5 mb-2">
                  Recent Activity Feed
                </h2>
                <hr className="my-2 border-gray-400" />
                <ul className="list-none p-0">
                  <li className="flex items-center py-5 border-b border-[#cdd6dd]">
                    <FaServer className="mr-3 text-base text-[#6c5ffc]" />
                    <span className="text-base text-[#151D48]">
                      Agent deployed on server X
                    </span>
                  </li>
                  <li className="flex items-center py-5 border-b border-[#cdd6dd]">
                    <FaPersonCircleCheck className="mr-3 text-base text-[#6c5ffc]" />
                    <span className="text-base text-[#151D48]">
                      User John approved resource change
                    </span>
                  </li>
                  <li className="flex items-center py-5">
                    <FaPersonCircleExclamation className="mr-3 text-base text-[#6c5ffc]" />
                    <span className="text-base text-[#151D48]">
                      Alert triggered: High CPU Usage
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Content Section */}
        <section className="mt-8 px-4 mb-20">
          <div className="container-fluid">
            <h1 className="text-lg text-[#151D48] font-medium my-5 font-open-sans text-center lg:text-left">
              Visualization
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Resource Usage Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-4 pt-2">
                <h2 className="text-base text-[#151D48] font-medium font-open-sans mt-5 mb-2">
                  Resource Usage Pie Chart
                </h2>
                <hr className="my-2 border-gray-400" />
                <div
                  id="pie-chart"
                  ref={pieChartRef}
                  className="apex-charts flex justify-center w-full h-[350px]"
                ></div>
              </div>
              {/* Cost Trend Line */}
              <div className="bg-white rounded-lg shadow-md p-4 pt-2">
                <h2 className="text-base text-[#151D48] font-medium font-open-sans  mt-5 mb-2">
                  Cost Trend Line
                </h2>
                <hr className="my-2 border-gray-400" />
                <div
                  id="cost-trend-chart"
                  ref={costTrendChartRef}
                  className="apex-charts flex justify-center w-full h-[350px]"
                ></div>
              </div>
              {/* Compliance Heatmap */}
              <div className="bg-white rounded-lg shadow-md p-4 pt-2">
                <h2 className="text-base text-[#151D48] font-medium font-open-sans  mt-5 mb-2">
                  Compliance Heatmap
                </h2>
                <hr className="my-2 border-gray-400" />
                <div
                  id="Compliance-Heatmap-chart"
                  ref={complianceHeatmapChartRef}
                  className="apex-charts flex justify-center w-full h-[350px]"
                ></div>
              </div>
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-4 pt-2">
                <h2 className="text-base text-[#151D48] font-medium font-open-sans mt-5 mb-2">
                  Quick Actions
                </h2>
                <hr className="my-2 border-gray-400" />
                <ul className="list-none p-0">
                  <li className="py-5 border-b border-[#cdd6dd]">
                    <span className="text-base text-[#151D48]">
                      Agent deployed on server X
                    </span>
                  </li>
                  <li className="py-5 border-b border-[#cdd6dd]">
                    <span className="text-base text-[#151D48]">
                      User John approved resource change
                    </span>
                  </li>
                  <li className="py-5">
                    <span className="text-base text-[#151D48]">
                      Alert triggered: High CPU Usage
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
