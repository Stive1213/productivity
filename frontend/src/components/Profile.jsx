import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to load user data. Please log in.");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p className="text-gray-700 mb-1">
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Role:</strong> {user.role || "User"}
        </p>
      </div>
    </div>
  );
};

export default Profile;