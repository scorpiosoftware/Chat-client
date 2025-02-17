import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes,Navigate  } from "react-router-dom";
import Register from "./components/register";
import Login from "./components/Login";
import { AuthProvider } from './plugins/AuthContext';
import Dashboard from "./components/Dashboard";
import ChatBox from "./components/chatBox/ChatBox";
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
  <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<App />} /> */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Navigate to="/login" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chatBox" element={<ChatBox />} />
    </Routes>
  </BrowserRouter>
  </AuthProvider>

);
