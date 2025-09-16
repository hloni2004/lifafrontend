import api from "./api";
import { Customer } from "../domain/Customer";

const ADMIN_URL = "/api/admin";

export const getAllCustomersAsAdmin = async (): Promise<Customer[]> => {
    const response = await api.get(`${ADMIN_URL}/customers`);
    return response.data;
};

export const getCustomerByIdAsAdmin = async (id: number): Promise<Customer> => {
    const response = await api.get(`${ADMIN_URL}/customers/${id}`);
    return response.data;
};

export const createCustomerAsAdmin = async (customer: Customer): Promise<Customer> => {
    const response = await api.post(`${ADMIN_URL}/customers`, customer);
    return response.data;
};

export const updateCustomerAsAdmin = async (customer: Customer): Promise<Customer> => {
    const response = await api.put(`${ADMIN_URL}/customers`, customer);
    return response.data;
};

export const deleteCustomerAsAdmin = async (id: number): Promise<void> => {
    await api.delete(`${ADMIN_URL}/customers/${id}`);
};

export const searchCustomersByName = async (name: string): Promise<Customer[]> => {
    const response = await api.get(`${ADMIN_URL}/customers/search?name=${encodeURIComponent(name)}`);
    return response.data;
};

export const activateCustomer = async (id: number): Promise<Customer> => {
    const response = await api.put(`${ADMIN_URL}/customers/${id}/activate`);
    return response.data;
};

export const deactivateCustomer = async (id: number): Promise<Customer> => {
    const response = await api.put(`${ADMIN_URL}/customers/${id}/deactivate`);
    return response.data;
};

// This ensures TS treats the file as a module
export {};
