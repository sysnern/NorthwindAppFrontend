// src/services/EmployeeService.js
import api from "./api";
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
export async function updateEmployee(id, dto) {
  try {
    const { data } = await api.put(`/api/Employee/${id}`, dto);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
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
  if (!window.confirm("Silinsin mi?")) return;
  try {
    const res = await deleteEmployee(id);
    if (!res.success) alert(res.message);
    else {
      const updatedItems = items.filter(item => item.employeeID !== id);
      setItems(updatedItems);
    }
  }
  catch (e) {
    console.error(e);
    alert("Silme işlemi sırasında hata oluştu.");
  }