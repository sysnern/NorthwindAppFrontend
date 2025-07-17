// src/components/OrderForm.jsx
import React, { useState, useEffect } from 'react';
import { createOrder, updateOrder, getOrderById } from '../services/api';

const OrderForm = ({ selectedId, onSuccess }) => {
  const [form, setForm] = useState({ orderDate: '', requiredDate: '', freight: '' });

  useEffect(() => {
    if (selectedId) {
      getOrderById(selectedId).then(res => setForm(res.data.data));
    }
  }, [selectedId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    selectedId ? await updateOrder(selectedId, form) : await createOrder(form);
    onSuccess();
    setForm({ orderDate: '', requiredDate: '', freight: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="orderDate" value={form.orderDate} onChange={handleChange} placeholder="Order Date" required />
      <input name="requiredDate" value={form.requiredDate} onChange={handleChange} placeholder="Required Date" required />
      <input name="freight" value={form.freight} onChange={handleChange} placeholder="Freight" required />
      <button type="submit">{selectedId ? 'Güncelle' : 'Ekle'}</button>
    </form>
  );
};

export default OrderForm;
