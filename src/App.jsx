import React from "react";
import { HashRouter, Routes, Route, Navigate,useNavigate } from "react-router-dom";
import { useState} from "react";
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

import axios from "axios";
import AddNewPlan from "./components/admin/AddPlanForm";
import UserPlans from "./components/pages/UserPlans";
import Cart from "./components/pages/cart";

const BASE_URL = "http://localhost:3435/api/admin/plans";

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
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    duration: 0,
    video_call_limit: 0,
    people_search_limit: 0,
    people_message_limit: 0,
    audio_call_limit: 0,
    type: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchPlans = async () => {
    const res = await axios.get(BASE_URL);
    setPlans(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId) {
      await axios.post(BASE_URL, formData);
    } else {
      setIsOpen(true);
    }

    setFormData({
      name: "",
      price: "",
      duration: "",
      video_call_limit: "",
      people_search_limit: "",
      people_message_limit: "",
      audio_call_limit: "",
      type: "",
    });

    navigate("/admin-dashboard");

    fetchPlans();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
      
      <UserProfileProvider>
        <Routes>
          <Route path='/admin-plans-new' element={<AddNewPlan handleChange={handleChange} handleSubmit={handleSubmit} editingId={editingId} setEditingId={setEditingId} formData={formData} />} />
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
          {/* Main App Routes WITH Header & Footer */}
          <Route
            path="*"
            element={
              <MainLayout>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <PublicRoute>
                        <Home />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicRoute>
                        <ForgotPassword />
                      </PublicRoute>
                    }
                  />

                  {/* Protected User Routes */}
                  <Route
                    path="/dashboard/*"
                    element={
                      <UserProtectedRoute>
                        <UserDashboard />
                      </UserProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-profile"
                    element={
                      <UserProtectedRoute>
                        <UserCreateForm />
                      </UserProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-profile"
                    element={
                      <UserProtectedRoute>
                        <EditProfile />
                      </UserProtectedRoute>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <UserProtectedRoute>
                        <Contact />
                      </UserProtectedRoute>
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
                      <UserProtectedRoute>
                        <Cart />
                      </UserProtectedRoute>
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

                  {/* Member Routes */}
                  <Route
                    path="/members"
                    element={
                      <UserProtectedRoute>
                        <MembersPage />
                      </UserProtectedRoute>
                    }
                  />

                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </UserProfileProvider>
    
  );
}
