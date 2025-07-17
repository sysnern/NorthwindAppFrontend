// src/services/EmployeeService.js
import api from './api';

export const getAllEmployees = () => api.get('Employee/list');
export const getEmployeeById = (id) => api.get(`Employee/${id}`);
export const createEmployee = (data) => api.post('Employee', data);
export const updateEmployee = (data) => api.put('Employee', data);
export const deleteEmployee = (id) => api.delete(`Employee/${id}`);