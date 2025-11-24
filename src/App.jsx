import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminPage from "./components/admin/AdminPage";
import AdminLogin from "./components/admin/AdminLogin";

// Chat System
import ChatModule from "./components/chatsystem/ChatModule";
import AdvancedSearch from "./components/chatsystem/AdvancedSearch";

// Match System
import MatchesPage from "./components/MatchSystem/MatchesPage";
import MembersPage from "./components/pages/MemberPage";
import Contact from "./components/pages/Contact";
// Linkde login button
import LinkedInCallback from "./components/social/LinkedInCallback";
import AddNewPlan from "./components/admin/AddPlanForm";
import UserPlans from "./components/pages/UserPlans";
import Cart from "./components/pages/cart";
import { useState } from "react";
// Admin plan
import AdminAddNewPlan from "./components/pages/AdminAddNewPlan";
import BlogPage from "./components/pages/BlogPage";

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

// ✅ PlanForm component alag banayein
const PlanFormWrapper = () => {
  // Yahan aap useState aur useNavigate use kar sakte hain
  // Kyunki yeh component HashRouter ke ANDAR hai
  return <AdminAddNewPlan />;
};

export default function App() {
  return (
    // <HashRouter>
    <UserProfileProvider>
      <Routes>
        <Route path="/admin-plans-new" element={<PlanFormWrapper />} />

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
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <MainLayout>
              <PublicRoute>
                <Login />
              </PublicRoute>
            </MainLayout>
          }
        />

        <Route
          path="/register"
          element={
            <MainLayout>
              <PublicRoute>
                <Register />
              </PublicRoute>
            </MainLayout>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <MainLayout>
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            </MainLayout>
          }
        />

        {/* Chat Routes */}
        <Route
          path="/chat"
          element={
            <UserProtectedRoute>
              <ChatModule />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <UserProtectedRoute>
              <AdvancedSearch />
            </UserProtectedRoute>
          }
        />
        {/* plan Routes */}
        <Route
          path="/plans"
          element={
            <UserProtectedRoute>
              <UserPlans />
            </UserProtectedRoute>
          }
        />
        {/* Cart Routes */}
        <Route
          path="/cart"
          element={
            <MainLayout>
              <UserProtectedRoute>
                <Cart />
              </UserProtectedRoute>
            </MainLayout>
          }
        />
        {/* Matches Routes */}
        <Route
          path="/matches"
          element={
            <UserProtectedRoute>
              <MatchesPage />
            </UserProtectedRoute>
          }
        />
        {/* Protected User Routes WITH Header & Footer */}
        <Route
          path="/dashboard/*"
          element={
            <MainLayout>
              <UserProtectedRoute>
                <UserDashboard />
              </UserProtectedRoute>
            </MainLayout>
          }
        />

        <Route
          path="/create-profile"
          element={
            <MainLayout>
              <UserProtectedRoute>
                <UserCreateForm />
              </UserProtectedRoute>
            </MainLayout>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <MainLayout>
              <UserProtectedRoute>
                <EditProfile />
              </UserProtectedRoute>
            </MainLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <MainLayout>
              <UserProtectedRoute>
                <Contact />
              </UserProtectedRoute>
            </MainLayout>
          }
        />

        <Route
          path="/blog"
          element={
            <MainLayout>
              <BlogPage />
            </MainLayout>
          }
        />

        {/* Chat Routes WITH Header & Footer */}
        <Route
          path="/chat"
          element={
            <MainLayout>
              <UserProtectedRoute>
                <ChatModule />
              </UserProtectedRoute>
            </MainLayout>
          }
        />

        <Route
          path="/search"
          element={
            <MainLayout>
              <UserProtectedRoute>
                <AdvancedSearch />
              </UserProtectedRoute>
            </MainLayout>
          }
        />

        {/* Matches Routes WITH Header & Footer */}
        <Route
          path="/matches"
          element={
            <MainLayout>
              <UserProtectedRoute>
                <MatchesPage />
              </UserProtectedRoute>
            </MainLayout>
          }
        />

        {/* Member Routes WITH Header & Footer */}
        <Route
          path="/members"
          element={
            <MainLayout>
              <UserProtectedRoute>
                <MembersPage />
              </UserProtectedRoute>
            </MainLayout>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </UserProfileProvider>
  );
}

// import React from "react";
// // import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useState} from "react";
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
// import ProtectedRoute from "./components/admin/ProtectedRoute";
// import AdminPage from "./components/admin/AdminPage";
// import AdminLogin from "./components/admin/AdminLogin";

// // Chat System
// import ChatModule from "./components/chatsystem/ChatModule";
// import AdvancedSearch from "./components/chatsystem/AdvancedSearch";

// // Match System
// import MatchesPage from "./components/MatchSystem/MatchesPage";
// import MembersPage from "./components/pages/MemberPage";
// import Contact from "./components/pages/Contact";
// // Linkde login button
// import LinkedInCallback from "./components/social/LinkedInCallback";

// import axios from "axios";
// import AddNewPlan from "./components/admin/AddPlanForm";

// const BASE_URL = "http://localhost:3435/api/admin/plans";

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

//   const [formData, setFormData] = useState({
//     name: "",
//     price: 0,
//     duration: 0,
//     video_call_limit: 0,
//     people_search_limit: 0,
//     people_message_limit: 0,
//     audio_call_limit: 0,
//     people_details_visibility: false,
//     type: "",
//   });

//   const [editingId, setEditingId] = useState(null);

//   const fetchPlans = async () => {
//     const res = await axios.get(BASE_URL);
//     setPlans(res.data);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!editingId) {
//       await axios.post(BASE_URL, formData);
//     } else {
//       setIsOpen(true);
//     }

//     setFormData({
//       name: "",
//       price: "",
//       duration: "",
//       video_call_limit: "",
//       people_search_limit: "",
//       people_message_limit: "",
//       audio_call_limit: "",
//       people_details_visibility: "",
//       type: "",
//     });

//     navigate("/admin-dashboard");

//     fetchPlans();
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     // <BrowserRouter>
//     <HashRouter>
//     <UserProfileProvider>
//         <Routes>
//           <Route path='/admin-plans-new' element={<AddNewPlan handleChange={handleChange} handleSubmit={handleSubmit} editingId={editingId} setEditingId={setEditingId} formData={formData} />} />
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

//           <Route path="/linkedin-callback" element={<LinkedInCallback />} />

//           {/* Public Routes WITH Header & Footer */}
//           <Route path="/" element={
//             <MainLayout>
//               <Home />
//             </MainLayout>
//           } />

//           <Route path="/login" element={
//             <MainLayout>
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             </MainLayout>
//           } />

//           <Route path="/register" element={
//             <MainLayout>
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             </MainLayout>
//           } />

//           <Route path="/forgot-password" element={
//             <MainLayout>
//               <PublicRoute>
//                 <ForgotPassword />
//               </PublicRoute>
//             </MainLayout>
//           } />

//           {/* Protected User Routes WITH Header & Footer */}
//           <Route path="/dashboard/*" element={
//             <MainLayout>
//               <UserProtectedRoute>
//                 <UserDashboard />
//               </UserProtectedRoute>
//             </MainLayout>
//           } />
//           {/* "/dashboard/*" */}

//           <Route path="/create-profile" element={
//             <MainLayout>
//               <UserProtectedRoute>
//                 <UserCreateForm />
//               </UserProtectedRoute>
//             </MainLayout>
//           } />

//           <Route path="/edit-profile" element={
//             <MainLayout>
//               <UserProtectedRoute>
//                 <EditProfile />
//               </UserProtectedRoute>
//             </MainLayout>
//           } />

//           <Route path="/contact" element={
//             <MainLayout>
//               <UserProtectedRoute>
//                 <Contact />
//               </UserProtectedRoute>
//             </MainLayout>
//           } />

//           {/* Chat Routes WITH Header & Footer */}
//           <Route path="/chat" element={
//             <MainLayout>
//               <UserProtectedRoute>
//                 <ChatModule />
//               </UserProtectedRoute>
//             </MainLayout>
//           } />

//           <Route path="/search" element={
//             <MainLayout>
//               <UserProtectedRoute>
//                 <AdvancedSearch />
//               </UserProtectedRoute>
//             </MainLayout>
//           } />

//           {/* Matches Routes WITH Header & Footer */}
//           <Route path="/matches" element={
//             <MainLayout>
//               <UserProtectedRoute>
//                 <MatchesPage />
//               </UserProtectedRoute>
//             </MainLayout>
//           } />

//           {/* Member Routes WITH Header & Footer */}
//           <Route path="/members" element={
//             <MainLayout>
//               <UserProtectedRoute>
//                 <MembersPage />
//               </UserProtectedRoute>
//             </MainLayout>
//           } />

//           {/* Fallback Route */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </UserProfileProvider>
//       </HashRouter>

//   );
// }
