import React from "react";
import { useNavigate } from "react-router-dom";
import { IoShieldHalfOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa6";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaCloud,
  FaRobot,
} from "react-icons/fa";
import introBg from "../assets/intro.png";
import logo from "../assets/logo.svg";
import { MdMail } from "react-icons/md";

const App = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white font-inter flex flex-col items-center py-2"
      style={{
        backgroundImage: `url(${introBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <section className="text-center mb-16 w-full px-4 sm:px-6 lg:px-8">
        <img src={logo} alt="Logo" className="w-24 mx-auto mb-6" />
        <h1 className="text-lg sm:text-5xl font-medium mb-14">
          Product Highlights
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <ProductHighlightCard
            icon={<FaCloud size={28} />}
            title="Multi-Cloud Orchestration"
            description="Manage resources seamlessly across AWS, Azure, and GCP."
          />

          <ProductHighlightCard
            icon={<IoShieldHalfOutline size={28} />}
            title="Ethical AI"
            description="Ensure fairness, transparency, and accountability in decision making."
          />

          <ProductHighlightCard
            icon={<FaRobot size={28} />}
            title="AgentOps"
            description="Autonomous AI agents to optimize and operate cloud workloads."
          />

          <ProductHighlightCard
            icon={<FaEye size={28} />}
            title="Explainable Decisions"
            description="Understand why AI made a decision with detailed traceability."
          />
        </div>
      </section>

      <button
        onClick={() => navigate("/login")}
        className="mb-20 px-14 py-3 text-blue-500 text-sm font-medium rounded-lg bg-[#050b24] border-t-2 border-l-2 border-r-2 border-blue-500 shadow-[0_-4px_12px_rgba(0,123,255,0.4)] transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Skip
      </button>

      <div className="relative z-10 w-full ">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 text-sm text-center text-gray-300">
          <div className="flex justify-center space-x-4 mb-5">
            {[FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube, FaInstagram].map(
              (Icon, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer w-10 h-10 flex items-center justify-center
                  rounded-full border border-opacity-90 border-[#3c2958]
                  bg-black bg-opacity-80 text-white
                  transition-transform duration-300 ease-in-out
                  hover:scale-110 hover:bg-[#3166e8]"
                >
                  <Icon className="text-md" />
                </div>
              )
            )}
          </div>

          <p className="flex justify-center flex-wrap items-center gap-4 text-sm text-[#8b9199]">
            <span className="cursor-pointer hover:text-white transition-colors duration-200">
              Terms & Conditions
            </span>
            <span className="text-gray-500">|</span>
            <span className="cursor-pointer hover:text-white transition-colors duration-200">
              Privacy
            </span>
            <span className="text-gray-500">|</span>
            <span className="flex items-center gap-2">
              <MdMail className="text-lg" />
              info@cloudseals.com
            </span>
          </p>
        </div>
        <div className="w-full border-t border-[#3c2958] opacity-100 mt-3"></div>
        <footer className="backdrop-filter backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3">
            <p className="text-center text-sm text-gray-400 mt-2 mb-2">
              © 2025 CloudSeals | All Rights Reserved
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

const ProductHighlightCard = ({ icon, title, description }) => {
  return (
    <div className="bg-transparent bg-opacity-10 backdrop-filter border border-gray-600 backdrop-blur-md rounded-2xl p-6 sm:p-12 flex flex-col items-center text-center shadow-xl transition duration-300 ease-in-out transform hover:scale-105 hover:bg-black hover:bg-opacity-80">
      <div className="mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-transparent border-2 border-[#2d306d80] shadow-sm">
        {icon}
      </div>

      <p className="text-base text-sm mb-6 text-gray-300">{description}</p>

      <h3 className="text-xl sm:text-lg font-medium mb-3 text-[#9393cb]">
        {title}
      </h3>

      <a
        href="#"
        className="text-[#8b9199] hover:underline font-medium text-sm sm:text-base"
      >
        Read more...
      </a>
    </div>
  );
};

export default App;
