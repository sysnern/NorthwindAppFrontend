// 📁 src/services/ProductService.js
import api from "./api";

export async function getAllProducts(filters) {
  try {
    const { data: apiResp } = await api.get("/api/Product/list", { params: filters });
    return {
      success: apiResp.success,
      data:    apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
}

export async function getProductById(id) {
  try {
    const { data: apiResp } = await api.get(`/api/Product/${id}`);
    return {
      success: apiResp.success,
      data:    apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
}

export async function createProduct(dto) {
  try {
    const { data: apiResp } = await api.post("/api/Product", dto);
    return {
      success: apiResp.success,
      data:    apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
}

export async function updateProduct(dto) {
  try {
    const { data: apiResp } = await api.put("/api/Product", dto);
    return {
      success: apiResp.success,
      data:    apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
}

export async function deleteProduct(id) {
  try {
    const { data: apiResp } = await api.delete(`/api/Product/${id}`);
    return {
      success: apiResp.success,
      data:    apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
}
