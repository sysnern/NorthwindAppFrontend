import api from "./api";

export const getAllCategories = () => api.get("Category/list");
export const getCategoryById = (id) => api.get(`Category/${id}`);
export const createCategory = (data) => api.post("Category", data);
export const updateCategory = (data) => api.put("Category", data);
export const deleteCategory = (id) => api.delete(`Category/${id}`);
