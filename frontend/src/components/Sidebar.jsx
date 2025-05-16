import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";

const Sidebar = ({ isSidebarVisible, toggleSidebar }) => {
  const navigate = useNavigate(); // Hook to navigate to other routes

  const handleLogout = async () => {
    try {
      // Call the backend logout API
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      // Redirect to the login page after successful logout
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg text-gray-900 flex flex-col transition-transform duration-300 ease-in-out ${
        isSidebarVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className=" ml-10 p-6 text-2xl font-semibold text-gray-900 border-b border-gray-200 flex items-center justify-between">
        Lifehub
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/todo"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              To-Do List
            </NavLink>
          </li>
              <li>
            <NavLink
              to="/journal"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              Journal
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;