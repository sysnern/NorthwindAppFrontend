// src/services/CategoryService.js
import { deduplicatedApi, normalApi, invalidateCache } from "./api";

export async function getAllCategories(filters) {
  try {
    const { data: apiResp } = await deduplicatedApi.get("/api/Category/list", {
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

export async function getCategoryById(id) {
  try {
    const { data: apiResp } = await deduplicatedApi.get(`/api/Category/${id}`);
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

export async function createCategory(categoryData) {
  try {
    const { data: apiResp } = await normalApi.post("/api/Category", categoryData);
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

export async function updateCategory(categoryData) {
  try {
    const { data: apiResp } = await normalApi.put("/api/Category", categoryData);
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

export async function deleteCategory(id) {
  try {
    const { data: apiResp } = await normalApi.delete(`/api/Category/${id}`);
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
