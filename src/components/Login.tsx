import React, { useState } from 'react';
import api from '../service/api';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
    onLoginSuccess: (user: any) => void;
    onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const { login } = useAuth();

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

            // Let parent component handle navigation
            onLoginSuccess(userData);
            
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
                <div className="auth-form" style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Login</h2>
                    {error && <div style={{ color: 'red', marginBottom: '10px', padding: '0.5rem', backgroundColor: '#fee', borderRadius: '4px', border: '1px solid #fcc' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                name="userName"
                                placeholder="Username"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '4px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '4px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem',
                                backgroundColor: loading ? '#ccc' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
                        Don't have an account?{' '}
                        <button 
                            type="button" 
                            onClick={onSwitchToRegister} 
                            style={{ 
                                color: '#007bff', 
                                background: 'none', 
                                border: 'none',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                            Register here
                        </button>
                    </p>
                    
                    {/* Demo credentials info */}
                    <div style={{ 
                        marginTop: '1.5rem', 
                        padding: '1rem', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                    }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#333' }}>Demo Credentials:</p>
                        <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Admin: <code>superadmin / supersecretpassword</code></p>
                        <p style={{ margin: '0', color: '#666' }}>Customer: Register a new account</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;