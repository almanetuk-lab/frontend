import React from "react";

export default function PlanCard({ plan, theme, addToCart, handleBuy }) {
    return (
        <div className="w-full sm:w-[320px]">
            <div
                className={`rounded-xl p-6 shadow border ${theme.text} ${theme.border} bg-gradient-to-br ${theme.bg} transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg`}
            >
                {/* Plan Header */}
                <h3 className="font-bold uppercase text-center mb-4 flex justify-center items-center gap-2">
                    <span>{plan.name}</span>
                    <span className="text-blue-600 font-semibold text-lg">
                        £{plan.price}
                    </span>
                </h3>

                {/* Plan Details */}
                <ul className="text-start mb-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                        <i className="fa-solid fa-video text-blue-500"></i>
                        Video Call Limit: {plan.video_call_limit}
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="fa-solid fa-magnifying-glass text-blue-500"></i>
                        Search Limit: {plan.people_search_limit}
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="fa-solid fa-message text-blue-500"></i>
                        Message Limit: {plan.people_message_limit}
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="fa-solid fa-headset text-blue-500"></i>
                        Audio Call Limit: {plan.audio_call_limit}
                    </li>
                   
                </ul>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => addToCart(plan)}
                        className={`py-2 rounded-lg font-medium transition-transform duration-300 hover:-translate-y-1 hover:shadow-md ${theme.cartBtn}`}
                    >
                        <i className="fa-solid fa-cart-shopping mr-2"></i> Add to Cart
                    </button>

                    <button
                        onClick={() => handleBuy(plan)}
                        className={`py-2 rounded-lg font-medium transition-transform duration-300 hover:-translate-y-1 hover:shadow-md ${theme.selectBtn}`}
                    >
                        Select
                    </button>
                </div>
            </div>
        </div>
    );
}
