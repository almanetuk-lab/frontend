import React from "react";
import { HashRouter , Routes, Route, useLocation, Navigate } from "react-router-dom";
import { UserProfileProvider } from "./components/context/UseProfileContext";
import Header from "./components/home/Header";
import Footer from "./components/home/Footer";


// Auth Pages
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ForgotPassword from "./components/pages/ForgotPassword";

// Main Pages
import Home from "./components/pages/Home";

// Dashboard & Profile Pages
import UserDashboard from "./components/dashboard/UserDashbord";
import UserCreateForm from "./components/profiles/CreateProfile";
import EditProfile from "./components/profiles/EditProfile";
// import ProfilePage from "./components/profiles/ProfilePage";

// Admin Setup
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminPage from "./components/admin/AdminPage";
import AdminLogin from "./components/admin/AdminLogin";

// Chat System
import ChatModule from "./components/chatsystem/ChatModule";
import AdvancedSearch from "./components/chatsystem/AdvancedSearch";

// Match System
import MatchesPage from './components/MatchSystem/MatchesPage';
import MembersPage from "./components/pages/MemberPage";
import Contact from "./components/pages/Contact";

// Protected Route Component (For regular users)
const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" />;
};

// Public Route Component (Redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return !token ? children : <Navigate to="/dashboard" />;
};

// Main Layout Component (For non-admin pages)
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Layout Wrapper Component
const LayoutWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />

          {/* Protected User Routes */}
          <Route path="/dashboard/*" element={
            <UserProtectedRoute>
              <UserDashboard />
            </UserProtectedRoute>
          } />
          
          <Route path="/create-profile" element={
            <UserProtectedRoute>
              <UserCreateForm />
            </UserProtectedRoute>
          } />
          
          <Route path="/edit-profile" element={
            <UserProtectedRoute>
              <EditProfile />
            </UserProtectedRoute>
          } />
{           
          <Route path="/Contact" element={
            <UserProtectedRoute>
              <Contact />
            </UserProtectedRoute>
          } /> }

          {/* Chat Routes */}
          <Route path="/chat" element={
            <UserProtectedRoute>
              <ChatModule />
            </UserProtectedRoute>
          } />
          
          <Route path="/search" element={
            <UserProtectedRoute>
              <AdvancedSearch />
            </UserProtectedRoute>
          } />

          {/* Matches Routes */}
          <Route path="/matches" element={
            <UserProtectedRoute>
              <MatchesPage />
            </UserProtectedRoute>
          } />

          {/* Member Routes */}
          <Route path="/members" element={
            <UserProtectedRoute>
              <MembersPage />
            </UserProtectedRoute>
          } />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
<UserProfileProvider>
      <LayoutWrapper />
    </UserProfileProvider>
    </HashRouter>
    
  );
}






// import React from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import Login from "./components/pages/Login";
// import Register from "./components/pages/Register";
// import ForgotPassword from "./components/pages/ForgotPassword";
// import Header from "./components/home/Header";
// import Footer from "./components/home/Footer";
// import UserCreateForm from "./components/profiles/CreateProfile";
// import Dashboard from "./components/pages/Dashbord";
// import { UserProfileProvider } from "./components/context/UseProfileContext";
// import EditProfile from "./components/profiles/EditProfile";
// import Home from "./components/pages/Home";

// // Admin setup
// import ProtectedRoute from './components/admin/ProtectedRoute';
// import AdminPage from "./components/admin/AdminPage";
// import AdminLogin from "./components/admin/AdminLogin";
// import ProfilePage from "./components/profiles/ProfilePage";

// // chat modules 
// import ChatModule from "./components/chatsystem/ChatModule";
// import AdvancedSearch from "./components/chatsystem/AdvancedSearch";

// // match system 
// import MatchesPage from './components/MatchSystem/MatchesPage'
// import MembersPage from "./components/pages/MemberPage";



// // Layout Wrapper Component
// const LayoutWrapper = () => {
//   const location = useLocation();
//   const isAdminRoute = location.pathname.startsWith('/admin');
  
//   if (isAdminRoute) {
//     return (
//       <Routes>
//         <Route path="/admin-login" element={<AdminLogin />} />
//         <Route 
//           path="/admin-dashboard" 
//           element={
//             <ProtectedRoute>
//               <AdminPage />
//             </ProtectedRoute>
//           } 
//         />
//       </Routes>
//     );
//   }
  
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-grow">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/create-profile" element={<UserCreateForm />} />
//           <Route path="/edit-profile" element={<EditProfile />} />
//           <Route path="/profile" element={<ProfilePage />} />

//           // Chat Routes 
// <Route path="/chat" element={<ChatModule/>} />
// <Route path="/search" element={<AdvancedSearch />} />

//         // Matches Routes 
//         <Route path="/matches" element={<MatchesPage />} />

//         //memberRoutes
//         <Route path="/members" element={<MembersPage />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default function App() {
//   return (
//     <UserProfileProvider>
//       <LayoutWrapper />
//     </UserProfileProvider>
//   );
// }
















