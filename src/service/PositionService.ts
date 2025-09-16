import api from "./api";
import { Position } from "../domain/Position";

const POSITION_URL = "/position"; // matches @RequestMapping("/position")

// GET all positions
export const getAllPositions = async (): Promise<Position[]> => {
    const response = await api.get(`${POSITION_URL}/getAll`);
    return response.data;
};

// GET position by ID
export const getPositionById = async (id: number): Promise<Position> => {
    const response = await api.get(`${POSITION_URL}/read/${id}`);
    return response.data;
};

// POST create position
export const createPosition = async (position: Position): Promise<Position> => {
    const response = await api.post(`${POSITION_URL}/create`, position);
    return response.data;
};

// PUT update position
export const updatePosition = async (position: Position): Promise<Position> => {
    const response = await api.put(`${POSITION_URL}/update`, position);
    return response.data;
};

// DELETE position
export const deletePosition = async (id: number): Promise<void> => {
    await api.delete(`${POSITION_URL}/delete/${id}`);
};
