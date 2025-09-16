import React, { useState } from "react";
import { useCart, CartItem } from "../context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export const Cart: React.FC = () => {
    const { cart, removeFromCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    const total = cart.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
    );

    return (
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}>
            {/* Cart Icon */}
            <button onClick={() => setIsOpen(!isOpen)}>
                <ShoppingCart size={24} />
                {cart.length > 0 && <span>{cart.length}</span>}
            </button>

            {/* Cart Dropdown */}
            {isOpen && (
                <div>
                    {cart.length === 0 ? (
                        <p>No items yet.</p>
                    ) : (
                        <>
                            {cart.map((item: CartItem) => (
                                <div key={item.id}>
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                                    <span>R{(item.price * item.quantity).toFixed(2)}</span>
                                    <button onClick={() => removeFromCart(item.id)}>❌</button>
                                </div>
                            ))}
                            <p>Total: R{total.toFixed(2)}</p>
                            <Link to="/checkout">
                                <button>Checkout</button>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
