import api from "./api";

export async function getAllCustomers(filters) {
  try {
    const { data: apiResp } = await api.get("/api/Customer/list", {
      params: filters
    });
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

export async function getCustomerById(id) {
  try {
    const { data: apiResp } = await api.get(`/api/Customer/${id}`);
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

export async function createCustomer(dto) {
  try {
    const { data: apiResp } = await api.post("/api/Customer", dto);
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

export async function updateCustomer(dto) {
  try {
    const { data: apiResp } = await api.put("/api/Customer", dto);
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

export async function deleteCustomer(id) {
  try {
    const { data: apiResp } = await api.delete(`/api/Customer/${id}`);
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
