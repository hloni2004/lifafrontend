import React, { useState } from "react";
import { Employee } from "../domain/Employee";
import * as employeeService from "../service/employeeService";

const TestApi: React.FC = () => {
    // State for form inputs
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [position, setPosition] = useState("");
    const [staffDiscount, setStaffDiscount] = useState(0);

    const [address, setAddress] = useState({
        propertyNumber: 0,
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

    // Create Employee Handler
    const handleCreateEmployee = async () => {
        // Validate required fields
        if (!firstName || !lastName || !userName || !password || !position || staffDiscount < 0) {
            alert("Please fill in all employee fields");
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
            const newEmployee: Employee = {
                userId: 0,
                firstName,
                lastName,
                userName,
                password,
                role: "EMPLOYEE",
                position,
                staffDiscount,
                address: { ...address, addressId: 0 },
                contact: { ...contact, contactId: 0 }
            };

            const created = await employeeService.createEmployee(newEmployee);
            console.log("Created Employee:", created);
            alert(`Employee created! ID: ${created.userId}`);
        } catch (err) {
            console.error(err);
            alert("Error creating employee, check console.");
        }
    };

    // Get All Employees Handler
    const handleGetEmployees = async () => {
        try {
            const employees: Employee[] = await employeeService.getAllEmployees();
            console.log("Employees:", employees);
            alert(`Fetched ${employees.length} employees! Check console for details.`);
        } catch (err) {
            console.error(err);
            alert("Error fetching employees, check console.");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px" }}>
            <h1>Create Employee</h1>

            {/* Employee Info */}
            <h2>Employee Information</h2>
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
                placeholder="Position"
                value={position}
                onChange={e => setPosition(e.target.value)}
            />
            <input
                placeholder="Staff Discount"
                type="number"
                value={staffDiscount}
                onChange={e => setStaffDiscount(Number(e.target.value))}
            />

            {/* Address Section */}
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

            {/* Contact Section */}
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
                <button onClick={handleCreateEmployee} style={{ marginRight: "1rem" }}>
                    Create Employee
                </button>
                <button onClick={handleGetEmployees}>Get All Employees</button>
            </div>
        </div>
    );
};

export default TestApi;
