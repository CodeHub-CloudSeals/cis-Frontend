import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";
import Header from "../Components/Header";
import SideMenu from "../Components/SideMenu";
import { Link } from "react-router-dom";

export default function CostOptimizationPage() {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const toggleSidenav = () => setIsSidenavOpen(!isSidenavOpen);

  const pieChartRef = useRef(null);
  const salesOvertimeChartRef = useRef(null);

  useEffect(() => {
    // Radar chart (Savings achieved explicitly by FinOps Agent)
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
          formatter: (val) => val,
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
          formatter: (val, i) => (i % 2 === 0 ? val : ""),
        },
      },
    };

    const pieChart = new ApexCharts(pieChartRef.current, pieChartOptions);
    pieChart.render();

    // Area chart (FinOps Cost Optimization)
    const salesOvertimeOptions = {
      series: [
        {
          name: "Revenue",
          data: [9, 15, 6, 10, 16, 9, 13, 17, 12, 10, 14, 17],
        },
        {
          name: "Order",
          data: [5, 3, 12, 5, 9, 14, 18, 9, 3, 13, 10, 8],
        },
      ],
      chart: {
        height: 350,
        type: "area",
        toolbar: { show: false },
      },
      colors: ["#7367F0", "#28C76F"],
      dataLabels: { enabled: false },
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

    return () => {
      pieChart.destroy();
      salesOvertimeChart.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <Header toggleSidenav={toggleSidenav} />
      <SideMenu isSidenavOpen={isSidenavOpen} toggleSidenav={toggleSidenav} />

      <main className="p-4">
        <section className="mb-6">
          <h1 className="text-2xl font-bold">Cost Optimization</h1>
        </section>
        <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4 mb-6 shadow-sm">
          <div className="text-sm text-gray-600">
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <span className="text-gray-800 font-medium">
              Cost Optimization
            </span>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">
              FinOps Cost Optimization
            </h2>
            <hr className="mb-4" />
            <div
              id="sales-overtime"
              ref={salesOvertimeChartRef}
              className="apex-charts w-full h-[350px]"
            ></div>
          </div>

          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">
              Savings achieved explicitly by FinOps Agent
            </h2>
            <hr className="mb-4" />
            <div
              id="pie-chart"
              ref={pieChartRef}
              className="apex-charts w-full h-[350px] flex justify-center"
            ></div>
          </div>
        </section>
      </main>
    </div>
  );
}
