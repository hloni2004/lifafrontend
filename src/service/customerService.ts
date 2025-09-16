import api from "./api";
import { Customer } from "../domain/Customer";

const CUSTOMER_URL = "/api/customer";

// GET all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
    const response = await api.get(CUSTOMER_URL);
    return response.data;
};

// GET customer by ID
export const getCustomerById = async (id: number): Promise<Customer> => {
    const response = await api.get(`${CUSTOMER_URL}/${id}`);
    return response.data;
};

// POST create customer
export const createCustomer = async (customer: Customer): Promise<Customer> => {
    const response = await api.post(CUSTOMER_URL, customer);
    return response.data;
};

// PUT update customer
export const updateCustomer = async (customer: Customer): Promise<Customer> => {
    const response = await api.put(CUSTOMER_URL, customer);
    return response.data;
};

// DELETE customer
export const deleteCustomer = async (id: number): Promise<void> => {
    await api.delete(`${CUSTOMER_URL}/${id}`);
};
