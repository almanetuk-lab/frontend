import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

console.log("api_url:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Variables for token refresh handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ONLY REQUEST INTERCEPTOR Token attach karne ke liye hai 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// NEW: RESPONSE INTERCEPTOR for auto token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If already refreshing, add request to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh token API (your existing endpoint)
        const response = await axios.post(
          `${API_BASE_URL}/api/refreshtoken`,
          {}, // Empty body as per your API
          {
            headers: {
              'Authorization': `Bearer ${refreshToken}`,
            },
          }
        );

        const data = response.data;

        // Check if refresh was successful
        if (data.status === 'success' && data.accessToken) {
          const newAccessToken = data.accessToken;
          
          // Store new access token
          localStorage.setItem("accessToken", newAccessToken);
          
          // Update current request header
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Process queued requests
          processQueue(null, newAccessToken);
          
          // Retry the original request with new token
          return api(originalRequest);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Normalize response
export const normalizeAuthResponse = (data = {}) => {
  const token = data?.accessToken || data?.token || data?.access_token || null;
  const refresh = data?.refreshToken || data?.refresh_token || null;
  const user = data?.user_profile || data?.user || data?.profile_info || null;
  
  // Store refresh token if available
  if (refresh) {
    localStorage.setItem("refreshToken", refresh);
  }
  
  return { token, refresh, user };
};

// Login API
export const loginUser = async ({ email, password }) => {
  try {
    const res = await api.post("/api/login", { email, password });
    const data = res.data;
    
    // Manual token save (Interceptor ki jagah)
    if (data.accessToken || data.token) {
      localStorage.setItem("accessToken", data.accessToken || data.token);
    }
    
    return normalizeAuthResponse(data);
  } catch (err) {
    throw err;
  }
};

// Register API  
export const registerUser = async (formData) => {
  try {
    const res = await api.post("/api/register", formData);
    const data = res.data;
    
    // Manual token save
    if (data.accessToken || data.token) {
      localStorage.setItem("accessToken", data.accessToken || data.token);
    }
    
    return normalizeAuthResponse(data);
  } catch (err) {
    throw err;
  }
};

// Update Profile API
export const updateUserProfile = async (profileData) => {
  try {
    const res = await api.put("/api/editProfile", profileData);
    return res.data;
  } catch (err) {
    console.error("Update Profile Error:", err.response?.data || err.message);
    throw err;
  }
};

// Get User Profile API
export const getUserProfile = async () => {
  try {
    const res = await api.get("/api/me");
    return res.data;
  } catch (err) {
    throw err;
  }
};

//  Image Upload API HAI
export const uploadImage = (formData) => {
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Save Profile Image API
export const saveProfileImage = (user_id, imageUrl) => {
  return api.post('/saveProfileImage', {
    user_id,
    imageUrl,
  });
};

//  NEW: Remove Profile Image API
export const removeProfileImage = (user_id) => {
  return api.post('/remove/profile-picture', {
    user_id,
  });
};

//  UPDATED: Refresh Token API (Proper implementation)
export const refreshAuthToken = async () => {
  try {
    console.log("🔄 Attempting token refresh...");
    
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    
    const response = await axios.post(
      `${API_BASE_URL}/api/refreshtoken`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
        },
      }
    );
    
    const data = response.data;
    
    if (data.status === 'success' && data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      console.log("✅ Token refreshed successfully");
      return { 
        token: data.accessToken, 
        refresh: refreshToken 
      };
    }
    
    throw new Error("Token refresh failed");
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    
    // Clear tokens on failure
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    throw error;
  }
};

// Manual refresh token call (if needed)
export const manualRefreshToken = async () => {
  return refreshAuthToken();
};

// Admin APIs
export const adminAPI = {
  login: (credentials) => api.post('/api/admin/login', credentials),
};

export default api;














// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

// console.log("api_url:", API_BASE_URL);

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// // ONLY REQUEST INTERCEPTOR Token attach karne ke liye hai 
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Normalize response
// export const normalizeAuthResponse = (data = {}) => {
//   const token = data?.accessToken || data?.token || data?.access_token || null;
//   const refresh = data?.refreshToken || data?.refresh_token || null;
//   const user = data?.user_profile || data?.user || data?.profile_info || null;
  
//   return { token, refresh, user };
// };

// // Login API
// export const loginUser = async ({ email, password }) => {
//   try {
//     const res = await api.post("/api/login", { email, password });
//     const data = res.data;
    
//     // Manual token save (Interceptor ki jagah)
//     if (data.accessToken || data.token) {
//       localStorage.setItem("accessToken", data.accessToken || data.token);
//     }
    
//     return normalizeAuthResponse(data);
//   } catch (err) {
//     throw err;
//   }
// };

// // Register API  
// export const registerUser = async (formData) => {
//   try {
//     const res = await api.post("/api/register", formData);
//     const data = res.data;
    
//     // Manual token save
//     if (data.accessToken || data.token) {
//       localStorage.setItem("accessToken", data.accessToken || data.token);
//     }
    
//     return normalizeAuthResponse(data);
//   } catch (err) {
//     throw err;
//   }
// };

// // Update Profile API
// export const updateUserProfile = async (profileData) => {
//   try {
//     const res = await api.put("/api/editProfile", profileData);
//     return res.data;
//   } catch (err) {
//     console.error("Update Profile Error:", err.response?.data || err.message);
//     throw err;
//   }
// };

// // Get User Profile API
// export const getUserProfile = async () => {
//   try {
//     const res = await api.get("/api/me");
//     return res.data;
//   } catch (err) {
//     throw err;
//   }
// };

// //  Image Upload API HAI
// export const uploadImage = (formData) => {
//   return api.post('/upload', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };

// // Save Profile Image API
// export const saveProfileImage = (user_id, imageUrl) => {
//   return api.post('/saveProfileImage', {
//     user_id,
//     imageUrl,
//   });
// };

// //  NEW: Remove Profile Image API
// export const removeProfileImage = (user_id) => {
//   return api.post('/remove/profile-picture', {
//     user_id,
//   });
// };

// //  ADDED: Refresh Token API (Dummy implementation) - EXPORT KARO
// export const refreshAuthToken = async (refreshToken) => {
//   try {
//     console.log("🔄 Attempting token refresh...");
    
//     // Since refresh API doesn't exist, we'll try to reuse current token
//     const currentToken = localStorage.getItem("accessToken");
//     if (currentToken) {
//       console.log(" Using current token as fallback");
//       return { 
//         token: currentToken, 
//         refresh: refreshToken 
//       };
//     }
//     throw new Error("No token available for refresh");
//   } catch (error) {
//     console.error("❌ Token refresh failed:", error);
//     throw error;
//   }
// };

// // Admin APIs
// export const adminAPI = {
//   login: (credentials) => api.post('/api/admin/login', credentials),
// };

// export default api;

























































































