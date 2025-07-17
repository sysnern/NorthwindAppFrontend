// src/services/CustomerService.js
import api from './api';

export const getAllCustomers = () => api.get('Customer/list');
export const getCustomerById = (id) => api.get(`Customer/${id}`);
export const createCustomer = (data) => api.post('Customer', data);
export const updateCustomer = (data) => api.put('Customer', data);
export const deleteCustomer = (id) => api.delete(`Customer/${id}`);