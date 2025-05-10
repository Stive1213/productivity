import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to load user data");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      setError("Logout failed");
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome, {user.firstName} {user.lastName}
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Log Out
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Your Profile</h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;