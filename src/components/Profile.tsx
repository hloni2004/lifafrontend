import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateCustomer } from '../service/customerService';
import { Upload, Save, AlertCircle, User } from 'lucide-react';
import Header from './Header';
import { Customer } from '../domain/Customer';

const Profile: React.FC = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Customer>({
        userId: 0,
        firstName: '',
        lastName: '',
        userName: '',
        customerDiscount: 0,
        role: 'customer',
        password: '',
        contact: {
            contactId: undefined,
            email: '',
            phoneNumber: ''
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
    const [notification, setNotification] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                userId: user.userId || 0,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                userName: user.userName || '',
                customerDiscount: user.customerDiscount || 0,
                role: user.role || 'customer',
                password: '', // Not populated for security
                contact: {
                    contactId: user.contact?.contactId || undefined,
                    email: user.contact?.email || '',
                    phoneNumber: user.contact?.phoneNumber || ''
                },
                address: {
                    buildingName: user.address?.buildingName || '',
                    unitNumber: user.address?.unitNumber || 0,
                    propertyNumber: user.address?.propertyNumber || 0,
                    poBoxNumber: user.address?.poBoxNumber || 0,
                    street: user.address?.street || '',
                    municipality: user.address?.municipality || '',
                    province: user.address?.province || '',
                    postalCode: user.address?.postalCode || '',
                    country: user.address?.country || ''
                }
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            if (parent === 'contact' || parent === 'address') {
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: type === 'number' ? parseInt(value) || 0 : value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? parseInt(value) || 0 : value
            }));
        }
    };

    const triggerFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification('');

        try {
            const customerData: Customer = {
                userId: formData.userId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                userName: formData.userName,
                customerDiscount: formData.customerDiscount,
                role: formData.role,
                password: user.password || '', // Use existing password
                contact: formData.contact,
                address: formData.address
            };

            const updatedCustomer = await updateCustomer(customerData);
            setUser({
                ...user,
                ...updatedCustomer,
                token: user.token // Preserve token
            });

            showNotification('Profile updated successfully!');
        } catch (error: any) {
            showNotification(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <Header page="profile" onButtonClick={() => navigate('/tshirt-designer')} />
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'linear-gradient(to right, #2563eb, #9333ea)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: '500'
                }}>
                    <AlertCircle style={{ height: '1.25rem', width: '1.25rem' }} />
                    <span>{notification}</span>
                </div>
            )}

            <main style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '2.5rem 1rem'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '2rem',
                    border: '1px solid #f3f4f6'
                }}>
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(to right, #111827, #1e40af, #7c3aed)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '1.5rem'
                        }}>
                            Edit Profile
                        </h2>
                        <div style={{
                            marginBottom: '1.5rem',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid #d1d5db',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: '#e5e7eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <User style={{ height: '3rem', width: '3rem', color: '#6b7280' }} />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={triggerFileUpload}
                            disabled={loading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                background: 'linear-gradient(to right, #2563eb, #9333ea)',
                                color: 'white',
                                borderRadius: '0.75rem',
                                border: 'none',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            <Upload style={{ height: '1.25rem', width: '1.25rem' }} />
                            Upload Profile Picture
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                                Personal Information
                            </h3>
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="customerDiscount">Customer Discount (%):</label>
                                    <input
                                        type="number"
                                        id="customerDiscount"
                                        name="customerDiscount"
                                        value={formData.customerDiscount}
                                        onChange={handleChange}
                                        required
                                        readOnly
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827',
                                            backgroundColor: '#f3f4f6'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                                Contact
                            </h3>
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact.phoneNumber">Phone Number:</label>
                                    <input
                                        type="tel"
                                        id="contact.phoneNumber"
                                        name="contact.phoneNumber"
                                        value={formData.contact.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                                Residential Address
                            </h3>
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem',
                                            color: '#111827'
                                        }}
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / 3' }}>
                                    <label>&nbsp;</label>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '1rem',
                                            background: 'linear-gradient(to right, #2563eb, #9333ea)',
                                            color: 'white',
                                            borderRadius: '0.75rem',
                                            border: 'none',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            opacity: loading ? 0.5 : 1
                                        }}
                                    >
                                        <Save style={{ height: '1.25rem', width: '1.25rem' }} />
                                        {loading ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Profile;