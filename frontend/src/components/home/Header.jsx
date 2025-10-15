// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";

export default function Header() {
  const navigate = useNavigate();
  const { profile, clearProfile } = useUserProfile();

  const isLoggedIn = !!profile?.email; // simple check

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    clearProfile();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-gray-800">
        MingleHub
      </Link>

      <nav className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/profile/edit"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}















// /* src/components/Header.jsx */
// import React from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/Authprovider";
// // import { useAuth } from "../context/AuthProvider";

// export default function Header() {
//   const { user, logout } = useAuth();

//   return (
//     <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
//       <Link to="/" className="text-xl font-bold text-indigo-600">Connetion Hub</Link>

//       <nav className="flex gap-4 items-center">
//         {user ? (
//           <>
//            <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>

//             <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
//             <Link to="/profile/edit" className="text-gray-700 hover:text-indigo-600">Edit Profile</Link>
//             <button onClick={logout} className="px-3 py-1 bg-gray-200 rounded">Logout</button>

//           </>
//         ) : (
//           <>
//             <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
//             <Link to="/register" className="px-3 py-1 bg-indigo-600 text-white rounded">Register</Link>
//           </>
//         )}
//       </nav>
//     </header>
//   );
// }
