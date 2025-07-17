// src/services/OrderService.js
import api from './api';

export const getAllOrders = async () => {
  // doğru endpoint: GET /api/Order
  const { data } = await api.get('Order/list');
  return data;   // { success, message, data: [ … ] }
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`Order/${id}`);
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await api.post('Order', payload);
  return data;
};

export const updateOrder = async (id, payload) => {
  // put body’niz OrderUpdateDto’ye uymalı
  const { data } = await api.put('Order', { orderID: id, ...payload });
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await api.delete(`Order/${id}`);
  return data;
};
