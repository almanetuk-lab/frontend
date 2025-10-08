/* src/pages/ForgotPassword.jsx */
import React, { useState } from "react";
import storageApi from "../Lib/storageApi";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("mm_users") || "{}");
    if (users[email]) {
      setMessage("Password reset link sent (simulated). Check console!");
      console.log(`Simulated reset link for ${email}: password is "${users[email].password}"`);
    } else {
      setMessage("Email not found.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>

        {message && <div className="text-sm mb-4 text-gray-700">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full mt-1 p-2 border rounded"
            />
          </div>

          <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded mt-4">Send Reset Link</button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Back to <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
