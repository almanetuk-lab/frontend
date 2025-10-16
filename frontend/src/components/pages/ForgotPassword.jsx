/* src/pages/ForgotPassword.jsx */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api"; // backend ready hone par use kare

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // backend call (future-ready)
      // const response = await api.post("/api/forgot-password", { email });
      // setMessage(response.data.message);

      // temporary simulation
      console.log(`Simulated reset link sent to ${email}`);
      setMessage(
        "Password reset link sent (simulated). Check your email!"
      );
    } catch (err) {
      console.error(err);
      setMessage("Failed to send reset link. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>

        {message && (
          <div className="text-center text-sm text-gray-700 bg-gray-100 p-2 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label> 
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            />
          </div>

            <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 mt-2 font-semibold text-white rounded-md shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {loading ? "Sending you Email..." : "Reset"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}







// /* src/pages/ForgotPassword.jsx */
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../services/api"; // future backend axios

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       // backend call (future-ready)
//       // const response = await api.post("/api/forgot-password", { email });
//       // setMessage(response.data.message);

//       // temporary simulation
//       console.log(`Simulated reset link sent to ${email}`);
//       setMessage(
//         "Password reset link sent (simulated). Check your email!"
//       );
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to send reset link. Try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Common Header for MingleHub style */}
//       {/* <header className="bg-white shadow py-4 px-6 flex justify-between items-center">
//         <h1 className="text-xl font-bold text-gray-800">MingleHub</h1>
//         <nav className="space-x-4">
//           <Link
//             to="/login"
//             className="text-gray-700 hover:text-indigo-600 font-medium"
//           >
//             Login
//           </Link>
//           <Link
//             to="/register"
//             className="text-gray-700 hover:text-indigo-600 font-medium"
//           >
//             Register
//           </Link>
//         </nav>
//       </header> */}

//       <main className="flex-grow flex items-center justify-center px-4">
//         <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg space-y-6">
//           <h2 className="text-2xl font-semibold text-center">
//             Forgot Password
//           </h2>

//           {message && (
//             <div className="text-center text-sm text-gray-700 bg-gray-100 p-2 rounded">
//               {message}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="Enter your registered email"
//                 className="mt-1 block w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
//             >
//               {loading ? "Sending..." : "Send Reset Link"}
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-600">
//             Remembered your password?{" "}
//             <Link
//               to="/login"
//               className="text-indigo-600 hover:underline font-medium"
//             >
//               Login
//             </Link>
//           </p>
//         </div>
//       </main>

//       {/* Common Footer
//       <footer className="bg-white shadow py-4 text-center text-gray-600">
//         &copy; {new Date().getFullYear()} MingleHub. All rights reserved.
//       </footer> */}
//     </div>
//   );
// }
