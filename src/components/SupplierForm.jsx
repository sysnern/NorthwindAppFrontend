// src/components/SupplierForm.jsx
import React, { useState, useEffect } from 'react';
import { createSupplier, updateSupplier, getSupplierById } from '../services/api';

const SupplierForm = ({ selectedId, onSuccess }) => {
  const [form, setForm] = useState({ companyName: '', contactTitle: '' });

  useEffect(() => {
    if (selectedId) {
      getSupplierById(selectedId).then(res => setForm(res.data.data));
    }
  }, [selectedId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    selectedId ? await updateSupplier(selectedId, form) : await createSupplier(form);
    onSuccess();
    setForm({ companyName: '', contactTitle: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" required />
      <input name="contactTitle" value={form.contactTitle} onChange={handleChange} placeholder="Contact Title" required />
      <button type="submit">{selectedId ? 'Güncelle' : 'Ekle'}</button>
    </form>
  );
};

export default SupplierForm;
