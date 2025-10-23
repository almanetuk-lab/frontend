import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { loginUser } from "../services/api";
import { useUserProfile } from "../context/UseProfileContext";

export default function Login() {
  const navigate = useNavigate();
  const { updateProfile } = useUserProfile();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use loginUser function instead of direct api.post
      const { token, refresh, user } = await loginUser({ email, password });

      if (!token) throw new Error("No token received from server");

      // Save tokens & user info
      localStorage.setItem("accessToken", token);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        updateProfile(user);
      }

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-amber-100 animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-amber-700">Welcome Back 👋</h1>
          <p className="text-amber-700/80 mt-1">Login to continue your MingleHub journey</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-amber-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-amber-200 rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition"
              placeholder="imran@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-amber-200 rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <Link to="/forgot-password" className="text-amber-700 hover:underline transition">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 mt-2 font-semibold text-white rounded-md shadow-md transition ${
              loading ? "bg-amber-700 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-amber-700 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-amber-700 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}








































































































