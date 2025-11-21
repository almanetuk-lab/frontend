import axios from "axios";

const BASE_URL = "https://backend-q0wc.onrender.com/api";
let user_id = 1; //Comes from user table.

export const fetchPlans = async () => {
    const res = await axios.get(`${BASE_URL}/plans`);
    return res.data;
};

export const addToCart = async (planId, userId) => {
    const res = await axios.post(`${BASE_URL}/cart`, {
        plan_id: planId,
        user_id: userId,
    });
    return res.data;
};

export const buyPlan = async (planId) => {
    const res = await axios.put(`${BASE_URL}/cart/buy/${planId}`);
    return res.data;
};
