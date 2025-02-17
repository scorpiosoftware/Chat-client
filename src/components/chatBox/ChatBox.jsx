import "./chat.css";
import NavigationBar from "./navigation";
import { useAuth } from "../../plugins/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";

export default function ChatBox() {
  const [rooms, setRooms] = useState([]);
  const {logout} = useAuth();
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [socket, setSocket] = useState(io);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  if (!token) {
    navigate('/login');
  }
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3010/api/rooms", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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
        }, 2000);
        // Wait 2 seconds even if data is ready
      } catch (err) {
        setError(err.message);
        setRooms([]);
      }
    };
    fetchRooms();
  }, []);

  function handleRoomSelection(room){
    setSelectedRoom(room);
    const socket = io('http://localhost:3010');
    setSocket(socket);
  }

  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 d:text-gray-400 d:hover:bg-gray-700 d:focus:ring-gray-600"
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
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 d:bg-gray-800">
          <div className="flex justify-center items-center font-bold text-2xl">
            CHAT ROOMS
          </div>
          <br />
          <ul className="space-y-2 font-medium">
            {rooms?.length > 0 ? (
              rooms.map((room) => (
                <li
                  onClick={() => handleRoomSelection(room)}
                  key={room.id}
                  className="border rounded-md font-bold cursor-pointer"
                >
                  <div className="flex items-center p-2 text-gray-900 rounded-lg d:text-white hover:bg-gray-100 d:hover:bg-gray-700 group">
                    <span className="ms-3">{room.name}</span>
                  </div>
                </li>
              ))
            ) : (
              <p>Loading</p>
            )}
            <li>
              <button onClick={()=>logout()} className="border-2 px-3 py-2 rounded-full bg-red-400 text-white ">
              Logout
            </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* chat Box */}
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg d:border-gray-700">
          <NavigationBar room={selectedRoom} socket={socket} />
        </div>
      </div>
    </div>
  );
}
