import axios from "axios";

const DEFAULT_BASE = "http://192.168.1.27:3435"; // backend IP + port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;

console.log("api_url:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------- Set / Remove Authorization Header ----------
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ---------- Normalize Backend Auth Response ----------
export const normalizeAuthResponse = (data = {}) => {
  const token = data?.accessToken || data?.token || data?.access_token || null;
  const refresh = data?.refreshToken || data?.refresh_token || null;
  const user =
    data?.user_profile ||
    data?.user ||
    (data?.user?.profile_info ? data.user.profile_info : null) ||
    null;

  return { token, refresh, user };
};

// ---------- Axios Request Interceptor ----------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- Axios Response Interceptor ----------
api.interceptors.response.use(
  (response) => {
    // Update token if backend sends a new one
    const token = response?.data?.accessToken || response?.data?.token;
    if (token) localStorage.setItem("accessToken", token);
    return response;
  },
  (error) => Promise.reject(error)
);

// ---------- Login ----------
export const loginUser = async ({ email, password }) => {
  try {
    const res = await api.post("/api/login", { email, password });
    return normalizeAuthResponse(res?.data ?? res);
  } catch (err) {
    throw err;
  }
};

// ---------- Register ----------
export const registerUser = async (formData) => {
  try {
    const res = await api.post("/api/register", formData);
    const normalized = normalizeAuthResponse(res?.data ?? res);

    // Fallback if user not in normalized object
    if (!normalized.user && res?.data?.user) {
      const maybeUser = res.data.user.profile_info || res.data.user;
      return { token: normalized.token, refresh: normalized.refresh, user: maybeUser };
    }
    return normalized;
  } catch (err) {
    throw err;
  }
};

// ---------- Update Profile ----------
export const updateUserProfile = async (profileData, token) => {
  try {
    if (token) setAuthToken(token);
    const res = await api.put("/api/editProfile", profileData);
    const user = res?.data?.user || res?.data?.user_profile || null;
    return { user, raw: res?.data ?? res };
  } catch (err) {
    console.error("Update Profile Error:", err.response?.data || err.message);
    throw err;
  }
};

export default api;





















// // src/services/api.js
// import axios from "axios";

// const DEFAULT_BASE = "http://192.168.1.27:3435"; // backend IP + port
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;

// console.log("api_url : ",API_BASE_URL);

// const api = axios.create({
//   baseURL: API_BASE_URL,

//   headers: { "Content-Type": "application/json" },

//   headers: {
//     "Content-Type": "application/json",
//   },
//  // withCredentials: true

// });

// // helper to set/remove Authorization header globally
// export const setAuthToken = (token) => {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// };

// const normalizeAuthResponse = (data = {}) => {
//   // backend may return different shapes; normalize to { token, refresh, user }
//   const token = data?.accessToken || data?.token || data?.access_token || null;
//   const refresh = data?.refreshToken || data?.refresh_token || null;

//   // user might be in user_profile, user, or user.profile_info
//   const user =
//     data?.user_profile ||
//     data?.user ||
//     (data?.user && data.user.profile_info) ||
//     (data?.user && data.user_profile) ||
//     null;

//   return { token, refresh, user };
// };

// // ---------- Login ----------
// export const loginUser = async ({ email, password }) => {
//   try {
//     const response = await api.post("/api/login", { email, password });
//     const data = response?.data ?? response;
//     return normalizeAuthResponse(data);
//   } catch (error) {
//     // rethrow so caller can read error.response etc.
//     throw error;
//   }
// };

// // ---------- Register ----------
// export const registerUser = async (formData) => {
//   try {
//     console.log(API_BASE_URL);
//     console.log(api);
//     const response = await api.post("/api/register", formData);
//     const data = response?.data ?? response;
//     // backend earlier returned { message, user } — user may contain profile_info
//     // Normalize: if server didn't send token, we still return normalized object
//     const normalized = normalizeAuthResponse(data);
//     // If normalized.user is null but data.user exists, map it
//     if (!normalized.user && data?.user) {
//       // if server returned { user: { profile_info: {...}, email } }
//       const maybeUser = data.user.profile_info ? data.user.profile_info : data.user;
//       return { token: normalized.token, refresh: normalized.refresh, user: maybeUser };
//     }
//     return normalized;
//   } catch (error) {
//     throw error;
//   }
// };

// // ---------- Update Profile ----------
// // profileData can be JSON or FormData (for images)
// export const updateUserProfile = async (profileData, token) => {
//   try {
//     if (token) setAuthToken(token);
//     // axios will set content-type automatically for FormData
//     const response = await api.put("/api/editProfile", profileData);
//     const data = response?.data ?? response;
//     // Server returns { message, user, profile } — pick user/profile
//     const user = data?.user ?? data?.user_profile ?? null;
//     const profile = data?.profile ?? null;
//     return { user, profile, raw: data };
//   } catch (error) {


//     console.error("Fetch User Profile Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// export default api;



// // ✅ Function to update user profile data (text fields and photo URL)
// // This will send user_id as part of the JSON body, not in the URL.
// export const updateUserProfile = async (profileData, token) => { // Removed userId from parameters
//   try {
//     // Assuming API endpoint is /api/editProfile as per your Postman screenshot
//     // profileData should now include 'user_id' as well.
//     const response = await api.put(`/api/editProfile`, profileData, { // Changed URL to /api/editProfile
//       headers: {
//         "Content-Type": "application/json",
//          Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Update User Profile Error:", error.response?.data || error.message);

//     throw error;
//   }
// };





















// import axios from "axios";

// const DEFAULT_BASE = "http://192.168.1.27:3435"; // backend IP + port
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// // helper to set/remove Authorization header globally
// export const setAuthToken = (token) => {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// };

// // ---------- Login ----------
// export const loginUser = async ({ email, password }) => {
//   try {
//     const response = await api.post("/api/login", { email, password });
//     return response.data; // { user_profile, accessToken, refreshToken }
//   } catch (error) {
//     throw error;
//   }
// };

// // ---------- Register ----------
// export const registerUser = async (formData) => {
//   try {
//     const response = await api.post("/api/register", formData);
//     return response.data; // { user, accessToken, refreshToken }
//   } catch (error) {
//     throw error;
//   }
// };

// // ---------- Update Profile ----------
// export const updateUserProfile = async (profileData, token) => {
//   try {
//     setAuthToken(token);
//     const response = await api.put("/api/editProfile", profileData);
//     return response.data; // { user, profile }
//   } catch (error) {
//     throw error;
//   }
// };

// export default api;

















// // src/services/api.js
// import axios from "axios";

// const DEFAULT_BASE = "http://192.168.1.27:3435"; // fallback if env missing
// // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;


// console.log("API baseURL (used):", API_BASE_URL);

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /* ---------- Login ---------- */
// export const loginUser = async ({ email, password }) => {
//   try {
//     const response = await api.post("/api/login", { email, password });
//     return response.data; // expect: { token, user }
//   } catch (error) {
//     console.error("Login Error:", error.response?.data || error.message);
//     throw error;
//   }
// };


// // helper to set/remove Authorization header globally
// export function setAuthToken(token) {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// }

// /* ---------- Auth / Register ---------- */
// export const registerUser = async (formData) => {
//   try {
//     const response = await api.post("/api/register", formData);
//     return response.data;
//   } catch (error) {
//     console.error("Registration Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// /* ---------- Profile fetch/update (use api defaults for auth) ---------- */
// // export const fetchUserProfile = async () => {
// //   try {
// //     const response = await api.get("/api/profile");
// //     return response.data;
// //   } catch (error) {
// //     console.error("Fetch User Profile Error:", error.response?.data || error.message);
// //     throw error;
// //   }
// // };

// export const updateUserProfile = async (profileData) => {
//   try {
//     // If you need multipart/form-data, you can detect and send accordingly.
//     // Here we send JSON. If profileData is FormData, axios will set header automatically.
//     if (profileData instanceof FormData) {
//       const response = await api.put("/api/editProfile", profileData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return response.data;
//     } else {
//       const response = await api.put("/api/editProfile", profileData);
//       return response.data;
//     }
//   } catch (error) {
//     console.error("Update User Profile Error:", error.response?.data || error.message);
//     throw error;
//   }
// }

// export default api;












































































