// src/services/OrderService.js
import api from "./api";

export async function getAllOrders() {
  try { const { data } = await api.get("/api/Order/list"); return data; }
  catch (e) { return { success:false, message:e.message } }
}
// getOrderById, createOrder, updateOrder, deleteOrder → same pattern
export async function getOrderById(id) {
  try {
    const { data } = await api.get(`/api/Order/${id}`);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function createOrder(dto) {
  try {
    const { data } = await api.post("/api/Order", dto);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function updateOrder(id, dto) {
  try {
    const { data } = await api.put(`/api/Order/${id}`, dto);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function deleteOrder(id) {
  try {
    const { data } = await api.delete(`/api/Order/${id}`);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
      
