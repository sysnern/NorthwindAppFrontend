// src/services/CategoryService.js
import api from "./api";

export async function getAllCategories(filters) {
  try {
    // filtreleri query string olarak yollamak isterseniz:
    const { data: apiResp } = await api.get("/api/Category/list", { params: filters });
    // apiResp = { success: true, data: [ … ], message: … }
    return { success: true, data: apiResp.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}

export async function getCategoryById(id) {
  try {
    const { data } = await api.get(`/api/Category/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}

export async function createCategory(dto) {
  try {
    const { data } = await api.post("/api/Category", dto);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}

export async function updateCategory(dto) {
  try {
    const { data } = await api.put("/api/Category", dto);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}

export async function deleteCategory(id) {
  try {
    const { data } = await api.delete(`/api/Category/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
