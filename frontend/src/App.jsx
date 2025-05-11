import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import TodoList from "./components/TodoList";
import { useState } from "react";

function App() {
  const location = useLocation(); // Get the current route
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State for sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Function to toggle sidebar visibility
  };

  // Define routes where the Sidebar should not be displayed
  const noSidebarRoutes = ["/login", "/signup", "/"];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Toggle button for sidebar visibility */}
      {!noSidebarRoutes.includes(location.pathname) && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
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
              d={isSidebarVisible ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      )}

      {/* Conditionally render Sidebar */}
      {!noSidebarRoutes.includes(location.pathname) && (
        <Sidebar isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
      )}

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarVisible && !noSidebarRoutes.includes(location.pathname) ? "ml-64" : "ml-0"
        }`}
      >
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/todo" element={<TodoList />} />
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;