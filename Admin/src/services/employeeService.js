import axios from 'axios';

const API_URL = "http://localhost:4000/api/employees";

export const createEmployee = async (employeeData) => await axios.post(API_URL, employeeData);
export const getEmployees = async () => await axios.get(API_URL);
export const getEmployeeById = async (id) => await axios.get(`${API_URL}/${id}`);
export const updateEmployee = async (id, employeeData) => await axios.put(`${API_URL}/${id}`, employeeData);
export const deleteEmployee = async (id) => await axios.delete(`${API_URL}/${id}`);