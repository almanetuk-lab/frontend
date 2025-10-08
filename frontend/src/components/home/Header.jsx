

/* src/components/Header.jsx */
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authprovider";
// import { useAuth } from "../context/AuthProvider";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">MatchAlmanet</Link>

      <nav className="flex gap-4 items-center">
        {user ? (
          <>
           <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>

            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
            <Link to="/profile/edit" className="text-gray-700 hover:text-indigo-600">Edit Profile</Link>
            <button onClick={logout} className="px-3 py-1 bg-gray-200 rounded">Logout</button>

          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
            <Link to="/register" className="px-3 py-1 bg-indigo-600 text-white rounded">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
