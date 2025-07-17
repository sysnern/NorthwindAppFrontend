// src/components/EmployeeForm.jsx
import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee, getEmployeeById } from '../services/api';

const EmployeeForm = ({ selectedId, onSuccess }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', title: '' });

  useEffect(() => {
    if (selectedId) {
      getEmployeeById(selectedId).then(res => setForm(res.data.data));
    }
  }, [selectedId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    selectedId ? await updateEmployee(selectedId, form) : await createEmployee(form);
    onSuccess();
    setForm({ firstName: '', lastName: '', title: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required />
      <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required />
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <button type="submit">{selectedId ? 'Güncelle' : 'Ekle'}</button>
    </form>
  );
};

export default EmployeeForm;