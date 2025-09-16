
import React, { useState, useEffect } from 'react';
import { Customer } from '../domain/Customer';
import * as customerService from '../service/customerService';
import Auth from './Auth';

const CustomerDemo: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState<any>(null);

    // Check for existing user session on component mount
    useEffect(() => {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Load all customers when user is authenticated
    useEffect(() => {
        if (user) {
            fetchAllCustomers();
        }
    }, [user]);

    const handleAuthSuccess = (userData: any) => {
        setUser(userData);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        sessionStorage.removeItem('currentUser');
        setCustomers([]);
        setSelectedCustomer(null);
        setMessage('');
    };

    // If user is not authenticated, show Auth component
    if (!user) {
        return <Auth onAuthSuccess={handleAuthSuccess} />;
    }

    // GET all customers
    const fetchAllCustomers = async () => {
        setLoading(true);
        try {
            const data = await customerService.getAllCustomers();
            setCustomers(data);
            setMessage(`Fetched ${data.length} customers successfully`);
        } catch (error) {
            setMessage('Error fetching customers');
            console.error(error);
        }
        setLoading(false);
    };

    // GET customer by ID
    const fetchCustomerById = async (id: number) => {
        setLoading(true);
        try {
            const customer = await customerService.getCustomerById(id);
            setSelectedCustomer(customer);
            setMessage(`Fetched customer: ${customer.firstName} ${customer.lastName}`);
        } catch (error) {
            setMessage(`Error fetching customer with ID ${id}`);
            console.error(error);
        }
        setLoading(false);
    };

    // DELETE customer
    const deleteCustomer = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;

        setLoading(true);
        try {
            await customerService.deleteCustomer(id);
            setMessage(`Customer with ID ${id} deleted successfully`);
            fetchAllCustomers(); // Refresh the list
        } catch (error) {
            setMessage(`Error deleting customer with ID ${id}`);
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* User info and logout */}
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '20px', borderRadius: '5px' }}>
                <span>Welcome, {user.firstName} {user.lastName}!</span>
                <button
                    onClick={handleLogout}
                    style={{
                        marginLeft: '20px',
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>

            <h1>Customer REST API Demo</h1>

            {loading && <p style={{ color: 'blue' }}>Loading...</p>}
            {message && <p style={{ color: 'green', marginBottom: '20px' }}>{message}</p>}

            <div style={{ marginBottom: '20px' }}>
                <button onClick={fetchAllCustomers} style={{ marginRight: '10px' }}>
                    Refresh All Customers (GET /api/customers)
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Customer List */}
                <div style={{ flex: 1 }}>
                    <h2>All Customers ({customers.length})</h2>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                        {customers.map((customer) => (
                            <div key={customer.userId} style={{
                                border: '1px solid #eee',
                                padding: '10px',
                                margin: '5px 0',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <strong>{customer.firstName} {customer.lastName}</strong>
                                <br />
                                <small>Username: {customer.userName} | ID: {customer.userId}</small>
                                <br />
                                <div style={{ marginTop: '5px' }}>
                                    <button
                                        onClick={() => fetchCustomerById(customer.userId)}
                                        style={{ marginRight: '5px', fontSize: '12px' }}
                                    >
                                        View Details (GET /{customer.userId})
                                    </button>
                                    <button
                                        onClick={() => deleteCustomer(customer.userId)}
                                        style={{ fontSize: '12px', backgroundColor: '#ff4444', color: 'white' }}
                                    >
                                        Delete (DELETE /{customer.userId})
                                    </button>
                                </div>
                            </div>
                        ))}
                        {customers.length === 0 && <p>No customers found</p>}
                    </div>
                </div>

                {/* Selected Customer Details */}
                <div style={{ flex: 1 }}>
                    <h2>Customer Details</h2>
                    {selectedCustomer ? (
                        <div style={{ border: '1px solid #ccc', padding: '15px', backgroundColor: '#f5f5f5' }}>
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
                        <p>Click "View Details" on any customer to see their information here</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDemo;
