import axios from 'axios';

// Axios create instance 
const api = axios.create({
  baseURL: 'https://backend-q0wc.onrender.com', // backend URL
  headers: {
    'Content-Type': 'application/json', // send the js data
  },
});

export default api;

























// // src/services/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ?? "", // .env me VITE_API_URL set hona chahiye
//   // timeout: 10000, // optional
// });

// // helper to set/remove Authorization header globally
// export function setAuthToken(token) {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// }

// export default api;







// // src/services/api.js
// import axios from "axios";

// // 🔹 yha par apna backend ka link daalo
// // agar baad me render.com par deploy karo to uska URL yha replace kar dena
// // example: const BASE_URL = "https://your-backend.onrender.com";

// const BASE_URL = "https://backend-q0wc.onrender.com";

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: false, // cors avoid (false rakho agar cookies nahi use ho rahi)
// });

// export default api;
