import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import UsersView from "./dashboardContent/user/UsersView";
import { useAuth } from "../plugins/AuthContext";
import RoomView from "./dashboardContent/room/RoomView";
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
  // Save section to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);
  const sections = {
    dashboard: <DashboardContent />,
    users: <UsersView />,
    rooms: <RoomView />,
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
            <li className="bg-green-400 font-bold" onClick={() => navigate("/chatbox")}>chatbox</li>
            <li className="bg-red-400 font-bold" onClick={() => logout("/login")}>Logout</li>

          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">{sections[activeSection]}</div>
    </div>
  );
};

const DashboardContent = () => (
  <div>
    <h1>Dashboard Overview</h1>
  </div>
);
export default Dashboard;
