import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuthToken } from "../services/api";
import api from "../services/api";
import { useUserProfile } from "../context/UseProfileContext";

export default function Login() {
  const navigate = useNavigate();
  const { updateProfile } = useUserProfile();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeResponse = (data) => {
    const token = data?.accessToken || data?.token || null;
    const refresh = data?.refreshToken || data?.refresh_token || null;
    const user =
      data?.user_profile ||
      data?.user ||
      (data?.user?.profile_info ? data.user.profile_info : null) ||
      null;
    return { token, refresh, user };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/login", { email, password });
      const { token, refresh, user } = normalizeResponse(res?.data ?? res);

      if (!token) throw new Error("No token received from server");

      // Save tokens & user info
      localStorage.setItem("accessToken", token);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // Set Axios header & context
      setAuthToken(token);
      if (user) updateProfile(user);

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
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-amber-700 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="font-semibold text-amber-700 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

























// // src/pages/Login.jsx
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../services/api";
// import { useUserProfile } from "../context/UseProfileContext";

// export default function Login() {
//   const navigate = useNavigate();
//   const { updateProfile } = useUserProfile();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // normalize backend response
//   const normalizeResponse = (data) => {
//     const token = data?.accessToken || data?.token || null;
//     const refresh = data?.refreshToken || data?.refresh_token || null;
//     const user =
//       data?.user_profile ||
//       data?.user ||
//       (data?.user?.profile_info ? data.user.profile_info : null) ||
//       null;
//     return { token, refresh, user };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.post("/api/login", { email, password });
//       const data = res?.data || res;
//       const { token, refresh, user } = normalizeResponse(data);

//       if (!token) throw new Error("No token received from server");

//       // Save tokens & user info
//       localStorage.setItem("accessToken", token);
//       if (refresh) localStorage.setItem("refreshToken", refresh);
//       if (user) localStorage.setItem("user", JSON.stringify(user));

//       if (user) updateProfile(user);

//       alert("Login successful!");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Login error:", err);
//       const msg =
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         err?.message ||
//         "Invalid email or password";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-amber-100 animate-fade-in">
//         {/* Logo / Title */}
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-extrabold text-amber-700">Welcome Back 👋</h1>
//           <p className="text-amber-700/80 mt-1">Login to continue your MingleHub journey</p>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="bg-red-100 text-red-700 px-3 py-2 rounded-md mb-4 text-sm text-center">
//             {error}
//           </div>
//         )}

//         {/* Login Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-amber-800">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full mt-1 px-4 py-2 border border-amber-200 rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition"
//               placeholder="imran@example.com"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-amber-800">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full mt-1 px-4 py-2 border border-amber-200 rounded-md focus:ring-2 focus:ring-amber-400 outline-none transition"
//               placeholder="••••••••"
//             />
//           </div>

//           <div className="flex justify-between items-center text-sm">
//             <Link
//               to="/forgot-password"
//               className="text-amber-700 hover:underline transition"
//             >
//               Forgot Password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2.5 mt-2 font-semibold text-white rounded-md shadow-md transition ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-amber-600 hover:bg-amber-700"
//             }`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center my-6">
//           <div className="flex-1 h-px bg-amber-200"></div>
//           <span className="px-3 text-amber-600 text-sm">or</span>
//           <div className="flex-1 h-px bg-amber-200"></div>
//         </div>

//         {/* Social Buttons */}
//         <div className="flex flex-col gap-3">
//           <button className="flex items-center justify-center gap-2 border border-amber-200 rounded-md py-2 hover:bg-amber-50 transition">
//             <img
//               src="https://www.svgrepo.com/show/475656/google-color.svg"
//               alt="Google"
//               className="w-5 h-5"
//             />
//             <span className="text-amber-800 text-sm font-medium">Login with Google</span>
//           </button>

//           <button className="flex items-center justify-center gap-2 border border-amber-200 rounded-md py-2 hover:bg-amber-50 transition">
//             <img
//               src="https://www.svgrepo.com/show/448224/facebook.svg"
//               alt="Facebook"
//               className="w-5 h-5"
//             />
//             <span className="text-amber-800 text-sm font-medium">Login with Facebook</span>
//           </button>
//         </div>

//         {/* Register Redirect */}
//         <p className="text-center text-sm text-amber-700 mt-6">
//           Don’t have an account?{" "}
//           <Link
//             to="/register"
//             className="font-semibold text-amber-700 hover:underline"
//           >
//             Create Account
//           </Link>
//         </p>
//       </div>
//     </div>
//   ) 
// };
































































































