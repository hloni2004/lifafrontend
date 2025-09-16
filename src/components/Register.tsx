import React, { useState } from 'react';
import api from '../service/api';
import Header from './Header';

interface RegisterProps {
    onRegisterSuccess: (user: any) => void;
    onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        contact: {
            email: '',
            phone: ''
        },
        address: {
            buildingName: '',
            unitNumber: 0,
            propertyNumber: 0,
            poBoxNumber: 0,
            street: '',
            municipality: '',
            province: '',
            postalCode: '',
            country: ''
        }
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent as keyof typeof formData] as any,
                    [child]: type === 'number' ? parseInt(value) || 0 : value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'number' ? parseInt(value) || 0 : value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', formData);
            onRegisterSuccess(response.data);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper" style={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column' }}>
            <Header page="register" onButtonClick={onSwitchToLogin} />
            <div className="auth-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1rem', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="auth-form" style={{ width: '100%', maxWidth: '800px' }}>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Personal Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name:</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name:</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="userName">Username:</label>
                                    <input
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Contact</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="contact.email">Email:</label>
                                    <input
                                        type="email"
                                        id="contact.email"
                                        name="contact.email"
                                        value={formData.contact.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact.phone">Phone:</label>
                                    <input
                                        type="tel"
                                        id="contact.phone"
                                        name="contact.phone"
                                        value={formData.contact.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Residential Address</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="address.buildingName">Building Name:</label>
                                    <input
                                        type="text"
                                        id="address.buildingName"
                                        name="address.buildingName"
                                        value={formData.address.buildingName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address.unitNumber">Unit Number:</label>
                                    <input
                                        type="number"
                                        id="address.unitNumber"
                                        name="address.unitNumber"
                                        value={formData.address.unitNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address.propertyNumber">Property Number:</label>
                                    <input
                                        type="number"
                                        id="address.propertyNumber"
                                        name="address.propertyNumber"
                                        value={formData.address.propertyNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address.poBoxNumber">PO Box Number:</label>
                                    <input
                                        type="number"
                                        id="address.poBoxNumber"
                                        name="address.poBoxNumber"
                                        value={formData.address.poBoxNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address.street">Street:</label>
                                    <input
                                        type="text"
                                        id="address.street"
                                        name="address.street"
                                        value={formData.address.street}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address.municipality">Municipality:</label>
                                    <input
                                        type="text"
                                        id="address.municipality"
                                        name="address.municipality"
                                        value={formData.address.municipality}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address.province">Province:</label>
                                    <input
                                        type="text"
                                        id="address.province"
                                        name="address.province"
                                        value={formData.address.province}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address.postalCode">Postal Code:</label>
                                    <input
                                        type="text"
                                        id="address.postalCode"
                                        name="address.postalCode"
                                        value={formData.address.postalCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address.country">Country:</label>
                                    <input
                                        type="text"
                                        id="address.country"
                                        name="address.country"
                                        value={formData.address.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / 3' }}>
                                    <label>&nbsp;</label>
                                    <button type="submit" disabled={loading}>
                                        {loading ? 'Registering...' : 'Register'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <p>
                        Already have an account?{' '}
                        <button type="button" className="link-button" onClick={onSwitchToLogin}>
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;