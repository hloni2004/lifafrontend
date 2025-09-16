import React, { useState, useEffect } from 'react';
import { Customer } from '../domain/Customer';
import * as adminService from '../service/adminService';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const { user, logout } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        customerDiscount: 0,
        address: {
            propertyNumber: 0,
            buildingName: '',
            unitNumber: 0,
            poBoxNumber: 0,
            street: '',
            municipality: '',
            province: '',
            postalCode: '',
            country: 'South Africa'
        },
        contact: {
            phoneNumber: '',
            email: ''
        }
    });

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchAllCustomers();
        }
    }, [user]);

    const fetchAllCustomers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllCustomersAsAdmin();
            setCustomers(data);
            setMessage(`Loaded ${data.length} students successfully`);
        } catch (error) {
            setMessage('Error fetching students');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerById = async (id: number) => {
        setLoading(true);
        try {
            const customer = await adminService.getCustomerByIdAsAdmin(id);
            setSelectedCustomer(customer);
            setMessage(`Fetched student: ${customer.firstName} ${customer.lastName}`);
        } catch (error) {
            setMessage(`Error fetching student with ID ${id}`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCustomer = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;

        setLoading(true);
        try {
            await adminService.deleteCustomerAsAdmin(id);
            setMessage(`Student with ID ${id} deleted successfully`);
            fetchAllCustomers();
        } catch (error) {
            setMessage(`Error deleting student with ID ${id}`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) {
            setMessage('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const customerData: Customer = {
                userId: editingCustomer?.userId || 0,
                firstName: formData.firstName,
                lastName: formData.lastName,
                userName: formData.userName,
                password: formData.password,
                role: 'CUSTOMER',
                customerDiscount: formData.customerDiscount,
                address: { ...formData.address, addressId: editingCustomer?.address?.addressId || 0 },
                contact: { ...formData.contact, contactId: editingCustomer?.contact?.contactId || 0 }
            };

            if (editingCustomer) {
                const updated = await adminService.updateCustomerAsAdmin(customerData);
                setMessage(`Student ${updated.firstName} ${updated.lastName} updated successfully`);
            } else {
                const created = await adminService.createCustomerAsAdmin(customerData);
                setMessage(`Student ${created.firstName} ${created.lastName} created successfully`);
            }

            resetForm();
            fetchAllCustomers();
        } catch (error) {
            setMessage('Error saving student');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        return formData.firstName && formData.lastName && formData.userName &&
               (editingCustomer || formData.password) && formData.contact.email &&
               formData.contact.phoneNumber && formData.address.street &&
               formData.address.municipality && formData.address.province &&
               formData.address.postalCode && formData.address.country;
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            userName: '',
            password: '',
            customerDiscount: 0,
            address: {
                propertyNumber: 0,
                buildingName: '',
                unitNumber: 0,
                poBoxNumber: 0,
                street: '',
                municipality: '',
                province: '',
                postalCode: '',
                country: 'South Africa'
            },
            contact: {
                phoneNumber: '',
                email: ''
            }
        });
        setEditingCustomer(null);
        setShowForm(false);
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            firstName: customer.firstName,
            lastName: customer.lastName,
            userName: customer.userName,
            password: '', // Don't populate password for security
            customerDiscount: customer.customerDiscount,
            address: { ...customer.address },
            contact: { ...customer.contact }
        });
        setShowForm(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchAllCustomers();
            return;
        }

        setLoading(true);
        try {
            const results = await adminService.searchCustomersByName(searchTerm);
            setCustomers(results);
            setMessage(`Found ${results.length} students matching "${searchTerm}"`);
        } catch (error) {
            setMessage('Error searching students');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (user?.role !== 'ADMIN') {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Access Denied</h1>
                <p>You must be an administrator to access this page.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ 
                padding: '20px', 
                backgroundColor: '#f8f9fa', 
                marginBottom: '20px', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ margin: 0, color: '#333' }}>Admin Dashboard - Student Management</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>Welcome, {user?.firstName} {user?.lastName}</p>
                </div>
                <button
                    onClick={logout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>

            {loading && <p style={{ color: 'blue', textAlign: 'center' }}>Loading...</p>}
            {message && <p style={{ 
                color: message.includes('Error') ? 'red' : 'green', 
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: message.includes('Error') ? '#fff5f5' : '#f0fff4',
                border: `1px solid ${message.includes('Error') ? '#fed7d7' : '#c6f6d5'}`,
                borderRadius: '4px'
            }}>{message}</p>}

            {/* Action Buttons */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                    onClick={() => setShowForm(true)}
                    style={{ 
                        padding: '10px 15px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Add New Student
                </button>
                <button 
                    onClick={fetchAllCustomers}
                    style={{ 
                        padding: '10px 15px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Refresh Students
                </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Search by name, username, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                />
                <button 
                    onClick={handleSearch}
                    style={{ 
                        padding: '10px 15px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Search
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Students List */}
                <div style={{ flex: 2 }}>
                    <h2>All Students ({filteredCustomers.length})</h2>
                    <div style={{ 
                        maxHeight: '600px', 
                        overflowY: 'auto', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px'
                    }}>
                        {filteredCustomers.map((customer) => (
                            <div key={customer.userId} style={{
                                border: '1px solid #eee',
                                padding: '15px',
                                margin: '5px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '4px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 5px 0' }}>
                                            {customer.firstName} {customer.lastName}
                                        </h3>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                                            <strong>Username:</strong> {customer.userName} | <strong>ID:</strong> {customer.userId}
                                        </p>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                                            <strong>Email:</strong> {customer.contact.email}
                                        </p>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                                            <strong>Phone:</strong> {customer.contact.phoneNumber}
                                        </p>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                                            <strong>Location:</strong> {customer.address.municipality}, {customer.address.province}
                                        </p>
                                        <span style={{ 
                                            backgroundColor: '#d4edda',
                                            color: '#155724',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            fontSize: '12px'
                                        }}>
                                            {customer.customerDiscount}% discount
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <button
                                            onClick={() => fetchCustomerById(customer.userId)}
                                            style={{ 
                                                fontSize: '12px',
                                                padding: '5px 8px',
                                                backgroundColor: '#17a2b8',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleEdit(customer)}
                                            style={{ 
                                                fontSize: '12px',
                                                padding: '5px 8px',
                                                backgroundColor: '#ffc107',
                                                color: '#212529',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCustomer(customer.userId)}
                                            style={{ 
                                                fontSize: '12px',
                                                padding: '5px 8px',
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredCustomers.length === 0 && (
                            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                No students found
                            </p>
                        )}
                    </div>
                </div>

                {/* Selected Student Details */}
                <div style={{ flex: 1 }}>
                    <h2>Student Details</h2>
                    {selectedCustomer ? (
                        <div style={{ 
                            border: '1px solid #ddd', 
                            padding: '15px', 
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px'
                        }}>
                            <h3>{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                            <p><strong>ID:</strong> {selectedCustomer.userId}</p>
                            <p><strong>Username:</strong> {selectedCustomer.userName}</p>
                            <p><strong>Role:</strong> {selectedCustomer.role}</p>
                            <p><strong>Discount:</strong> {selectedCustomer.customerDiscount}%</p>

                            <h4>Address:</h4>
                            <p>{selectedCustomer.address.propertyNumber} {selectedCustomer.address.street}</p>
                            <p>{selectedCustomer.address.municipality}, {selectedCustomer.address.province}</p>
                            <p>{selectedCustomer.address.postalCode}, {selectedCustomer.address.country}</p>

                            <h4>Contact:</h4>
                            <p><strong>Phone:</strong> {selectedCustomer.contact.phoneNumber}</p>
                            <p><strong>Email:</strong> {selectedCustomer.contact.email}</p>
                        </div>
                    ) : (
                        <p style={{ 
                            border: '1px solid #ddd', 
                            padding: '15px', 
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px',
                            color: '#666'
                        }}>
                            Click "View Details" on any student to see their information here
                        </p>
                    )}
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3>{editingCustomer ? 'Edit Student' : 'Add New Student'}</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                            <div>
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                            <div>
                                <label>Username *</label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Discount (%)</label>
                                <input
                                    type="number"
                                    name="customerDiscount"
                                    value={formData.customerDiscount}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="100"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        </div>

                        {!editingCustomer && (
                            <div style={{ marginBottom: '15px' }}>
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        )}

                        <h4>Contact Information</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                            <div>
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="contact.email"
                                    value={formData.contact.email}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="contact.phoneNumber"
                                    value={formData.contact.phoneNumber}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        </div>

                        <h4>Address Information</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                            <div>
                                <label>Street *</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Municipality *</label>
                                <input
                                    type="text"
                                    name="address.municipality"
                                    value={formData.address.municipality}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                            <div>
                                <label>Province *</label>
                                <input
                                    type="text"
                                    name="address.province"
                                    value={formData.address.province}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Postal Code *</label>
                                <input
                                    type="text"
                                    name="address.postalCode"
                                    value={formData.address.postalCode}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={resetForm}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFormSubmit}
                                disabled={loading}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1
                                }}
                            >
                                {loading ? 'Saving...' : (editingCustomer ? 'Update Student' : 'Add Student')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;