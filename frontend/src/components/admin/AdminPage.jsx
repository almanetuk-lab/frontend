import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending users from backend
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/pending-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPendingUsers(res.data); // backend should return array of users
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Approve user
  const handleApprove = async (userId) => {
    try {
      await axios.post(
        `/api/admin/users/${userId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPendingUsers(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  // Remove user
  const handleRemove = async (userId) => {
    try {
      await axios.post(
        `/api/admin/users/${userId}/remove`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPendingUsers(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul>
          <li className="py-2 px-3 hover:bg-gray-700 rounded mb-2">Dashboard</li>
          <li className="py-2 px-3 hover:bg-gray-700 rounded mb-2">Users</li>
          <li className="py-2 px-3 hover:bg-gray-700 rounded mb-2">Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">Pending Users</h1>
        {loading ? (
          <p>Loading...</p>
        ) : pendingUsers.length === 0 ? (
          <p className="text-gray-600">No pending users.</p>
        ) : (
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>

              {pendingUsers.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.fullName}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => handleApprove(user.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleRemove(user.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
