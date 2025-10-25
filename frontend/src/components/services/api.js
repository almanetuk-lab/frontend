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

// RESPONSE INTERCEPTOR HATA DO - Not needed
// api.interceptors.response.use(...)

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

// Admin Login 

// Admin APIs
export const adminAPI = {
  login: (credentials) => api.post('/api/admin/login', credentials),
  
  // Future APIs - aap add karte jayenge
  getPendingUsers: () => api.get('/api/admin/pending-users'),
  updateUserStatus: (userId, status) => api.put(`/api/admin/users/${userId}/status`, { status }),
  
};

export default api;


































































































