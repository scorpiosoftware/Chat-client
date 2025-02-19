import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import UsersView from "./dashboardContent/user/UsersView";
import { useAuth } from "../plugins/AuthContext";
const Dashboard = () => {
  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem("activeSection");
    return savedSection || "dashboard";
  });
  const { isAuthenticated, logout, getRoleFromToken } = useAuth();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const currentRole = getRoleFromToken();
    setRole(currentRole);
    setIsLoading(false); 
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
    if (role != "admin") {
      navigate("/chatBox");
    }
  }, [isAuthenticated, role, navigate]);

  function logoutHandler() {
    logout("/login");
  }

  // Save section to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);
  const sections = {
    dashboard: <DashboardContent />,
    users: <UsersView />,
    orders: <OrdersContent />,
    analytics: <AnalyticsContent />,
  };

  return (
    <div className="dashboard-container">
      {/* Fixed Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>CRM Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {Object.keys(sections).map((sectionKey) => (
              <li
                key={sectionKey}
                className={activeSection === sectionKey ? "active" : ""}
                onClick={() => setActiveSection(sectionKey)}
              >
                {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
              </li>
            ))}
            <li onClick={() => logoutHandler()}>Logout</li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">{sections[activeSection]}</div>
    </div>
  );
};

// Example content components
const DashboardContent = () => (
  <div>
    <h1>Dashboard Overview</h1>
    {/* Add dashboard content here */}
  </div>
);

const OrdersContent = () => (
  <div>
    <h1>Order Tracking</h1>
    {/* Add orders content here */}
  </div>
);

const AnalyticsContent = () => (
  <div>
    <h1>Analytics Reports</h1>
    {/* Add analytics content here */}
  </div>
);

export default Dashboard;
