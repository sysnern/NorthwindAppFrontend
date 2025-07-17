// src/services/SupplierService.js
import api from './api';

export const getAllSuppliers = () => api.get('Supplier/list');
export const getSupplierById = (id) => api.get(`Supplier/${id}`);
export const createSupplier = (data) => api.post('Supplier', data);
export const updateSupplier = (data) => api.put('Supplier', data);
export const deleteSupplier = (id) => api.delete(`Supplier/${id}`);
