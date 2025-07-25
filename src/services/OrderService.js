// src/services/OrderService.js
import api from './api';

export async function getAllOrders() {
  try {
    const { data } = await api.get("/api/Order/list");
    return data;
  } catch (e) {
    return { success: false, message: e.message };
  }
}
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
export async function updateOrder(dto) {
  try {
    // dto = { orderID, customerID, employeeID, orderDate }
    const { data } = await api.put("/api/Order", dto);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
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
