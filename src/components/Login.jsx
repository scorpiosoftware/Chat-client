import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../plugins/AuthContext";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isAuthenticated, login } = useAuth();
  const [data, setData] = useState(null); // State to store API response data
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.password) {
        setMessage("Please fill in all fields");
        setIsError(true);
        return;
      }
      setIsLoading(true);
      const response = await fetch("http://localhost:3010/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // 4. Parse JSON response
      const responseData = await response.json();

      if (!response.ok) {
        // const errorData = await response.json();
        throw new Error(responseData.message || "Login failed");
      }

      // 5. Extract token from the correct response structure
      const token = responseData.payload.token;
      login(token);

      setMessage(`Welcome, ${response.data}!`);
      setIsError(false);
      navigate("/dashboard");
    } catch (error) {
      setMessage("Error submitting user: " + error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">I CHAT</h1>
          <p className="text-white mt-1">
            The most popular peer to peer lending at SEA
          </p>
          <button
            type="submit"
            className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2"
          >
            Read More
          </button>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form className="bg-white" onSubmit={handleSubmit}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">
            Hello Again!
          </h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Welcome Back</p>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <input
              className="pl-2 outline-none border-none"
              type="text"
              value={formData.email}
              onChange={handleInputChange}
              name="email"
              id="email"
              placeholder="Email Address"
              required
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
            <input
              className="pl-2 outline-none border-none"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              name="password"
              id="password"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
          >
            Login
          </button>
          <a
            href="/register"
            className="text-sm ml-2 hover:text-blue-500 cursor-pointer"
          >
            register ?
          </a>
          {message && (
            <div style={{ color: isError ? "red" : "green" }}>{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}
