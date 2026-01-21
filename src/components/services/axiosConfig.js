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

// FIXED INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Check which token to use based on URL/context
    const isAdminRoute = config.url?.includes('/admin') || 
                         config.url?.includes('/admin/');
    
    if (isAdminRoute) {
      // Admin routes ke liye adminToken
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      // Normal user routes ke liye accessToken
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;














// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://backend-q0wc.onrender.com";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // EK HI INTERCEPTOR USE KARO
// api.interceptors.request.use(
//   (config) => {
//     // Pehle adminToken check karo (priority to admin)
//     const adminToken = localStorage.getItem("adminToken");
    
//     if (adminToken) {
//       config.headers.Authorization = `Bearer ${adminToken}`;
//     } 
//     // Agar adminToken nahi hai, tab accessToken check karo
//     else {
//       const accessToken = localStorage.getItem("accessToken");
//       if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//       }
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;






















// // import axios from "axios";

// // const API_BASE_URL =
// //   import.meta.env.VITE_API_BASE_URL ||
// //   "https://backend-q0wc.onrender.com";

// // const api = axios.create({
// //   baseURL: API_BASE_URL,
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });

// // //  ADD THIS INTERCEPTOR
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem("accessToken"); 
// //     // ya jo bhi tumhara token key ho

// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
    
// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("adminToken");
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;

// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );


// // export default api;



// // // import axios from "axios";

// // // const api = axios.create({
// // //   baseURL: 
// // //   //"http://localhost:3435",
// // //   "https://backend-q0wc.onrender.com", // Change if backend URL is different
// // // });

// // // //Here We are checking for the token and and passing token into the header of request
// // // api.interceptors.request.use((config) => {
// // //   const token = localStorage.getItem("adminToken");
// // //   if (token) {
// // //     config.headers.Authorization = `Bearer ${token}`;
// // //   }
// // //   return config;
// // // });

// // // export def
