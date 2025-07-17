// 📁 src/services/ProductService.js
import api from "./api";

export async function getAllProducts() {
  try {
    const { data } = await api.get("/api/Product/list");
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
export async function getProductById(id) {
  try {
    const { data } = await api.get(`/api/Product/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
export async function createProduct(dto) {
  try {
    const { data } = await api.post("/api/Product", dto);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
export async function updateProduct(id, dto) {
  try {
    const { data } = await api.put(`/api/Product/${id}`, dto);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
export async function deleteProduct(id) {
  try {
    const { data } = await api.delete(`/api/Product/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
