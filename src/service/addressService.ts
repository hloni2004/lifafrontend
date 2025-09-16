import api from "./api";
import { Address } from "../domain/Address";

const BASE_URL = "/address"; // matches @RequestMapping("/address")

export const getAllAddresses = async (): Promise<Address[]> => {
    const response = await api.get(`${BASE_URL}/getAll`);
    return response.data;
};

export const getAddressById = async (id: number): Promise<Address> => {
    const response = await api.get(`${BASE_URL}/read/${id}`);
    return response.data;
};

export const createAddress = async (address: Address): Promise<Address> => {
    const response = await api.post(`${BASE_URL}/create`, address);
    return response.data;
};

export const updateAddress = async (address: Address): Promise<Address> => {
    const response = await api.put(`${BASE_URL}/update`, address);
    return response.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/delete/${id}`);
};
