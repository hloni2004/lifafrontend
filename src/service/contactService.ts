import api from "./api";
import { Contact } from "../domain/Contact";

const CONTACT_URL = "/contact"; // matches @RequestMapping("/contact")

export const getAllContacts = async (): Promise<Contact[]> => {
    const response = await api.get(`${CONTACT_URL}/getAll`);
    return response.data;
};

export const createContact = async (contact: Contact): Promise<Contact> => {
    const response = await api.post(`${CONTACT_URL}/create`, contact);
    return response.data;
};

export const updateContact = async (contact: Contact): Promise<Contact> => {
    const response = await api.put(`${CONTACT_URL}/update`, contact);
    return response.data;
};

export const deleteContact = async (id: number): Promise<void> => {
    await api.delete(`${CONTACT_URL}/delete/${id}`);
};
