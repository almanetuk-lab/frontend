import axios from "axios";

const api = axios.create({
  baseURL: 
  //"http://localhost:3435",
  "https://backend-q0wc.onrender.com", // Change if backend URL is different
});

//Here We are checking for the token and and passing token into the header of request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
