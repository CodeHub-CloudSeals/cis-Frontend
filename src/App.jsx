import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import AiAgents from "./pages/Ai-Agents";
import Footer from "./Components/Footer";
import AuditLogs from "./pages/Audit-Logs";
import ActivateUser from "./pages/ActivateUser";
import WorkflowPage from "./pages/WorkflowAndAutomations";
import CostOptimizationPage from "./pages/CostOptimization";
import ComputePage from "./pages/ComputePage";

function AppContent() {
  const location = useLocation();

  // Hide footer on landing and login pages
  const hideFooterRoutes = ["/", "/login"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ai-agents" element={<AiAgents />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="/cost-optimization" element={<CostOptimizationPage />} />
          <Route path="/activateUser" element={<ActivateUser />} />
          <Route path="/compute" element={<ComputePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
