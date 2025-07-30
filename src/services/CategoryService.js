import api from "./api";

export async function getAllCategories(filters) {
  try {
    const { data: apiResp } = await api.get("/api/Category/list", {
      params: filters
    });
    // apiResp = { success: true, data: [...], message: "…" }
    return {
      success: apiResp.success,
      data: apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
}

export async function getCategoryById(id) {
  try {
    const { data: apiResp } = await api.get(`/api/Category/${id}`);
    return {
      success: apiResp.success,
      data: apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
}

export async function createCategory(dto) {
  try {
    const { data: apiResp } = await api.post("/api/Category", dto);
    return {
      success: apiResp.success,
      data: apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
}

export async function updateCategory(dto) {
  try {
    const { data: apiResp } = await api.put("/api/Category", dto);
    return {
      success: apiResp.success,
      data: apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
}

export async function deleteCategory(id) {
  try {
    const { data: apiResp } = await api.delete(`/api/Category/${id}`);
    return {
      success: apiResp.success,
      data: apiResp.data,
      message: apiResp.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
}
