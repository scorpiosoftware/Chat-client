import { useEffect, useState } from "react";
import { useAuth } from "../../plugins/AuthContext";
import logo from '../../assets/whatsapplogo.png';
const NavigationBar = ({ room, socket }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const { getUserIdFromToken } = useAuth();
  const [message, setMessage] = useState("");

  // Fetch chat history from the server
  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3010/api/chats/${room.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const chatdata = responseData.payload.data;
      setChatHistory(chatdata);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  // Set userId when the component mounts
  useEffect(() => {
    setUserId(getUserIdFromToken());
  }, [getUserIdFromToken]);

  // Join the room and fetch chat history when the room id is available
  useEffect(() => {
    if (room?.id) {
      socket.emit("joinRoom", room.id);
      fetchChatHistory();
    }
  }, [room, socket]);

  // Listen for incoming messages from the server
  useEffect(() => {
    const handleMessage = (msg) => {
      setChatHistory((prevChat) => [...prevChat, msg]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!message) return;

    const msgData = {
      content: message,
      user_id: userId,
      room_id: room.id,
    };

    socket.emit("message", msgData);

    // setChatHistory((prevChat) => [...prevChat, msgData]);
    setMessage("");
  };

  return (
    <div>
      <nav className="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl mx-4 mt-4">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              className="w-12 h-12 transition-transform duration-300 ease-in-out hover:scale-110"
              alt="Logo"
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500/80 uppercase tracking-wider">
                Current Room
              </span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                {room.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100/40 rounded-xl transition-all duration-200">
              <span className="material-icons text-gray-600">notifications</span>
            </button>
            <div className="h-8 w-px bg-gray-200/80"></div>
            <button className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-xl transition-all duration-200">
              <span className="text-white font-medium">Join Room</span>
              <span className="material-icons text-white/80 text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </nav>
      <div className="relative h-[650px] mt-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-lg">
        <div className="grid gap-4 p-4">
          {chatHistory.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.user_id === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`inline-block max-w-[75%] rounded-xl p-3 text-sm transition-all duration-200 ease-in-out transform hover:scale-105 ${msg.user_id === userId
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                  }`}
              >
                {msg.user_id !== userId && (
                  <div className="text-xs font-semibold text-gray-600 mb-1">{`${msg.name}:`}</div>
                )}
                <div className="break-words">{msg.content}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {msg.created_at}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative bottom-0 w-full flex gap-x-4 mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-6 py-4 rounded-full border-2 border-gray-200 hover:border-blue-400 
             focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
             shadow-lg hover:shadow-xl focus:shadow-2xl transition-all duration-300
             placeholder-gray-400 placeholder-opacity-80 focus:placeholder-opacity-50
             bg-white text-gray-700 text-lg font-light"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="relative px-6 py-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 
             border-2 border-green-500/30 shadow-lg hover:shadow-xl 
             text-white font-semibold tracking-wide 
             transform transition-all duration-300 ease-out 
             hover:scale-95 hover:rotate-1 hover:skew-x-1 
             active:scale-90 active:rotate-0 active:skew-x-0 
             focus:outline-none focus:ring-4 focus:ring-green-200/50 
             overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
          <span className="relative z-10 drop-shadow-md">Send</span>
          <span className="absolute inset-0 rounded-full border-2 border-white/10 pointer-events-none"></span>
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
