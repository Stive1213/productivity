import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import TodoList from "./components/TodoList";
import { useState, useEffect } from "react";

function App() {
  const location = useLocation();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [theme, setTheme] = useState("light");

  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  
  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const noSidebarRoutes = ["/login", "/signup", "/"];
  const noThemeToggleRoutes = ["/login", "/signup", "/"];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Theme toggle button (hidden on login/signup) */}
      {!noThemeToggleRoutes.includes(location.pathname) && (
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
          title="Toggle light/dark mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      )}

      {/* Sidebar toggle button */}
      {!noSidebarRoutes.includes(location.pathname) && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
        >
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-200"
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