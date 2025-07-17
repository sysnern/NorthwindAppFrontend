// 📁 src/services/ProductService.js
import api from "./api";

export const getAllProducts = async (filters) => {
  const response = await api.get("Product/list", { params: filters });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`Product/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post("Product", data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`Product`, { productId: id, ...data });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`Product/${id}`);
  return response.data;
};
