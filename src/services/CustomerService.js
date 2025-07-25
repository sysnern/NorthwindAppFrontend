// src/services/CustomerService.js
import api from "./api";

export async function getAllCustomers() {
  try {
    const { data } = await api.get("/api/Customer/list");
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function getCustomerById(id) {
  try {
    const { data } = await api.get(`/api/Customer/${id}`);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function createCustomer(dto) {
  try {
    const { data } = await api.post("/api/Customer", dto);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function updateCustomer(dto) {
  try {
    // dto = { customerID, companyName, contactName }
    const { data } = await api.put("/api/Customer", dto);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
export async function deleteCustomer(id) {
  try {
    const { data } = await api.delete(`/api/Customer/${id}`);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
    