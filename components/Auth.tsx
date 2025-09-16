import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import '../styles.css';

interface AuthProps {
    onAuthSuccess: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);

    const handleAuthSuccess = (user: any) => {
        onAuthSuccess(user);
    };

    return (
        <div className="auth-wrapper">
            {isLogin ? (
                <Login
                    onLoginSuccess={handleAuthSuccess}
                    onSwitchToRegister={() => setIsLogin(false)}
                />
            ) : (
                <Register
                    onRegisterSuccess={handleAuthSuccess}
                    onSwitchToLogin={() => setIsLogin(true)}
                />
            )}
        </div>
    );
};

export default Auth;
