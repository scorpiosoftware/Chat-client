import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../plugins/AuthContext";

const NavigationBar = ({ room, socket }) => {
  const [chatHistory, SetChatHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const { getUserIdFromToken , logout } = useAuth();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  useEffect(() => {
    // Listen for incoming messages
    socket.on("message", (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    // Clean up the listener on unmount
    return () => {
      socket.off("message");
    };
  }, []);
  const sendMessage = () => {
    const msgData = {
      content: message,
      user_id: userId,   // Replace with actual user ID
      room_id: room.id,   // Replace with actual room ID
    };
    // Emit the message to the server
    if (!message)
      return;
    socket.emit("message", msgData);
    setMessage("");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3010/api/chats/${room.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const chatdata = responseData.payload.data;
        setUserId(getUserIdFromToken());
        SetChatHistory(chatdata);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        SetChatHistory([]); // Optional: Reset chat history on error
      }
    };
    fetchData();
  }, [room.id]);

  return (
    <div>
      <nav
        className="shadow-xl rounded-full"
        style={{ backgroundColor: "#eee", padding: "10px" }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold shadow-xl p-2 rounded-full">
            {room.name}
          </h1>
        </div>
      </nav>
      <div className="relative h-96 mt-4 overflow-y-scroll">
        <div className="grid">
          {chatHistory.map((message) => (
            <div
              className={`border inline-block max-w-max rounded-full p-2  ${message.user_id === userId
                ? "ml-auto bg-white"
                : "mr-auto bg-yellow-300"
                }`}
              key={message.id}
            >
              {message.content}
            </div>
          ))}
        </div>
      </div>
      <div className="relative bottom-0 w-full flex gap-x-2">
        <input
          type="text" value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="relative rounded-full px-6 bottom-0 w-full shadow-xl border-2 "
        />
        <button onClick={() => sendMessage()} className="border border-yellow-500 border-2 bg-green-400 text-white font-bold cursor-pointer hover:scale-95 px-3 rounded-full">
          send
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
