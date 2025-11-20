import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useUserProfile } from "../context/UseProfileContext";

export default function Login() {
  const navigate = useNavigate();
  const { updateProfile, refreshProfile } = useUserProfile();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { token, refresh, user } = await loginUser({ email, password });

      if (!token) throw new Error("No token received from server");

      // Save tokens & user info
      localStorage.setItem("accessToken", token);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      
      // ✅ FIXED: Save user data to localStorage for chat module
      if (user) {
        console.log("✅ Login successful, updating profile context");
        updateProfile(user);
        
        // 🚀 YEH LINE ADD KI HAI - Chat module ke liye
        localStorage.setItem("currentUser", JSON.stringify(user));
        console.log("💾 User data saved to localStorage for chat:", user);
      }

      // Auto refresh profile data from API
      setTimeout(() => {
        refreshProfile();
      }, 500);

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

  // LinkedIn Login Function
  const handleLinkedInLogin = async () => {
    setLinkedinLoading(true);
    setError("");

    try {
      // LinkedIn auth URL fetch karein backend se
      const response = await fetch('/api/auth/linkedin');
      const data = await response.json();
      
      if (data.success) {
        // Redirect to LinkedIn auth page
        window.location.href = data.authUrl;
      } else {
        throw new Error(data.message || 'LinkedIn login failed');
      }
    } catch (err) {
      console.error("LinkedIn login error:", err);
      setError(err.message || "LinkedIn login failed. Please try again.");
      setLinkedinLoading(false);
    }
  };

  // ✅ Agar user already logged in hai to directly dashboard redirect karo
  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log("🔄 User already logged in, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [navigate]);

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

        {/* LinkedIn Login Button */}
        {/* <button
          onClick={handleLinkedInLogin}
          disabled={linkedinLoading}
          className="w-full bg-[#0077B5] hover:bg-[#00669A] text-white font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-3 transition duration-200 mb-4 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          {linkedinLoading ? "Connecting to LinkedIn..." : "Continue with LinkedIn"}
        </button> */}

        {/* Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-1 border-t border-amber-200"></div>
          <div className="px-3 text-amber-600 text-sm">or</div>
          <div className="flex-1 border-t border-amber-200"></div>
        </div>

        {/* Email Login Form */}
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
            {loading ? "Logging in..." : "Login Your Account"}
          </button>

            {/* LinkedIn Login Button */}
        <button
          onClick={handleLinkedInLogin}
          disabled={linkedinLoading}
          className="w-full bg-[#0077B5] hover:bg-[#00669A] text-white font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-3 transition duration-200 mb-4 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          {linkedinLoading ? "Connecting to LinkedIn..." : "Continue with LinkedIn"}
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

// ✅ Alag Logout Component for Header/Other pages
export function LogoutButton() {
  const { clearProfile } = useUserProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("🚪 Logging out...");
    
    // Clear authentication only, keep profile data
    clearProfile();
    
    // ✅ FIXED: Also remove chat user data from localStorage
    localStorage.removeItem("currentUser");
    
    alert("Logged out successfully!");
    navigate("/login");
    
    // Optional: Page refresh for clean state
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <button 
      onClick={handleLogout} 
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}

















































































































