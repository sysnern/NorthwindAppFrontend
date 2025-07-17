import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { getAllProducts, deleteProduct } from '../services/ProductService';

export default function ProductsPage() {
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const loadProducts = async () => {
    try {
      const res = await getAllProducts(filters);
      if (res.success) setProducts(res.data);
      else alert(res.message);
    } catch (err) {
      alert('Listeleme hatası: ' + err.message);
    }
  };

  useEffect(() => { loadProducts(); }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Silinsin mi?')) return;
    const res = await deleteProduct(id);
    if (res.success) loadProducts();
    else alert(res.message);
  };

  return (
    <div>
      <h1>Ürünler</h1>
      {/* Burada filtre formu koyabilirsiniz */}
      <ProductList 
         products={products} 
         onDelete={handleDelete} 
         onEdit={setSelectedId}
      />
      <hr/>
      <h2>{selectedId ? 'Ürünü Güncelle' : 'Yeni Ürün Ekle'}</h2>
      <ProductForm 
         key={selectedId} 
         selectedId={selectedId} 
         onSuccess={() => { setSelectedId(null); loadProducts(); }}
      />
    </div>
  );
}
