import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {toast,ToastContainer} from 'react-toastify'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chatbot state
  const [message, setMessage] = useState(""); // User message state
  const [chatMessages, setChatMessages] = useState([]); // Chat history
  const [loading, setLoading] = useState(false); // Loading state for waiting
  const [isLoggedIn, setIsLoggedIn] = useState(false); // User authentication state

  const navigate = useNavigate(); // To handle navigation

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // If token exists, set isLoggedIn to true
  }, []);

  // Toggle chatbot visibility
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Handle sending the message
  const sendMessage = async () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { user: message }]);
      setMessage("");
      setLoading(true);

      try {
        const response = await axios.post("http://localhost:1001/api/chat/chats", { message });
        const chatbotResponse = response.data.reply;
        setChatMessages((prevMessages) => [...prevMessages, { bot: chatbotResponse }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { bot: "Sorry, something went wrong. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Logout Functionality
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false); // Update state to logged out
    toast.success("Logged Out successfully!")
    setTimeout(() => {
      navigate("/login"); // Redirect to login page 
    }, 1000);
  };

  return (
    <div className="bg-green-600 flex flex-wrap items-center p-4">
      <Link to={'/'}><div className="flex-shrink-0 text-white text-3xl">DietTracker</div></Link>
      <div className="block lg:hidden ml-auto">
        <button
          className="flex items-center px-3 py-2 border rounded text-white border-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
            <path d="M0 3h20v2H0zM0 7h20v2H0zM0 11h20v2H0z" />
          </svg>
        </button>
      </div>
      <div
        className={`w-full flex-grow lg:flex lg:items-center lg:w-auto ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <ul className="text-white lg:flex-grow lg:flex lg:justify-center text-lg">
          <Link to="/dashboard">
            <li className="nav-item">
              <a className="block mt-4 lg:inline-block lg:mt-0 px-2">Dashboard</a>
            </li>
          </Link>
          <Link to="/foodLog">
            <li className="nav-item">
              <a className="block mt-4 lg:inline-block lg:mt-0 px-2">FoodLog</a>
            </li>
          </Link>
          <Link to="/nutritionInfo">
            <li className="nav-item">
              <a className="block mt-4 lg:inline-block lg:mt-0 px-2">Nutrition Info</a>
            </li>
          </Link>
          <Link to="/mealPlannerHome">
            <li className="nav-item">
              <a className="block mt-4 lg:inline-block lg:mt-0 px-2">Meal Planner</a>
            </li>
          </Link>
          <Link to="/profile">
            <li className="nav-item">
              <a className="block mt-4 lg:inline-block lg:mt-0 px-2">Profile</a>
            </li>
          </Link>
        </ul>
        <div className="btns">
          {/* Conditional rendering for Login/SignUp and Logout */}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn bg-red-500 text-white">
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="btn">
                  <span>Login</span>
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn">
                  <span>SignUp</span>
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Chatbot Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 p-3 bg-green-500 rounded-full shadow-lg text-white hover:bg-green-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h8M8 14h8m2 4h.01M12 4h.01"
          />
        </svg>
      </button>

      {/* Chatbot Modal */}
      {isChatOpen && (
        <div className="fixed bottom-16 right-5 w-80 bg-white p-4 rounded-lg shadow-lg z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Chatbot</h3>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg">
                {msg.user && <p className="text-green-500">{msg.user}</p>}
                {msg.bot && <p>{msg.bot}</p>}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-100 p-3 rounded-lg text-center text-gray-500">
                Typing...
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border rounded-md focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default Navbar;
