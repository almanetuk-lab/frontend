
// import axios from 'axios';

// // Axios create instance 
// const api = axios.create({
//   baseURL: 'https://backend-q0wc.onrender.com', // backend URL
//   headers: {
//     'Content-Type': 'application/json', // send the js data
//   },
// });

// export default api;


// --------------------------------------------------------------//
// src/services/api.js


import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("api_url : ",API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
 // withCredentials: true
});

export const registerUser = async (formData) => {
  try {
    console.log(API_BASE_URL);
    console.log(api);
    const response = await api.post("/api/register", formData);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    throw error;
  }
};

// =================================================================
//                 API Functions for Profile Editing (Adjusted for user_id in body)
// =================================================================

// ✅ Function to fetch user profile data
// Assuming GET /api/profile does NOT take userId in URL,
// but rather expects userId to be derived from the token/session on backend.
// If your GET /api/profile also needs user_id in BODY, you'd need to adjust this.
// For now, assuming it fetches CURRENT user's profile based on auth token.
export const fetchUserProfile = async (token) => { // Removed userId from parameters
  try {
    const response = await api.get(`/api/profile`, { // Changed URL to /api/profile
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch User Profile Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to update user profile data (text fields and photo URL)
// This will send user_id as part of the JSON body, not in the URL.
export const updateUserProfile = async (profileData, token) => { // Removed userId from parameters
  try {
    // Assuming API endpoint is /api/editProfile as per your Postman screenshot
    // profileData should now include 'user_id' as well.
    const response = await api.put(`/api/editProfile`, profileData, { // Changed URL to /api/editProfile
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update User Profile Error:", error.response?.data || error.message);
    throw error;
  }
};

export default api;







 
// // src/services/api.js
// import axios from "axios";

// // Base URL le raha hai .env se
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Axios instance create
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Example function for register
// export const registerUser = async (formData) => {
//   try {
//     const response = await api.post("/api/register", formData);
//     return response.data;
//   } catch (error) {
//     console.error("Registration Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// export default api;





















// // src/services/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://192.168.1.27:3435", 
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const registerUser = async (userData) => {
//   try {
//     const response = await api.post("/api/register", userData);
//     return response.data;
//   } catch (error) {
//     
//     if (error.response) {
//    
//       throw error.response.data || { message: "Server responded with an error." };
//     } else if (error.request) {
//      
//       throw { message: "No response from server. Check network or server status." };
//     } else {
//      
//       throw { message: "Error setting up the request." };
//     }
//   }
// };

// export default api;















// // src/services/api.js
// import axios from "axios";

// // Axios instance
// const api = axios.create({
//   
//   baseURL: "http://192.168.1.27:3435", 
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ----- Register API -----
// export const registerUser = async (userData) => {
//   try {
//  
//     const response = await api.post("/api/register", userData); 
//     return response.data;
//   } catch (error) {
//     // Agar backend koi error message bheje
//     throw error.response?.data || { message: "Something went wrong!" };
//   }
// };

// export default api;































































