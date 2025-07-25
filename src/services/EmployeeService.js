// src/services/EmployeeService.js
import api from './api';
// same CRUD for /api/Employee/...
export async function getAllEmployees() {
  try {
    const { data } = await api.get("/api/Employee/list");
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function getEmployeeById(id) {
  try {
    const { data } = await api.get(`/api/Employee/${id}`);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function createEmployee(dto) {
  try {
    const { data } = await api.post("/api/Employee", dto);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function updateEmployee(dto) {
  try {
    // dto = { employeeID, firstName, lastName }
    const { data } = await api.put("/api/Employee", dto);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
}
export async function deleteEmployee(id) {
  try {
    const { data } = await api.delete(`/api/Employee/${id}`);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
