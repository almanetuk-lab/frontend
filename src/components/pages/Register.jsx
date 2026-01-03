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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-blue-100">
        {/* Header - HOME PAGE STYLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold">
            <span className="text-blue-700">Intentional</span>
            <span className="text-pink-500"> Connections</span>
          </h1>
          <p className="text-gray-600 mt-2">Create your account and start your journey</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="John"
                value={form.first_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Doe"
                value={form.last_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Profession</label>
            <input
              type="text"
              name="profession"
              placeholder="Software Engineer"
              value={form.profession}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            />
          </div>

          {/* BLUE BUTTON like home page */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 font-bold text-white rounded-lg shadow-md transition duration-200 ${
              loading ? "bg-blue-600 cursor-not-allowed opacity-90" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link 
              to="/login" 
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
              }}
              className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

































































































































































































// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { registerUser } from "../services/api";
// import { useUserProfile } from "../context/UseProfileContext";

// export default function Register() {
//   const navigate = useNavigate();
//   const { updateProfile } = useUserProfile() || { updateProfile: () => {} };

//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Clear any existing user data before registration
//       localStorage.removeItem("user");
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");

//       if (updateProfile) {
//         updateProfile(null);
//       }

//       const payload = {
//         first_name: form.first_name,
//         last_name: form.last_name,
//         email: form.email,
//         password: form.password,
//         profession: form.profession,
//         interests: form.interests,
//         marital_status: form.marital_status,
//       };

//       // Register the new user (API call only)
//       await registerUser(payload);

//       alert("Registration successful! Please login with your new account.");
      
//       // Force clear everything again before navigation
//       localStorage.removeItem("user");
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
      
//       if (updateProfile) {
//         updateProfile(null);
//       }
      
//       // Use window.location for complete refresh to clear any cached state
//       // window.location.href = "/";
//       navigate("/login", { replace: true });

      
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
//         <h2 className="text-3xl font-bold text-orange-700 mb-2">Register  ✨</h2>
//         <p className="text-sm text-gray-600 mb-6">
//           Join Intentional Connections and start your journey today
//         </p>

//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4 text-left">
//           <div>
//             <label className="block text-sm text-gray-700">First Name</label>
//             <input
//               type="text"
//               name="first_name"
//               placeholder="Enter your First Name"
//               value={form.first_name}
//               onChange={handleChange}
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700">Last Name</label>
//             <input
//               type="text"
//               name="last_name"
//               placeholder="Enter your Last Name"
//               value={form.last_name}
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
//               placeholder="Ex:Name@gmail.com"
//               value={form.email}
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
//               placeholder="EX:Software Engineer"
//               value={form.profession}
//               onChange={handleChange}
//               className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
//             />
//           </div>
//            <div>
//             <label className="block text-sm text-gray-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="*****"
//               value={form.password}
//               onChange={handleChange}
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
//             />
//           </div>


//           <button
//             type="submit"
        
//             disabled={loading}
//             className={`w-full py-2.5 mt-2 font-semibold text-white rounded-md shadow-md transition ${
//               loading ? "bg-gray-400 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700"
//             }`}
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </button>
//         </form>

//         <p className="text-sm text-gray-600 mt-6">
//           Already have an account?{" "}
//           <Link 
//             to="/login" 
//             onClick={() => {
//               localStorage.removeItem("user");
//               localStorage.removeItem("accessToken");
//               localStorage.removeItem("refreshToken");
//             }}
//             className="text-orange-600 font-semibold hover:underline"
//           >
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }








