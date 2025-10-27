
// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";

export default function Header() {
  const navigate = useNavigate();
  const { profile, clearProfile } = useUserProfile();

  const isLoggedIn = !!profile?.email;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    clearProfile();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-center py-4 gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-amber-600">
               Mingle <span className="text-gray-800">Hub</span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="flex flex-wrap justify-center gap-6 lg:gap-8">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-pink-600 font-medium transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
                  <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-pink-600 font-medium transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-600 hover:text-pink-600 font-medium transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/members"
                      className="text-pink-600 font-medium  border-pink-600  transition-colors duration-200"
                    >
                      Members
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="edit-profile"
                      className="text-gray-600 hover:text-pink-600 font-medium transition-colors duration-200"
                    >
                      Edit Profile
                    </Link>
                  </li>
              
                </>
              )}
              <li>
                <Link
                  to="/foter"
                  className="text-gray-600 hover:text-pink-600 font-medium transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* User Welcome */}
                <div className="hidden md:flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-semibold text-sm">
                      {profile?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm">Welcome, {profile?.name?.split(' ')[0] || 'User'}</span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
            
                {/* Auth Buttons */}

                 <Link
                  to="/admin-Login"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 px-3 py-1"
                >
                 Admin Login
                </Link>

                <Link
                  to="/login"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 px-3 py-1"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button (Optional) */}
      <div className="lg:hidden flex justify-center pb-2">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {isLoggedIn && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-semibold text-xs">
                  {profile?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span>Hi, {profile?.name?.split(' ')[0] || 'User'}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}





