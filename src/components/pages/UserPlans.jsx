import React, { useEffect, useState } from "react";
//import Navbar from "../../Navbar/Navbar";
// import {
//     fetchPlans,
//     addToCart as addToCartAPI,
//     buyPlan,
// } from "../../api/userPlans";
import {
  fetchPlans,
  addToCart as addToCartAPI,
  buyPlan,
} from "../services/userPlans";
//import PlansList from "../../components/userPlans/PlansList";
import PlansList from "../userPlans/PlansList";
import { useNavigate } from "react-router-dom";

export default function UserPlans() {
  const [plans, setPlans] = useState([]);
  const [config, setConfig] = useState({});
  const navigate = useNavigate();

  // 🎨 Tailwind-friendly theme object
const planThemes = { /* your same theme object */ };

  useEffect(() => {
    const loadPlans = async () => {
      try {
        let plans = await fetchPlans();
        console.log(plans);
        setPlans(plans);
        // setConfig(config);
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };
    loadPlans();
  }, []);

  const addToCart = async (plan) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = existingCart.find((item) => item.id === plan.id);

      if (!existingItem) {
        const cartItem = { id: plan.id, name: plan.name, plan, price: plan.price };
        existingCart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("cartUpdated"));
      }

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
        config={config} // ✅ pass config
        planThemes={planThemes}
        addToCart={addToCart}
        handleBuy={handleBuy}
      />
    </div>
  );
}
