import React from "react";

export default function CartItem({ item, handleRemove, handleBuy }) {
    // 🎨 Dynamic theme colors based on plan name
    const theme =
        item.name === "pro"
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-amber-900 text-white border-yellow-400"
            : item.name === "advance"
                ? "bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-400 text-gray-800"
                : item.name === "basic"
                    ? "bg-gradient-to-br from-sky-100 to-sky-200 border-sky-400 text-gray-800"
                    : "bg-gradient-to-br from-white to-gray-100 border-gray-300 text-gray-800";
return (
        <div className="w-full sm:w-[340px]">
            <div
                className={`border-2 rounded-xl p-5 m-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${theme}`}
            >
                {/* Header */}
                <h4 className="uppercase font-bold mb-4">{item.plan.name}</h4>

                {/* Details */}
                <ul className="text-start text-sm space-y-2 mb-5">
                    <li className="flex items-center gap-2">
                        <i className="fa-solid fa-video text-blue-500"></i>
                        Price:  £{item.plan.price}
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="fa-solid fa-video text-blue-500"></i>
                        Video Call Limit: {item.plan.video_call_limit}
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="fa-solid fa-magnifying-glass text-blue-500"></i>
                        Search Limit: {item.plan.people_search_limit}
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="fa-solid fa-message text-blue-500"></i>
                        Message Limit: {item.plan.people_message_limit}
                    </li>
                    <li className="flex items-center gap-2">
                        <i className="fa-solid fa-headphones text-blue-500"></i>
                        Audio Call Limit: {item.plan.audio_call_limit}
                    </li>
                </ul>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => handleRemove(item.id)}
                        className="flex-1 border border-red-500 text-red-500 rounded-lg py-2 font-semibold hover:bg-red-500 hover:text-white transition duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                        <i className="fa-solid fa-trash mr-2"></i> Remove
                    </button>

                    <button
                        onClick={() => handleBuy(item)}
                        className={`flex-1 rounded-lg py-2 font-semibold transition duration-300 hover:-translate-y-1 hover:shadow-md ${item.name === "pro"
                            ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                    >
                        <i className="fa-solid fa-bag-shopping mr-2"></i> Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}