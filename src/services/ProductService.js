// src/services/ProductService.js
import { deduplicatedApi, normalApi, invalidateCache } from "./api";

export async function getAllProducts(filters) {
  try {
    const { data: apiResp } = await deduplicatedApi.get("/api/Product/list", {
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

export async function getProductById(id) {
  try {
    const { data: apiResp } = await deduplicatedApi.get(`/api/Product/${id}`);
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

export async function createProduct(productData) {
  try {
    const { data: apiResp } = await normalApi.post("/api/Product", productData);
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

export async function updateProduct(productData) {
  try {
    const { data: apiResp } = await normalApi.put("/api/Product", productData);
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

export async function deleteProduct(id) {
  try {
    const { data: apiResp } = await normalApi.delete(`/api/Product/${id}`);
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
