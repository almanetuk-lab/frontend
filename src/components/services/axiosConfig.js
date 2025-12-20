import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-q0wc.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  ADD THIS INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); 
    // ya jo bhi tumhara token key ho

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;



// import axios from "axios";

// const api = axios.create({
//   baseURL: 
//   //"http://localhost:3435",
//   "https://backend-q0wc.onrender.com", // Change if backend URL is different
// });

// //Here We are checking for the token and and passing token into the header of request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("adminToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
