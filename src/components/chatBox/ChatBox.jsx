import "./chat.css";
import NavigationBar from "./navigation";
import { useAuth } from "../../plugins/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";

export default function ChatBox() {
  const [rooms, setRooms] = useState([]);
  const { logout, getRoleFromToken,getUserIdFromToken } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [socket, setSocket] = useState(io);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  useEffect(() => {
    const currentRole = getRoleFromToken();
    setRole(currentRole);
  }, []);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const userId = getUserIdFromToken();
        const response = await fetch(`http://localhost:3010/api/rooms/user/${userId}`, {
          method: "GET",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        const roomsArray = responseData.payload.data;

        setTimeout(() => {
          setRooms(roomsArray);
          setLoading(false);
          setError(null);
        }, 205);
        // Wait 2 seconds even if data is ready
      } catch (err) {
        setError(err.message);
        setRooms([]);
      }
    };
    fetchRooms();
  }, []);

  function handleRoomSelection(room) {
    setSelectedRoom(room);
    const socket = io("http://localhost:3010");
    setSocket(socket);
  }

  return (
    <div className="flex">
      {/* Sidebar Toggle Button */}
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition duration-300"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-gray-100 dark:bg-gray-800 shadow-lg"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-center items-center font-extrabold text-3xl text-gray-800 dark:text-white">
            CHAT ROOMS
          </div>
          <br />

          {/* Rooms List */}
          <ul className="space-y-2 font-medium">
            {rooms?.length > 0 ? (
              rooms.map((room) => (
                <li
                  onClick={() => handleRoomSelection(room)}
                  key={room.id}
                  className={`border rounded-md cursor-pointer transition duration-300 ${
                    selectedRoom?.id === room.id
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="flex items-center p-3 rounded-lg group">
                    <span className="ms-3">{room.name}</span>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">
                Loading...
              </p>
            )}
            {role === "admin" && (
              <li>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full border-2 px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition duration-300 mb-4"
                >
                  Admin Dashboard
                </button>
              </li>
            )}
            {/* Logout Button */}
            <li className="mt-4">
              <button
                onClick={() => {
                  logout(); // Clear auth state (via useAuth)
                  sessionStorage.removeItem("token"); // Explicitly remove token
                  navigate("/login"); // Redirect to login
                }}
                className="w-full border-2 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Chat Box */}
      <div className="p-4 sm:ml-64 w-full">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <NavigationBar room={selectedRoom} socket={socket} />
        </div>
      </div>
    </div>
  );
}
