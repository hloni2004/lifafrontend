import React from "react";
import { useCart } from "../context/CartContext";

const OrderPage: React.FC = () => {
    const { items, total, clearCart } = useCart();

    const handlePlaceOrder = () => {
        alert("✅ Order placed successfully!");
        clearCart();
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Your Order</h2>

            {items.length === 0 ? (
                <p>No items in your order.</p>
            ) : (
                <>
                    <ul>
                        {items.map((item) => (
                            <li key={item.id}>
                                {item.name} x {item.quantity} — R
                                {(item.price * item.quantity).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <h3>Total: R{total.toFixed(2)}</h3>
                    <button onClick={handlePlaceOrder}>Confirm Order</button>
                </>
            )}
        </div>
    );
};

export default OrderPage;
