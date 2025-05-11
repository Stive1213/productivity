import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";

const Sidebar = () => {
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
    <div className="h-screeen w-64 bg-gary-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gary-700">Lifehub</div>
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "block p-2 bg-gray-700 rounded"
                  : "block p-2 hover:bg-gray-700 rounded text-black "
              }
            >
              Dashboared
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/todo"
              className={({ isActive }) =>
                isActive
                  ? "block p-2 bg-gray-700 rounded"
                  : "block p-2 hover:bg-gray-700 rounded text-black"
              }
            >
              To-Do List
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "block p-2 bg-gray-700 rounded"
                  : "block p-2 hover:bg-gray-700 rounded text-black"
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive
                  ? "block p-2 bg-gray-700 rounded"
                  : "block p-2 hover:bg-gray-700 rounded text-black"
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;