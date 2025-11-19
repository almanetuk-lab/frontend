import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
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
// Linkde login button 
import LinkedInCallback from './components/social/LinkedInCallback';

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

// Main Layout Component
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <UserProfileProvider>
        <Routes>
          {/* Admin Routes - SEPARATE (No Header/Footer) */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/linkedin-callback" element={<LinkedInCallback />} />

          {/* Public Routes WITH Header & Footer */}
          <Route path="/" element={
            <MainLayout>
              <Home />
            </MainLayout>
          } />
          
          <Route path="/login" element={
            <MainLayout>
              <PublicRoute>
                <Login />
              </PublicRoute>
            </MainLayout>
          } />
          
          <Route path="/register" element={
            <MainLayout>
              <PublicRoute>
                <Register />
              </PublicRoute>
            </MainLayout>
          } />
          
          <Route path="/forgot-password" element={
            <MainLayout>
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            </MainLayout>
          } />

          {/* Protected User Routes WITH Header & Footer */}
          <Route path="/dashboard/*" element={
            <MainLayout>
              <UserProtectedRoute>
                <UserDashboard />
              </UserProtectedRoute>
            </MainLayout>
          } />
          {/* "/dashboard/*" */}
          
          <Route path="/create-profile" element={
            <MainLayout>
              <UserProtectedRoute>
                <UserCreateForm />
              </UserProtectedRoute>
            </MainLayout>
          } />
          
          <Route path="/edit-profile" element={
            <MainLayout>
              <UserProtectedRoute>
                <EditProfile />
              </UserProtectedRoute>
            </MainLayout>
          } />
          
          <Route path="/contact" element={
            <MainLayout>
              <UserProtectedRoute>
                <Contact />
              </UserProtectedRoute>
            </MainLayout>
          } />

          {/* Chat Routes WITH Header & Footer */}
          <Route path="/chat" element={
            <MainLayout>
              <UserProtectedRoute>
                <ChatModule />
              </UserProtectedRoute>
            </MainLayout>
          } />
          
          <Route path="/search" element={
            <MainLayout>
              <UserProtectedRoute>
                <AdvancedSearch />
              </UserProtectedRoute>
            </MainLayout>
          } />

          {/* Matches Routes WITH Header & Footer */}
          <Route path="/matches" element={
            <MainLayout>
              <UserProtectedRoute>
                <MatchesPage />
              </UserProtectedRoute>
            </MainLayout>
          } />

          {/* Member Routes WITH Header & Footer */}
          <Route path="/members" element={
            <MainLayout>
              <UserProtectedRoute>
                <MembersPage />
              </UserProtectedRoute>
            </MainLayout>
          } />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </UserProfileProvider>
    </BrowserRouter>
  );
}









// import React from "react";
// import {  Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
// // import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
// import { UserProfileProvider } from "./components/context/UseProfileContext";
// import Header from "./components/home/Header";
// import Footer from "./components/home/Footer";

// // Auth Pages
// import Login from "./components/pages/Login";
// import Register from "./components/pages/Register";
// import ForgotPassword from "./components/pages/ForgotPassword";

// // Main Pages
// import Home from "./components/pages/Home";

// // Dashboard & Profile Pages
// import UserDashboard from "./components/dashboard/UserDashbord";
// import UserCreateForm from "./components/profiles/CreateProfile";
// import EditProfile from "./components/profiles/EditProfile";

// // Admin Setup
// import ProtectedRoute from './components/admin/ProtectedRoute';
// import AdminPage from "./components/admin/AdminPage";
// import AdminLogin from "./components/admin/AdminLogin";

// // Chat System
// import ChatModule from "./components/chatsystem/ChatModule";
// import AdvancedSearch from "./components/chatsystem/AdvancedSearch";

// // Match System
// import MatchesPage from './components/MatchSystem/MatchesPage';
// import MembersPage from "./components/pages/MemberPage";
// import Contact from "./components/pages/Contact";
// // Linkde login button 
// import LinkedInCallback from './components/social/LinkedInCallback';

// // Protected Route Component (For regular users)
// const UserProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("accessToken");
//   return token ? children : <Navigate to="/login" />;
// };

// // Public Route Component (Redirect to dashboard if logged in)
// const PublicRoute = ({ children }) => {
//   const token = localStorage.getItem("accessToken");
//   return !token ? children : <Navigate to="/dashboard" />;
// };

// // Main Layout Component
// const MainLayout = ({ children }) => (
//   <div className="flex flex-col min-h-screen">
//     <Header />
//     <main className="flex-grow">{children}</main>
//     <Footer />
//   </div>
// );

// export default function App() {
//   return (
//     <BrowserRouter>
//       <UserProfileProvider>
//         <Routes>
//           {/* Admin Routes - SEPARATE (No Header/Footer) */}
//           <Route path="/admin-login" element={<AdminLogin />} />
//           <Route 
//             path="/admin-dashboard" 
//             element={
//               <ProtectedRoute>
//                 <AdminPage />
//               </ProtectedRoute>
//             } 
//           />
// <Route path="/linkedin-callback"
// element={
// <LinkedInCallback />}
//  />
//           {/* Main App Routes WITH Header & Footer */}
//           <Route path="/" element={
//             <MainLayout>
//               <Routes>
//                 {/* Public Routes */}
//                 <Route path="/" element={
//                   <PublicRoute>
//                     <Home />
//                   </PublicRoute>
//                 } />
//                 <Route path="/login" element={
//                   <PublicRoute>
//                     <Login />
//                   </PublicRoute>
//                 } />
//                 <Route path="/register" element={
//                   <PublicRoute>
//                     <Register />
//                   </PublicRoute>
//                 } />
//                 <Route path="/forgot-password" element={
//                   <PublicRoute>
//                     <ForgotPassword />
//                   </PublicRoute>
//                 } />

//                 {/* Protected User Routes */}
//                 <Route path="/dashboard/*" element={
//                   <UserProtectedRoute>
//                     <UserDashboard />
//                   </UserProtectedRoute>
//                 } />
//                 <Route path="/create-profile" element={
//                   <UserProtectedRoute>
//                     <UserCreateForm />
//                   </UserProtectedRoute>
//                 } />
//                 <Route path="/edit-profile" element={
//                   <UserProtectedRoute>
//                     <EditProfile />
//                   </UserProtectedRoute>
//                 } />
//                 <Route path="/contact" element={
//                   <UserProtectedRoute>
//                     <Contact />
//                   </UserProtectedRoute>
//                 } />

//                 {/* Chat Routes */}
//                 <Route path="/chat" element={
//                   <UserProtectedRoute>
//                     <ChatModule />
//                   </UserProtectedRoute>
//                 } />
//                 <Route path="/search" element={
//                   <UserProtectedRoute>
//                     <AdvancedSearch />
//                   </UserProtectedRoute>
//                 } />

//                 {/* Matches Routes */}
//                 <Route path="/matches" element={
//                   <UserProtectedRoute>
//                     <MatchesPage />
//                   </UserProtectedRoute>
//                 } />

//                 {/* Member Routes */}
//                 <Route path="/members" element={
//                   <UserProtectedRoute>
//                     <MembersPage />
//                   </UserProtectedRoute>
//                 } />

//                 {/* Fallback Route */}
//                 <Route path="/" element={<Navigate to="/" />} />
//               </Routes>
//             </MainLayout>
//           } />
//         </Routes>
//       </UserProfileProvider>
//     </BrowserRouter>
//   );
// }















