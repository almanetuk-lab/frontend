import axios from "axios";

const api = axios.create({
    baseURL: "https://backend-q0wc.onrender.com", // Change if backend URL is different
});

export default api;
