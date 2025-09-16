import React, { useState, useEffect } from "react";
import { Shirt } from "lucide-react";
import { useCart } from "../context/CartContext";
import Auth from "./Auth";

// Placeholder components (replace with real ones if you already have them)
const TShirtUpload: React.FC<{ onContinue: () => void }> = ({ onContinue }) => (
    <div style={{ padding: "20px" }}>
        <h3>Upload your design</h3>
        <input type="file" />
        <button onClick={onContinue}>Continue</button>
    </div>
);

const TShirtPositioning: React.FC<{
    tshirtData: any;
    onSave: () => void;
    onBack: () => void;
    user: any;
}> = ({ onSave, onBack, user }) => (
    <div style={{ padding: "20px" }}>
        <h3>Position your design</h3>
        <p>Preview for {user?.firstName} {user?.lastName}</p>
        <button onClick={onBack}>Back</button>
        <button onClick={onSave}>Save Design</button>
    </div>
);

const TShirtDesignerMain: React.FC = () => {
    const { addToCart } = useCart();

    const BASE_PRICE = 150;

    const [tshirtName, setTshirtName] = useState("Custom T-Shirt");
    const [quantity, setQuantity] = useState(1);

    const [currentStep, setCurrentStep] = useState<"upload" | "position">("upload");
    const [tshirtData, setTshirtData] = useState<any>(null);
    const [user, setUser] = useState<any>({ firstName: "John", lastName: "Doe" });

    const handleAddToCart = () => {
        addToCart({
            id: Date.now(),
            name: tshirtName,
            price: BASE_PRICE,
            quantity,
        });
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentStep("upload");
    };

    const handleContinueToPositioning = () => {
        setCurrentStep("position");
    };

    const handleBackToUpload = () => {
        setCurrentStep("upload");
    };

    const handleSaveDesign = () => {
        alert("Design saved!");
        handleAddToCart();
    };

    return (
        <div>
            {/* ✅ Header */}
            <header
                style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    borderBottom: "1px solid #f3f4f6",
                    position: "sticky",
                    top: 0,
                    zIndex: 40,
                }}
            >
                <div
                    style={{
                        maxWidth: "1280px",
                        margin: "0 auto",
                        padding: "0 1rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "72px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                            style={{
                                background: "linear-gradient(135deg, #2563eb, #9333ea)",
                                padding: "0.5rem",
                                borderRadius: "0.75rem",
                            }}
                        >
                            <Shirt style={{ height: "2rem", width: "2rem", color: "white" }} />
                        </div>
                        <span
                            style={{
                                fontSize: "1.875rem",
                                fontWeight: "bold",
                                background: "linear-gradient(to right, #2563eb, #9333ea)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            {currentStep === "upload" ? "Design Your T-Shirt" : "Position Your Design"}
                        </span>
                    </div>

                    {user && (
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ fontSize: "1rem", color: "#6b7280" }}>
                                Welcome, {user.firstName} {user.lastName}!
                            </span>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: "linear-gradient(to right, #dc2626, #b91c1c)",
                                    color: "white",
                                    padding: "0.5rem 1.5rem",
                                    borderRadius: "0.75rem",
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    transition: "all 0.2s",
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* ✅ Main content */}
            <main style={{ padding: "20px" }}>
                {currentStep === "upload" ? (
                    <>
                        <TShirtUpload onContinue={handleContinueToPositioning} />

                        <div style={{ marginTop: "20px" }}>
                            <label>Design Name: </label>
                            <input
                                type="text"
                                value={tshirtName}
                                onChange={(e) => setTshirtName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Quantity: </label>
                            <input
                                type="number"
                                value={quantity}
                                min={1}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                        </div>

                        <p>
                            Price per shirt:{" "}
                            <span style={{ fontWeight: "bold", color: "#2563eb" }}>
                                R{BASE_PRICE}
                            </span>
                        </p>

                        <p>
                            Total:{" "}
                            <span style={{ fontWeight: "bold", color: "#2563eb" }}>
                                R{BASE_PRICE * quantity}
                            </span>
                        </p>

                        <button onClick={handleAddToCart}>Add to Cart</button>
                    </>
                ) : (
                    <TShirtPositioning
                        tshirtData={tshirtData}
                        onSave={handleSaveDesign}
                        onBack={handleBackToUpload}
                        user={user}
                    />
                )}
            </main>
        </div>
    );
};

export default TShirtDesignerMain;
