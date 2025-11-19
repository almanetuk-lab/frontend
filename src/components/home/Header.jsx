// src/components/home/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import NotificationBell from "../notifybell/NotificationBell";

// Main Header Component
function Header() {
  const navigate = useNavigate();
  const { profile, clearProfile } = useUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // ✅ FIXED: Proper login status check
  const checkLoginStatus = () => {
    const userToken = localStorage.getItem("accessToken");
    const adminToken = localStorage.getItem("adminToken");
    return !!(userToken || adminToken);
  };

  const isLoggedIn = checkLoginStatus();

  // ✅ FIXED: Proper logout function
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("user");
    clearProfile();
    setIsMobileMenuOpen(false);
    // window.location.href = '/#/';
      navigate('/');

        setTimeout(() => {
    window.location.reload();
  }, 100);
};
  

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [navigate]);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Header Row */}
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-amber-600">
              Mingle <span className="text-gray-800">Hub</span>
            </h1>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-6 lg:gap-8">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  About
                </Link>
              </li> */}
              
              {isLoggedIn && (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/members"
                      className="text-amber-600 font-medium border-amber-600 transition-colors duration-200"
                    >
                      Members
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/edit-profile"
                      className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                    >
                      Edit Profile
                    </Link>
                  </li>
                </>
              )}
              
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
                  
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop Auth Section - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {localStorage.getItem("accessToken") && <NotificationBell />}
                
                {/* <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 font-semibold text-sm">
                      {profile?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm">
                    {localStorage.getItem("adminToken") ? "Welcome, Admin" : `Welcome, ${profile?.name?.split(' ')[0] || 'User'}`}
                  </span>
                </div> */}
                
                <button
                  onClick={handleLogout}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin-login"
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
                >
                 Admin Login
                </Link>

                <Link
                  to="/login"
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Notification Bell for mobile */}
            {isLoggedIn && localStorage.getItem("accessToken") && <NotificationBell />}
            
            {/* User Avatar for mobile */}
            {isLoggedIn && (
              <div className="flex items-center gap-2 text-gray-700">
                 <div className="w-0 h-1 bg-white rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-semibold text-sm">
                    {/* {profile?.name?.charAt(0) || 'Hello'} */}
                  </span>
                </div> 
              </div>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-amber-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                // Close Icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        {/* Mobile Menu Content */}
        <div 
          ref={mobileMenuRef}
          className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Navigation Links */}
            <nav className="mb-6">
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="block py-2 px-4 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="block py-2 px-4 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                
                {isLoggedIn && (
                  <>
                    <li>
                      <Link
                        to="/dashboard"
                        className="block py-2 px-4 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/members"
                        className="block py-2 px-4 text-amber-600 bg-amber-50 rounded-lg font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Members
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/edit-profile"
                        className="block py-2 px-4 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Edit Profile
                      </Link>
                    </li>
                  </>
                )}
                
                <li>
                  <Link
                    to="/contact"
                    className="block py-2 px-4 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </li>
                    
                <li>
                  <Link
                    to="/"
                    className="block py-2 px-4 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blogs
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-4">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-4 py-2">
                    {/* <span className="text-sm text-gray-600">
                      {localStorage.getItem("adminToken") ? "Admin User" : `Hello, ${profile?.name?.split(' ')[0] || ''}`}
                    </span> */}
                    <span className="text-sm text-gray-600">
  {localStorage.getItem("adminToken") 
    ? "Admin User" 
    : profile?.first_name && profile?.last_name 
      ? `Hello, ${profile.first_name} ${profile.last_name}`
      : `Hello, ${profile?.first_name || profile?.name || 'User'}`
  }
</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/admin-login"
                    className="block py-3 px-4 text-center text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Login
                  </Link>
                  <Link
                    to="/login"
                    className="block py-3 px-4 text-center text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-3 px-4 text-center bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;





// // src/components/home/Header.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useUserProfile} from "../context/UseProfileContext";
// import NotificationBell from "../notifybell/NotificationBell"

// // Main Header Component
// function Header() {
//   const navigate = useNavigate();
//   const { profile, clearProfile } = useUserProfile();

//   // ✅ FIXED: Proper login status check
//   const checkLoginStatus = () => {
//     const userToken = localStorage.getItem("accessToken");
//     const adminToken = localStorage.getItem("adminToken");
    
//     // Return true if either user or admin is logged in
//     return !!(userToken || adminToken);
//   };

//   const isLoggedIn = checkLoginStatus();

//   // ✅ FIXED: Proper logout function
//   const handleLogout = () => {
//     // Clear all tokens
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminData");
//     localStorage.removeItem("user");
    
//     // Clear profile context
//     clearProfile();
    
//     // ✅ Redirect to HOME page
//     window.location.href = '/#/';
//   };

//   return (
//     <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
//       <div className="container mx-auto px-6">
//         <div className="flex flex-col lg:flex-row justify-between items-center py-4 gap-4">
//           {/* Logo */}
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-amber-600">
//                Mingle <span className="text-gray-800">Hub</span>
//             </h1>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1">
//             <ul className="flex flex-wrap justify-center gap-6 lg:gap-8">
//               <li>
//                 <Link
//                   to="/"
//                   className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
//                 >
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/"
//                   className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
//                 >
//                   About
//                 </Link>
//               </li>
              
//               {/* ✅ FIXED: Show these only when user is logged in */}
//               {isLoggedIn ? (
//                 <>
//                   <li>
//                     <Link
//                       to="/dashboard"
//                       className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
//                     >
//                       Dashboard
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/members"
//                       className="text-amber-600 font-medium border-amber-600 transition-colors duration-200"
//                     >
//                       Members
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/edit-profile"
//                       className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
//                     >
//                       Edit Profile
//                     </Link>
//                   </li>
//                 </>
//               ) : (
//                 // Show nothing extra when not logged in
//                 null
//               )}
              
//               <li>
//                 <Link
//                   to="/contact"
//                   className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
//                 >
//                   Contact Us
//                 </Link>
//               </li>
                  
//               <li>
//                 <Link
//                   to="/"
//                   className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
//                 >
//                   Blogs
//                 </Link>
//               </li>
//             </ul>
//           </nav>

//           {/* Auth Section */}
//           <div className="flex items-center gap-4">
//             {isLoggedIn ? (
//               <>
//                 {/* Show notification bell only if user token exists (not admin) */}
//                 {localStorage.getItem("accessToken") && <NotificationBell />}
                
//                 {/* User Welcome */}
//                 <div className="hidden md:flex items-center gap-2 text-gray-700">
//                   <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
//                     <span className="text-amber-600 font-semibold text-sm">
//                       {profile?.name?.charAt(0) || 'U'}
//                     </span>
//                   </div>
//                   <span className="text-sm">
//                     {localStorage.getItem("adminToken") ? "Welcome, Admin" : `Welcome, ${profile?.name?.split(' ')[0] || 'User'}`}
//                   </span>
//                 </div>
                
//                 {/* Logout Button */}
//                 <button
//                   onClick={handleLogout}
//                   className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <div className="flex items-center gap-3">
//                 {/* Auth Buttons - Show when NOT logged in */}
//                 <Link
//                   to="/admin-login"
//                   className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
//                 >
//                  Admin Login
//                 </Link>

//                 <Link
//                   to="/login"
//                   className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
//                 >
//                   Register Free
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Button */}
//       <div className="lg:hidden flex justify-center pb-2">
//         <div className="flex items-center gap-4 text-sm text-gray-600">
//           {isLoggedIn && (
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
//                 <span className="text-amber-600 font-semibold text-xs">
//                   {profile?.name?.charAt(0) || 'U'}
//                 </span>
//               </div>
//               <span>
//                 {localStorage.getItem("adminToken") ? "Hi, Admin" : `Hi, ${profile?.name?.split(' ')[0] || 'User'}`}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;













