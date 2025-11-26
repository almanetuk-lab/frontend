import React, { useEffect, useState } from "react";
//import Navbar from "../../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
// import {
//     fetchCartItems,
//     removeFromCart,
// } from "../../api/cart";

import { fetchCartItems, removeFromCart } from "../services/cart.js";
//import CartList from "../../components/cart/CartList.jsx";
import CartList from "../cart/CartList.jsx";
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const userId = 1; // static for demo

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await fetchCartItems(userId);
      setCartItems(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleRemove = async (id) => {
  try {
    // ✅ YEH 4 LINES ADD KARO - LocalStorage update ke liye (API se PEHLE)
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = existingCart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // ✅ Cart count update ke liye
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cartUpdated"));

    // ✅ YEH LINE PEHLE SE HAI - State update
    setCartItems(cartItems.filter((item) => item.id !== id));

    // ✅ YEH LINE PEHLE SE HAI - API call
    await removeFromCart(id);

  } catch (err) {
    console.error("Error removing item:", err);
  }
};




    // const handleRemove = async (id) => {
    //   try {
    //     await removeFromCart(id);
    //     const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    //     const updatedCart = existingCart.filter((item) => item.id !== id);
    //     localStorage.setItem("cart", JSON.stringify(updatedCart));

    //     window.dispatchEvent(new Event("storage"));
    //     window.dispatchEvent(new Event("cartUpdated"));

    //     setCartItems(cartItems.filter((item) => item.id !== id));
    //   } catch (err) {
    //     console.error("Error removing item:", err);
    //   }
    // };

  const handleBuy = async (item) => {
    console.log("Buying plan:", item);
    alert("Plan details are loading");
  };

  return (
    <div className="max-w-5xl mx-auto my-12 px-4">
      <h2 className="text-center font-bold text-3xl mb-8 flex items-center justify-center gap-2">
        <i className="fa-solid fa-cart-shopping text-blue-600"></i>
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center mt-10">
          <h5 className="text-gray-600 text-lg">Your cart is empty 😕</h5>
        </div>
      ) : (
        <CartList
          cartItems={cartItems}
          handleRemove={handleRemove}
          handleBuy={handleBuy}
        />
      )}
    </div>
  );
}
