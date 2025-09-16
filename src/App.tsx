import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import TestApi from "./views/TestApi";
import CustomerTestApi from "./views/CustomerTestApi";
import CustomerDemo from "./components/CustomerDemo";
import TShirtDesigner from "./components/TShirtDesigner";
import TShirtDesignerMain from "./components/TShirtDesignerMain";
import ScaleTestApi from "./views/ScaleTestApi";
import PositionTestApi from "./views/PositionTestApi";
import RotationTestApi from "./views/RotationTestApi";
import PlacementDataTestApi from "./views/PlacementDataTestApi";

import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import OrderPage from "./components/OrderPage";
import Profile from "./components/Profile";
import Auth from "./components/Auth";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ✅ Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main layout with cart and routes
function MainLayout() {
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();

    // Handle successful auth and redirect to /tshirt-designer
    const handleAuthSuccess = (userData: any) => {
        login(userData);
        navigate("/tshirt-designer");
    };

    return (
        <>
            {isLoggedIn && <Cart />}
            <Routes>
                {/* Auth */}
                <Route path="/login" element={<Auth onAuthSuccess={handleAuthSuccess} />} />

                {/* Designer routes */}
                <Route path="/" element={<ProtectedRoute><TShirtDesigner /></ProtectedRoute>} />
                <Route path="/tshirt-designer" element={<ProtectedRoute><TShirtDesigner /></ProtectedRoute>} />
                <Route path="/tshirt-designer-main" element={<ProtectedRoute><TShirtDesignerMain /></ProtectedRoute>} />

                {/* Order & Checkout */}
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />

                {/* Profile */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Test APIs */}
                <Route path="/test-api" element={<TestApi />} />
                <Route path="/customer-test-api" element={<CustomerTestApi />} />
                <Route path="/customer-demo" element={<CustomerDemo />} />
                <Route path="/placement-test-api" element={<PlacementDataTestApi />} />
                <Route path="/scale-test-api" element={<ScaleTestApi />} />
                <Route path="/position-test-api" element={<PositionTestApi />} />
                <Route path="/rotation-test-api" element={<RotationTestApi />} />

                {/* Fallback */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <MainLayout />
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
