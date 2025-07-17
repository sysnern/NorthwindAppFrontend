// src/services/SupplierService.js
import api from "./api";
// same pattern as above, hitting /api/Supplier/...
export async function getAllSuppliers() {
  try {
    const { data } = await api.get("/api/Supplier/list");
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function getSupplierById(id) {
  try {
    const { data } = await api.get(`/api/Supplier/${id}`);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function createSupplier(dto) {
  try {
    const { data } = await api.post("/api/Supplier", dto);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function updateSupplier(id, dto) {
  try {
    const { data } = await api.put(`/api/Supplier/${id}`, dto);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export async function deleteSupplier(id) {
  try {
    const { data } = await api.delete(`/api/Supplier/${id}`);
    return data;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
    if (!window.confirm("Silinsin mi?")) return;
    try {
      const res = await deleteSupplier(id);
      if (!res.success) alert(res.message);
      else {
        const updatedItems = items.filter(item => item.supplierID !== id);
        setItems(updatedItems);
      }
    } catch (e) {
      console.error(e);
      alert("Silme işlemi sırasında hata oluştu.");
    }
    