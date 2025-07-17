// src/components/CustomerForm.jsx
import React, { useState, useEffect } from 'react';
import { createCustomer, updateCustomer, getCustomerById } from '../services/api';

const CustomerForm = ({ selectedId, onSuccess }) => {
  const [form, setForm] = useState({ companyName: '', contactName: '' });

  useEffect(() => {
    if (selectedId) {
      getCustomerById(selectedId).then(res => setForm(res.data.data));
    }
  }, [selectedId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    selectedId ? await updateCustomer(selectedId, form) : await createCustomer(form);
    onSuccess();
    setForm({ companyName: '', contactName: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" required />
      <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Contact Name" required />
      <button type="submit">{selectedId ? 'Güncelle' : 'Ekle'}</button>
    </form>
  );
};