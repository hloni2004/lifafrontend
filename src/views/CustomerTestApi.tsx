import React, { useState } from "react";
import { Customer } from "../domain/Customer";
import * as customerService from "../service/customerService";

const CustomerTestApi: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [customerDiscount, setCustomerDiscount] = useState(0);
    const [address, setAddress] = useState({
        propertyNumber: 1, // Non-zero default
        buildingName: "",
        unitNumber: 0,
        poBoxNumber: 0,
        street: "",
        municipality: "",
        province: "",
        postalCode: "",
        country: ""
    });
    const [contact, setContact] = useState({
        phoneNumber: "",
        email: ""
    });

    const handleCreateCustomer = async () => {
        if (!firstName || !lastName || !userName || !password || customerDiscount < 0) {
            alert("Please fill in all customer fields");
            return;
        }
        if (!address.street || !address.municipality || !address.province || !address.postalCode || !address.country) {
            alert("Please fill in all required address fields");
            return;
        }
        if (!contact.phoneNumber || !contact.email) {
            alert("Please fill in all contact fields");
            return;
        }

        try {
            const newCustomer: Customer = {
                userId: 0,
                firstName,
                lastName,
                userName,
                password,
                role: "CUSTOMER",
                customerDiscount,
                address: { ...address, addressId: 0 },
                contact: { ...contact, contactId: 0 }
            };

            const created = await customerService.createCustomer(newCustomer);
            console.log("Created Customer:", created);
            alert(`Customer created! ID: ${created.userId}`);
        } catch (err) {
            console.error(err);
            alert("Customer not created, please fill in all customer fields.");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px" }}>
            <h1>Create Customer</h1>
            <h2>Customer Information</h2>
            <input
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
            />
            <input
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
            />
            <input
                placeholder="Username"
                value={userName}
                onChange={e => setUserName(e.target.value)}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <input
                placeholder="Customer Discount"
                type="number"
                value={customerDiscount}
                onChange={e => setCustomerDiscount(Number(e.target.value))}
            />
            <h2>Address</h2>
            <input
                placeholder="Property Number"
                type="number"
                value={address.propertyNumber}
                onChange={e => setAddress({ ...address, propertyNumber: Number(e.target.value) })}
            />
            <input
                placeholder="Building Name"
                value={address.buildingName}
                onChange={e => setAddress({ ...address, buildingName: e.target.value })}
            />
            <input
                placeholder="Unit Number"
                type="number"
                value={address.unitNumber}
                onChange={e => setAddress({ ...address, unitNumber: Number(e.target.value) })}
            />
            <input
                placeholder="PO Box Number"
                type="number"
                value={address.poBoxNumber}
                onChange={e => setAddress({ ...address, poBoxNumber: Number(e.target.value) })}
            />
            <input
                placeholder="Street"
                value={address.street}
                onChange={e => setAddress({ ...address, street: e.target.value })}
            />
            <input
                placeholder="Municipality"
                value={address.municipality}
                onChange={e => setAddress({ ...address, municipality: e.target.value })}
            />
            <input
                placeholder="Province"
                value={address.province}
                onChange={e => setAddress({ ...address, province: e.target.value })}
            />
            <input
                placeholder="Postal Code"
                value={address.postalCode}
                onChange={e => setAddress({ ...address, postalCode: e.target.value })}
            />
            <input
                placeholder="Country"
                value={address.country}
                onChange={e => setAddress({ ...address, country: e.target.value })}
            />
            <h2>Contact</h2>
            <input
                placeholder="Phone Number"
                value={contact.phoneNumber}
                onChange={e => setContact({ ...contact, phoneNumber: e.target.value })}
            />
            <input
                placeholder="Email"
                value={contact.email}
                onChange={e => setContact({ ...contact, email: e.target.value })}
            />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleCreateCustomer}>Create Customer</button>
            </div>
        </div>
    );
};

export default CustomerTestApi;