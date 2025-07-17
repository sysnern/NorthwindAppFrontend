// src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import {
  createProduct,
  updateProduct,
  getProductById,
} from '../services/api';

const ProductForm = ({ selectedId, onSuccess }) => {
  const [form, setForm] = useState({
    productName: '',
    unitPrice: '',
    unitsInStock: '',
  });

  useEffect(() => {
    if (selectedId) {
      getProductById(selectedId).then((res) => setForm(res.data.data));
    }
  }, [selectedId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedId) {
      await updateProduct(selectedId, form);
    } else {
      await createProduct(form);
    }
    setForm({ productName: '', unitPrice: '', unitsInStock: '' });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="productName"
        value={form.productName}
        onChange={handleChange}
        placeholder="Ürün Adı"
        required
      />
      <input
        name="unitPrice"
        value={form.unitPrice}
        onChange={handleChange}
        placeholder="Birim Fiyat"
        required
      />
      <input
        name="unitsInStock"
        value={form.unitsInStock}
        onChange={handleChange}
        placeholder="Stok Adedi"
        required
      />
      <button type="submit">
        {selectedId ? 'Güncelle' : 'Ekle'}
      </button>
    </form>
  );
};

export default ProductForm;
