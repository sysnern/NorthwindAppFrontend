// src/services/SupplierService.js
import { deduplicatedApi, normalApi, invalidateCache } from "./api";

export async function getAllSuppliers(filters) {
  try {
    const { data: apiResp } = await deduplicatedApi.get("/api/Supplier/list", {
      params: filters,
    });
    return { 
      success: apiResp.success, 
      data: apiResp.data,
      totalCount: apiResp.totalCount,
      page: apiResp.page,
      pageSize: apiResp.pageSize,
      totalPages: apiResp.totalPages,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}

export async function getSupplierById(id) {
  try {
    const { data: apiResp } = await deduplicatedApi.get(`/api/Supplier/${id}`);
    return { 
      success: apiResp.success, 
      data: apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}

export async function createSupplier(supplierData) {
  try {
    const { data: apiResp } = await normalApi.post("/api/Supplier", supplierData);
    invalidateCache(); // Cache'i temizle
    return { 
      success: apiResp.success, 
      data: apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}

export async function updateSupplier(supplierData) {
  try {
    const { data: apiResp } = await normalApi.put("/api/Supplier", supplierData);
    invalidateCache(); // Cache'i temizle
    return { 
      success: apiResp.success, 
      data: apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}

export async function deleteSupplier(id) {
  try {
    const { data: apiResp } = await normalApi.delete(`/api/Supplier/${id}`);
    invalidateCache(); // Cache'i temizle
    return { 
      success: apiResp.success, 
      data: apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
