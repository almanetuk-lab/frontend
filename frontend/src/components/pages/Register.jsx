//  src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { registerUser } from "../services/api"; // api.js me register function
import { registerUser, setAuthToken } from "../services/api";
import { useUserProfile } from "../context/UseProfileContext";

export default function Register() {
  const navigate = useNavigate();
  const { updateProfile } = useUserProfile(); // update context after register
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    profession: "",
    // not shown in UI but required by backend -> provide defaults
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

  const normalizeResponse = (data) => {
    // Backend may return different shapes. Normalize to { token, refresh, user }
    const token = data?.accessToken || data?.token || data?.access_token || null;
    const refresh = data?.refreshToken || data?.refresh_token || null;
    // backend registration returned `user` with profile_info earlier — handle both
    const user =
      data?.user ||
      data?.user_profile ||
      (data?.user?.profile_info ? data.user.profile_info : null) ||
      null;
    return { token, refresh, user };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare payload that matches backend expectations
      const payload = {
        full_name: form.fullName, // backend expects full_name
        email: form.email,
        password: form.password,
        profession: form.profession,
        interests: form.interests, // array -> backend stores JSON.stringify
        marital_status: form.marital_status,
      };

      const res = await registerUser(payload);
      // res might be response.data or data itself depending on api.js
      const data = res?.data ? res.data : res;
      const { token, refresh, user } = normalizeResponse(data);

      if (!token) {
        throw new Error("No token received from server. Registration may have failed.");
      }

      // Clear stale data (old users)
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Save token(s) and user
      localStorage.setItem("accessToken", token);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // Ensure axios will send Authorization header for future calls
      try {
        if (typeof setAuthToken === "function") setAuthToken(token);
      } catch (err) {
        console.warn("setAuthToken not available:", err);
      }

      // Update profile context so app reflects new user immediately
      if (typeof updateProfile === "function" && user) {
        updateProfile(user);
      }

      alert("Registration successful!");
      navigate("/dashboard"); // or "/create-profile" if you prefer
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">Register</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="block w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="block w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="block w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Profession</label>
            <input
              type="text"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              className="block w-full mt-1 p-2 border rounded"
            />
          </div>

          {/* Hidden inputs are not visible but we maintain required backend fields in state.
              If you want the user to pick marital_status or interests, expose UI controls here. */}
          <input type="hidden" name="marital_status" value={form.marital_status} />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded mt-4"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}











// old code 
// export default function Register() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     profession: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const data = await registerUser(form);
//       // save token
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       alert("Registration successful!");
//       navigate("/create-profile"); // auto-login
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded shadow">
//         <h2 className="text-2xl font-semibold mb-6">Register</h2>
//         {error && <div className="text-red-500 mb-4">{error}</div>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-600">Full Name</label>
//             <input
//               type="text"
//               name="fullName"
//               value={form.fullName}
//               onChange={handleChange}
//               required
//               className="block w-full mt-1 p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//               className="block w-full mt-1 p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               className="block w-full mt-1 p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600">Profession</label>
//             <input
//               type="text"
//               name="profession"
//               value={form.profession}
//               onChange={handleChange}
//               className="block w-full mt-1 p-2 border rounded"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full px-4 py-2 bg-blue-600 text-white rounded mt-4"
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>
//         <p className="text-sm text-gray-600 mt-4">
//           Already have an account?{" "}
//           <Link to="/login" className="text-indigo-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }










































