/* src/main.jsx */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthProvider.jsx";
import "./index.css";
import { UserProfileProvider } from "./components/context/UseProfileContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    {/* <BrowserRouter> */}
      <UserProfileProvider>
        <App />
      </UserProfileProvider>
    {/* </BrowserRouter> */}
  </AuthProvider>
);





// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
