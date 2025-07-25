// 📁 src/services/ProductService.js
import api from "./api";

export async function getAllProducts(filters) {
  try {
    // artık /api/Product/list kullanıyoruz
    const { data: apiResp } = await api.get("/api/Product/list", {
      params: filters
    });
    // apiResp = { success: true, data: [ … ], message: … }
    return { success: true, data: apiResp.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}

export async function getProductById(id) {
  try {
    // GET /api/Product/{id}
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
    // POST /api/Product
    const { data } = await api.post("/api/Product", dto);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}

export async function updateProduct(dto) {
  try {
    // dto içinde productID olduğundan swagger bunu tanıyacak
    const { data: apiResp } = await api.put("/api/Product", dto);
    return {
      success: apiResp.success,
      data:    apiResp.data,
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
    // DELETE /api/Product/{id}
    const { data } = await api.delete(`/api/Product/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
