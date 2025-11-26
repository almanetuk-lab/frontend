import React from "react";
import PlanCard from "./PlanCard";

export default function PlansList({ plans, planThemes, addToCart, handleBuy }) {

    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {plans.map((plan) => {
                const theme =
                    planThemes[plan.name?.toLowerCase()] || planThemes.free;

                return (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        theme={theme}
                        addToCart={addToCart}
                        handleBuy={handleBuy}
                    />
                );
            })}
        </div>
    );
}