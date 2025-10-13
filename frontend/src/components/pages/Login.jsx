// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import {loginUser} from "../services/api" // api.js me login function
import { loginUser, setAuthToken } from "../services/api";
import { useUserProfile } from "../context/UseProfileContext"; // updateProfile context used across your app

export default function Login() {
  const navigate = useNavigate();
  const { updateProfile } = useUserProfile(); // will update profile context after login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeResponse = (data) => {
    // backend might return different shapes; normalize to { token, refresh, user }
    const token = data?.accessToken || data?.token || data?.access_token || null;
    const refresh = data?.refreshToken || data?.refresh_token || null;
    const user =
      data?.user_profile ||
      data?.user ||
      data?.user?.profile_info ||
      (data?.user_profile && data.user_profile) ||
      null;
    return { token, refresh, user };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser({ email, password });
      // res could be the data directly, or axios response.data depending on your api.js
      const data = res?.data ? res.data : res;
      const { token, refresh, user } = normalizeResponse(data);

      if (!token) {
        throw new Error("No token received from server.");
      }

      // Clear potentially stale data (old users)
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Save tokens + user
      localStorage.setItem("accessToken", token);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // Make axios include token on subsequent requests (if helper exists)
      try {
        if (typeof setAuthToken === "function") setAuthToken(token);
      } catch (setErr) {
        // if setAuthToken not exported/available, ignore gracefully
        console.warn("setAuthToken not available:", setErr);
      }

      // Update profile context (so dashboard/editprofile reflect immediately)
      if (typeof updateProfile === "function" && user) {
        updateProfile(user);
      }

      alert("Login successful!");
      navigate("/dashboard"); // redirect to dashboard (change to /create-profile if you prefer)
    } catch (err) {
      console.error("Login error:", err);
      // Try multiple shapes to find a good error message
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}

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

          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full mt-1 p-2 border rounded"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <Link to="/forgot-password" className="text-indigo-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded mt-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
















// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const data = await loginUser({ email, password });
//       // save token
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user)); // optional
//       alert("Login successful!");
//       navigate("/create-profile");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded shadow">
//         <h2 className="text-2xl font-semibold mb-6">Login</h2>
//         {error && <div className="text-red-500 mb-4">{error}</div>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-600">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="block w-full mt-1 p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="block w-full mt-1 p-2 border rounded"
//             />
//           </div>
//           <div className="flex justify-between items-center text-sm">
//             <Link to="/forgot-password" className="text-indigo-600 hover:underline">
//               Forgot Password?
//             </Link>
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full px-4 py-2 bg-indigo-600 text-white rounded mt-4"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//         <p className="text-sm text-gray-600 mt-4">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-indigo-600 hover:underline">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
























































































































// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/Authprovider";

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const success = await login(email, password);
//     setLoading(false);

//     if (success) {
//       navigate("/create-profile"); // redirect
//     } else {
//       setError("Invalid email or password");
//     }
//   };
// // imran khan
//   return (

//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded shadow">
//         <h2 className="text-2xl font-semibold mb-6">Login</h2>
//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-600">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="block w-full mt-1 p-2 border rounded"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-600">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="block w-full mt-1 p-2 border rounded"
//             />
//           </div>

//           <div className="flex justify-between items-center text-sm">
//             <Link to="/forgot-password" className="text-indigo-600 hover:underline">
//               Forgot Password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full px-4 py-2 bg-indigo-600 text-white rounded mt-4"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-sm text-gray-600 mt-4">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-indigo-600 hover:underline">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
