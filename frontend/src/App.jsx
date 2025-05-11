import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import TodoList from "./components/TodoList";

function App() {
  const location = useLocation(); // Get the current route

  // Define routes where the Sidebar should not be displayed
  const noSidebarRoutes = ["/login", "/signup", "/"];

  return (
    <div className="flex">
      {/* Conditionally render Sidebar */}
      {!noSidebarRoutes.includes(location.pathname) && <Sidebar />}
      <div className="flex-1">
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