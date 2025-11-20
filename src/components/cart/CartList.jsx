import React from "react";
import CartItem from "./CartItem";

export default function CartList({ cartItems, handleRemove, handleBuy }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {cartItems.map((item) => (
                <CartItem
                    key={item.id}
                    item={item}
                    handleRemove={handleRemove}
                    handleBuy={handleBuy}
                />
            ))}
        </div>
    );
}
