// src/services/CustomerService.js
import { deduplicatedApi, normalApi, invalidateCache } from "./api";

export async function getAllCustomers(filters) {
  try {
    const { data: apiResp } = await deduplicatedApi.get("/api/Customer/list", {
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

export async function getCustomerById(id) {
  try {
    const { data: apiResp } = await deduplicatedApi.get(`/api/Customer/${id}`);
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

export async function createCustomer(customerData) {
  try {
    const { data: apiResp } = await normalApi.post("/api/Customer", customerData);
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

export async function updateCustomer(customerData) {
  try {
    const { data: apiResp } = await normalApi.put("/api/Customer", customerData);
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

export async function deleteCustomer(id) {
  try {
    const { data: apiResp } = await normalApi.delete(`/api/Customer/${id}`);
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
