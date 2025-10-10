
// import axios from 'axios';

// // Axios create instance 
// const api = axios.create({
//   baseURL: 'https://backend-q0wc.onrender.com', // backend URL
//   headers: {
//     'Content-Type': 'application/json', // send the js data
//   },
// });

// export default api;




// src/services/api.js
import axios from "axios";

// Base URL le raha hai .env se
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios instance create
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Example function for register
export const registerUser = async (formData) => {
  try {
    const response = await api.post("/api/register", formData);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    throw error;
  }
};

export default api;





















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































































