import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, setAuthToken } from "../services/api";
import { useUserProfile } from "../context/UseProfileContext";

export default function Register() {
  const navigate = useNavigate();
  const { updateProfile } = useUserProfile() || { updateProfile: () => {} };

  const [form, setForm] = useState({
    fullName: "",
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
      const payload = {
        full_name: form.fullName,
        email: form.email,
        password: form.password,
        profession: form.profession,
        interests: form.interests,
        marital_status: form.marital_status,
      };

      const { token, refresh, user } = await registerUser(payload);

      // if (!token) throw new Error("Register Succefully Now.");

      // Save tokens & user
      localStorage.setItem("accessToken", token);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // Set Axios default header
      setAuthToken(token);

      // Update user profile context
      if (user) updateProfile(user);

      alert("Registration successful!");
      navigate("/dashboard");
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
          Join MingleHub and start your journey today
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Name"
              value={form.fullName}
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
              placeholder="Name@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
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

          <div>
            <label className="block text-sm text-gray-700">Profession</label>
            <input
              type="text"
              name="profession"
              placeholder=""
              value={form.profession}
              onChange={handleChange}
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
          <Link to="/login" className="text-orange-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}














// // src/pages/Register.jsx
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { registerUser, setAuthToken } from "../services/api";
// import {useUserProfile} from "../context/UseProfileContext"

// export default function Register() {
//   const navigate = useNavigate();
//   const { updateProfile } = useUserProfile() || { updateProfile: () => {} };

//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     profession: "",
//     interests: [],
//     marital_status: "Single",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//     setError("");
//   };

//   const normalizeResponse = (data) => {
//     const token = data?.accessToken || data?.token || data?.access_token || null;
//     const refresh = data?.refreshToken || data?.refresh_token || null;
//     const user =
//       data?.user ||
//       data?.user_profile ||
//       (data?.user?.profile_info ? data.user.profile_info : null) ||
//       null;
//     return { token, refresh, user };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const payload = {
//         full_name: form.fullName,
//         email: form.email,
//         password: form.password,
//         profession: form.profession,
//         interests: form.interests,
//         marital_status: form.marital_status,
//       };

//       const res = await registerUser(payload);
//       const data = res?.data ? res.data : res;
//       const { token, refresh, user } = normalizeResponse(data);

//       if (!token) throw new Error("No token received from server.");
//       // imran khan 

//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("user");

//       localStorage.setItem("accessToken", token);
//       if (refresh) localStorage.setItem("refreshToken", refresh);
//       if (user) localStorage.setItem("user", JSON.stringify(user));

//       if (typeof setAuthToken === "function") setAuthToken(token);
//       if (typeof updateProfile === "function" && user) updateProfile(user);

//       alert("Registration successful!");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Register error:", err);
//       const msg =
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         err?.message ||
//         "Registration failed";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white px-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
//         <h2 className="text-3xl font-bold text-orange-700 mb-2">
//           Create Account ✨
//         </h2>
//         <p className="text-sm text-gray-600 mb-6">
//           Join MingleHub and start your journey today
//         </p>

//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4 text-left">
//           <div>
//             <label className="block text-sm text-gray-700">Full Name</label>
//             <input
//               type="text"
//               name="fullName"
//                 placeholder="imran"
//               value={form.fullName}
//               onChange={handleChange}
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="imran@gmail.com"
//               value={form.email}
//               onChange={handleChange}
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700">Profession</label>
//             <input
//               type="text"
//               name="profession"
//               value={form.profession}
//               onChange={handleChange}
//               className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
//             />
//           </div>
// {/* 
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded transition"
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </button> */}

//    <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2.5 mt-2 font-semibold text-white rounded-md shadow-md transition ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-amber-600 hover:bg-amber-700"
//             }`}
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </button>


//         </form>

//         <div className="my-4 flex items-center">
//           <hr className="flex-grow border-gray-300" />
//           <span className="mx-2 text-gray-400 text-sm">or</span>
//           <hr className="flex-grow border-gray-300" />
//         </div>

//         <div className="space-y-2">
//           <button className="w-full border rounded py-2 flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition">
//             <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
//             Continue with Google
//           </button>
//           <button className="w-full border rounded py-2 flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition">
//             <img src="https://www.svgrepo.com/show/448234/facebook.svg" className="w-5 h-5" alt="Facebook" />
//             Continue with Facebook
//           </button>
//         </div>

//         <p className="text-sm text-gray-600 mt-6">
//           Already have an account?{" "}
//           <Link to="/login" className="text-orange-600 font-semibold hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
