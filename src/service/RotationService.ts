import api from "./api";
import { Rotation } from "../domain/Rotation";

const ROTATION_URL = "/rotation"; // matches @RequestMapping("/rotation")

// GET all rotations
export const getAllRotations = async (): Promise<Rotation[]> => {
    const response = await api.get(`${ROTATION_URL}/getAll`);
    return response.data;
};

// GET rotation by ID
export const getRotationById = async (id: number): Promise<Rotation> => {
    const response = await api.get(`${ROTATION_URL}/read/${id}`);
    return response.data;
};

// POST create rotation
export const createRotation = async (rotation: Rotation): Promise<Rotation> => {
    const response = await api.post(`${ROTATION_URL}/create`, rotation);
    return response.data;
};

// PUT update rotation
export const updateRotation = async (rotation: Rotation): Promise<Rotation> => {
    const response = await api.put(`${ROTATION_URL}/update`, rotation);
    return response.data;
};

// DELETE rotation
export const deleteRotation = async (id: number): Promise<void> => {
    await api.delete(`${ROTATION_URL}/delete/${id}`);
};
