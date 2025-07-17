// src/components/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory, getCategoryById } from '../services/api';

const CategoryForm = ({ selectedId, onSuccess }) => {
  const [form, setForm] = useState({ name: '' });

  useEffect(() => {
    if (selectedId) {
      getCategoryById(selectedId).then(res => setForm(res.data.data));
    }
  }, [selectedId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    selectedId ? await updateCategory(selectedId, form) : await createCategory(form);
    onSuccess();
    setForm({ name: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <button type="submit">{selectedId ? 'Güncelle' : 'Ekle'}</button>
    </form>
  );
};