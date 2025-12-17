import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import { useUserProfile } from "../context/UseProfileContext";

export default function Register() {
  const navigate = useNavigate();
  const { updateProfile } = useUserProfile() || { updateProfile: () => {} };

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    profession: "",
    interests: [],
    marital_status: "Single",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Clear any existing user data before registration
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (updateProfile) {
        updateProfile(null);
      }

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        profession: form.profession,
        interests: form.interests,
        marital_status: form.marital_status,
      };

      // Register the new user (API call only)
      await registerUser(payload);

      alert("Registration successful! Please login with your new account.");
      
      // Force clear everything again before navigation
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      if (updateProfile) {
        updateProfile(null);
      }
      
      // Use window.location for complete refresh to clear any cached state
      // window.location.href = "/";
      navigate("/login", { replace: true });

      
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-orange-700 mb-2">Register  ✨</h2>
        <p className="text-sm text-gray-600 mb-6">
          Join Intentional Connections and start your journey today
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter your First Name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter your Last Name"
              value={form.last_name}
              onChange={handleChange}
              required
              className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>
       
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Ex:Name@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
              className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

         
          <div>
            <label className="block text-sm text-gray-700">Profession</label>
            <input
              type="text"
              name="profession"
              placeholder="EX:Software Engineer"
              value={form.profession}
              onChange={handleChange}
              className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>
           <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="*****"
              value={form.password}
              onChange={handleChange}
              required
              className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>


          <button
            type="submit"
        
            disabled={loading}
            className={`w-full py-2.5 mt-2 font-semibold text-white rounded-md shadow-md transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link 
            to="/login" 
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
            }}
            className="text-orange-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}








