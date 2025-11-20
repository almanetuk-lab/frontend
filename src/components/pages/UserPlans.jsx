import React, { useEffect, useState } from "react";
//import Navbar from "../../Navbar/Navbar";
// import {
//     fetchPlans,
//     addToCart as addToCartAPI,
//     buyPlan,
// } from "../../api/userPlans";
import { fetchPlans,addToCart as addToCartAPI,buyPlan} from "../services/userPlans";
//import PlansList from "../../components/userPlans/PlansList";
import PlansList from "../userPlans/PlansList";
import { useNavigate } from "react-router-dom";

export default function UserPlans() {
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    // 🎨 Tailwind-friendly theme object
    const planThemes = {
        free: {
            bg: "from-white to-gray-100",
            text: "text-gray-800",
            border: "border-gray-300",
            selectBtn:
                "bg-transparent border border-gray-700 text-gray-800 hover:bg-gray-100",
            cartBtn: "bg-gray-700 text-white hover:bg-gray-800",
        },
        basic: {
            bg: "from-sky-100 to-sky-200",
            text: "text-gray-800",
            border: "border-sky-400",
            selectBtn:
                "bg-sky-400 text-gray-800 hover:bg-sky-500 transition duration-300",
            cartBtn:
                "border border-sky-400 text-sky-600 hover:bg-sky-100 transition duration-300",
        },
        advance: {
            bg: "from-yellow-200 to-yellow-400",
            text: "text-gray-800",
            border: "border-yellow-400",
            selectBtn:
                "bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition duration-300",
            cartBtn:
                "border border-yellow-400 text-gray-900 hover:bg-yellow-100 transition duration-300",
        },
        pro: {
            bg: "from-gray-900 via-purple-900 to-amber-900",
            text: "text-white",
            border: "border-yellow-400 border-2",
            selectBtn:
                "bg-white text-gray-900 hover:bg-gray-200 transition duration-300",
            cartBtn:
                "border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 transition duration-300",
        },
    };

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const data = await fetchPlans();
                setPlans(data);
            } catch (err) {
                console.error("Error fetching plans:", err);
            }
        };
        loadPlans();
    }, []);

    const addToCart = async (plan) => {
        try {
            await addToCartAPI(plan.id, 1);
            alert("Plan added to cart!");
        } catch (err) {
            console.log("Error adding to cart:", err.message);
        }
    };

    const handleBuy = async (plan) => {
        console.log("Buying plan:", plan);
        alert("Plan details are loading");
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h2 className="text-center font-bold text-3xl mb-8">
                ✨ Subscription Plans ✨
            </h2>

            <PlansList
                plans={plans}
                planThemes={planThemes}
                addToCart={addToCart}
                handleBuy={handleBuy}
            />
        </div>
    );
}
