import axios from "axios";

const API = "https://backend-q0wc.onrender.com/api/admin/plans";

export const getPlans = () => axios.get(API);

export const addPlan = (data) => axios.post(API, data);

export const updatePlan = (id, data) => axios.put(`${API}/${id}`, data);

export const deletePlan = (id) => axios.delete(`${API}/${id}`);
