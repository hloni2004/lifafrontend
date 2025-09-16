import api from "./api";
import { Employee } from "../domain/Employee";

const EMPLOYEE_URL = "/api/employee"; // matches @RequestMapping("/api/employee")

export const getAllEmployees = async (): Promise<Employee[]> => {
    const response = await api.get(EMPLOYEE_URL);
    return response.data;
};

export const createEmployee = async (employee: Employee): Promise<Employee> => {
    const response = await api.post(EMPLOYEE_URL, employee);
    return response.data;
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
    const response = await api.put(EMPLOYEE_URL, employee);
    return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
    await api.delete(`${EMPLOYEE_URL}/${id}`);
};
