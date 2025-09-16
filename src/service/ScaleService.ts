import api from "./api";
import { Scale } from "../domain/Scale";

const SCALE_URL = "/scale"; // matches @RequestMapping("/scale")

// GET all scales
export const getAllScales = async (): Promise<Scale[]> => {
    const response = await api.get(`${SCALE_URL}/getAll`);
    return response.data;
};

// GET scale by ID
export const getScaleById = async (id: number): Promise<Scale> => {
    const response = await api.get(`${SCALE_URL}/read/${id}`);
    return response.data;
};

// POST create scale
export const createScale = async (scale: Scale): Promise<Scale> => {
    const response = await api.post(`${SCALE_URL}/create`, scale);
    return response.data;
};

// PUT update scale
export const updateScale = async (scale: Scale): Promise<Scale> => {
    const response = await api.put(`${SCALE_URL}/update`, scale);
    return response.data;
};

// DELETE scale
export const deleteScale = async (id: number): Promise<void> => {
    await api.delete(`${SCALE_URL}/delete/${id}`);
};
