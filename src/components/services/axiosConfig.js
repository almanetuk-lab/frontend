import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3435", // Change if backend URL is different
});

export default api;
