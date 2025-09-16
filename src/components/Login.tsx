import React, { useState } from 'react';
import api from '../service/api';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // <-- fixed import

interface LoginProps {
    onLoginSuccess: (user: any) => void;
    onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const { login } = useAuth();
    const navigate = useNavigate(); // <-- useNavigate instead of useRouter

    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', formData);
            const userData = response.data;

            // Save user in context
            login(userData);

            // Notify parent component
            onLoginSuccess(userData);

            // Redirect based on role
            if (userData.role === 'ADMIN') {
                navigate('/admin'); // Admin dashboard
            } else {
                navigate('/dashboard'); // Customer dashboard
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper" style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header page="login" onButtonClick={onSwitchToRegister} />
            <div className="auth-container" style={{ margin: '0 auto', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="auth-form" style={{ maxWidth: '400px', width: '100%' }}>
                    {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="userName"
                            placeholder="Username"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                        />
                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p style={{ marginTop: '10px', textAlign: 'center' }}>
                        Don't have an account?{' '}
                        <button type="button" onClick={onSwitchToRegister} style={{ color: '#007bff', background: 'none', border: 'none' }}>
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
