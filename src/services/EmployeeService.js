// src/services/EmployeeService.js
import { deduplicatedApi, normalApi, invalidateCache } from "./api";

export async function getAllEmployees(filters) {
  try {
    const { data: apiResp } = await deduplicatedApi.get("/api/Employee/list", {
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

export async function getEmployeeById(id) {
  try {
    const { data: apiResp } = await deduplicatedApi.get(`/api/Employee/${id}`);
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

export async function createEmployee(employeeData) {
  try {
    const { data: apiResp } = await normalApi.post("/api/Employee", employeeData);
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

export async function updateEmployee(employeeData) {
  try {
    const { data: apiResp } = await normalApi.put("/api/Employee", employeeData);
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

export async function deleteEmployee(id) {
  try {
    const { data: apiResp } = await normalApi.delete(`/api/Employee/${id}`);
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
