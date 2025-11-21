import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

console.log("api_url:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ONLY REQUEST INTERCEPTOR (Token attach karne ke liye)
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

// Normalize response
export const normalizeAuthResponse = (data = {}) => {
  const token = data?.accessToken || data?.token || data?.access_token || null;
  const refresh = data?.refreshToken || data?.refresh_token || null;
  const user = data?.user_profile || data?.user || data?.profile_info || null;
  
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

// ✅ Image Upload API
export const uploadImage = (formData) => {
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ✅ Save Profile Image API
export const saveProfileImage = (user_id, imageUrl) => {
  return api.post('/saveProfileImage', {
    user_id,
    imageUrl,
  });
};

// ✅ NEW: Remove Profile Image API
export const removeProfileImage = (user_id) => {
  return api.post('/remove/profile-picture', {
    user_id,
  });
};

// ✅ ADDED: Refresh Token API (Dummy implementation) - EXPORT KARO
export const refreshAuthToken = async (refreshToken) => {
  try {
    console.log("🔄 Attempting token refresh...");
    
    // Since refresh API doesn't exist, we'll try to reuse current token
    const currentToken = localStorage.getItem("accessToken");
    if (currentToken) {
      console.log("✅ Using current token as fallback");
      return { 
        token: currentToken, 
        refresh: refreshToken 
      };
    }
    throw new Error("No token available for refresh");
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    throw error;
  }
};

// Admin APIs
export const adminAPI = {
  login: (credentials) => api.post('/api/admin/login', credentials),
};

export default api;

























































































