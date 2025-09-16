import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shirt, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    page: 'login' | 'register' | 'profile' | 'designer';
    onButtonClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ page, onButtonClick }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const getPageTitle = () => {
        switch (page) {
            case 'login':
                return 'Login';
            case 'register':
                return 'Register';
            case 'profile':
                return 'User Profile';
            case 'designer':
                return 'T-Shirt Designer';
            default:
                return 'TeeDesign Pro';
        }
    };

    return (
        <header style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid #f3f4f6',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            width: '100%',
            padding: '0 1rem'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '72px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #2563eb, #9333ea)',
                        padding: '0.5rem',
                        borderRadius: '0.75rem'
                    }}>
                        <Shirt style={{ height: '2rem', width: '2rem', color: 'white' }} />
                    </div>
                    <span style={{
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(to right, #2563eb, #9333ea)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        TeeDesign Pro
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user && (
                        <span style={{
                            fontSize: '1.875rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(to right, #2563eb, #9333ea)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Welcome, {user.firstName} {user.lastName}!
                        </span>
                    )}
                    {page === 'designer' && (
                        <>
                            <button
                                onClick={() => navigate('/profile')}
                                style={{
                                    background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
                                    color: 'white',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '0.75rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <User style={{ height: '1.25rem', width: '1.25rem' }} />
                                Profile
                            </button>
                            <button
                                onClick={onButtonClick}
                                style={{
                                    background: 'linear-gradient(to right, #1e90ff, #0000ff)',
                                    color: 'white',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '0.75rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <LogOut style={{ height: '1.25rem', width: '1.25rem' }} />
                                Logout
                            </button>
                        </>
                    )}
                    {(page === 'login' || page === 'register') && (
                        <button
                            onClick={() => navigate(page === 'login' ? '/register' : '/login')}
                            style={{
                                background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
                                color: 'white',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {page === 'login' ? 'Register' : 'Login'}
                        </button>
                    )}
                    {page === 'profile' && (
                        <button
                            onClick={() => navigate('/tshirt-designer')}
                            style={{
                                background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
                                color: 'white',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            Back to Designer
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;