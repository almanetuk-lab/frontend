/* src/pages/Register.jsx */
import React, { useState } from "react";
import { useAuth } from "../context/Authprovider";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register, setUser } = useAuth(); // setUser hook add karein taake user context update ho
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    profession: "",
    interest: "",
    status: "Single",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;
    const registeredUser = register(email, password); // register function backend / context se

    if (registeredUser) {
      setUser({ ...registeredUser, profile: null }); // context me user set karein
      navigate("/dashboard"); // ab dashboard redirect
    } else {
      setError("User already exists");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">
          Create Your Account
        </h2>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
              required
              className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block text-sm text-gray-600">Profession</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="E.g. Software Engineer, Doctor, Teacher..."
              className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Interest */}
          <div>
            <label className="block text-sm text-gray-600">Interests</label>
            <input
              type="text"
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              placeholder="E.g. Coding, Reading, Travelling..."
              className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Marital Status Dropdown */}
          <div>
            <label className="block text-sm text-gray-600">Marital Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded mt-4 hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}





