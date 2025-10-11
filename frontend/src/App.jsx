import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ForgotPassword from "./components/pages/ForgotPassword";
import Header from "./components/home/Header";
import Footer from "./components/home/Footer";
import UserCreateForm from "./components/profiles/CreateProfile";
import Dashboard from "./components/pages/Dashbord";
import { UserProfileProvider } from "./components/context/UseProfileContext";
import EditProfile from "./components/profiles/EditProfile";
import MatchHome from "./components/home/MatchHome";
import AdminPage from "./components/admin/AdminPage";

export default function App() {
  return (
    <UserProfileProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<MatchHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-profile" element={<UserCreateForm />} />
            <Route path="/profile/edit" element={<EditProfile/>} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </UserProfileProvider>
  );
}



























// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//      <h1 className="text-3xl font-bold text-gray-700 underline">
//       Hello world!
//     </h1>
//        </>
//   )
// }

// export default App
