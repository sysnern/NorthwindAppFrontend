// src/services/SupplierService.js
import api from './api';

export async function getAllSuppliers() {
  try {
    const { data } = await api.get("/api/Supplier/list");
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
export async function getSupplierById(id) {
  try {
    const { data } = await api.get(`/api/Supplier/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
export async function createSupplier(dto) {
  try {
    const { data } = await api.post("/api/Supplier", dto);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
export async function updateSupplier(id, dto) {
  try {
    const { data } = await api.put(`/api/Supplier/${id}`, dto);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
export async function deleteSupplier(id) {
  try {
    const { data } = await api.delete(`/api/Supplier/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
