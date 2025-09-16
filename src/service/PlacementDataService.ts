// src/service/PlacementDataService.ts
import axios from "axios";
import { PlacementData } from "../domain/PlacementData";

const API_URL = "http://localhost:8080/placement-data";

export const createPlacementData = async (placementData: PlacementData): Promise<PlacementData> => {
    const response = await axios.post(`${API_URL}/create`, placementData);
    return response.data;
};

export const getPlacementDataById = async (id: number): Promise<PlacementData> => {
    const response = await axios.get(`${API_URL}/read/${id}`);
    return response.data;
};

export const updatePlacementData = async (placementData: PlacementData): Promise<PlacementData> => {
    const response = await axios.put(`${API_URL}/update`, placementData);
    return response.data;
};

export const deletePlacementData = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/delete/${id}`);
};

export const getAllPlacementData = async (): Promise<PlacementData[]> => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
};

export const findByPositionId = async (positionId: number): Promise<PlacementData[]> => {
    const response = await axios.get(`${API_URL}/by-position/${positionId}`);
    return response.data;
};

export const findByRotationId = async (rotationId: number): Promise<PlacementData[]> => {
    const response = await axios.get(`${API_URL}/by-rotation/${rotationId}`);
    return response.data;
};

export const findByScaleId = async (scaleId: number): Promise<PlacementData[]> => {
    const response = await axios.get(`${API_URL}/by-scale/${scaleId}`);
    return response.data;
};
