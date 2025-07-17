// 📁 src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/ProductService";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    productName: "",
    unitPrice: "",
    unitsInStock: "",
    categoryId: "",
    supplierId: "",
    discontinued: false,
  });
  const [filters, setFilters] = useState({
    productName: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    discontinued: "", // "" / "true" / "false"
  });

  // 1) Listeyi çek
  const loadProducts = async () => {
    try {
      const res = await getAllProducts(filters);
      if (res.success) {
        setProducts(res.data);
      } else {
        alert("Listeleme hatası: " + res.message);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Bilinmeyen bir hata oluştu.";
      alert("Listeleme hatası: " + msg);
    }
  };

  // sayfa açıldığında bir kez
  useEffect(() => {
    loadProducts();
  }, []);

  // 2) Form inputları değiştiğinde (Ekle/Güncelle formu)
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 3) Filtre inputları değiştiğinde
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({
      ...f,
      [name]: value,
    }));
  };

  // 4) Form submit (Ekle/Güncelle)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedId) {
        await updateProduct(selectedId, form);
        alert("Ürün güncellendi");
      } else {
        await createProduct(form);
        alert("Ürün eklendi");
      }
      // formu temizle
      setForm({
        productName: "",
        unitPrice: "",
        unitsInStock: "",
        categoryId: "",
        supplierId: "",
        discontinued: false,
      });
      setSelectedId(null);
      loadProducts();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Beklenmeyen bir hata oluştu.";
      alert("Kayıt hatası: " + msg);
    }
  };

  // 5) Düzenle butonu tıklanınca
  const handleEdit = async (id) => {
    try {
      const res = await getProductById(id);
      if (res.success) {
        setForm(res.data);
        setSelectedId(id);
      } else {
        alert("Ürün getirme hatası: " + res.message);
      }
    } catch (err) {
      alert(
        "Ürün getirme hatası: " +
          (err?.response?.data?.message || err?.message)
      );
    }
  };

  // 6) Sil butonu
  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istiyor musunuz?")) return;
    try {
      await deleteProduct(id);
      alert("Silindi");
      loadProducts();
    } catch (err) {
      alert("Silme hatası: " + (err?.response?.data?.message || err?.message));
    }
  };

  // 7) Filtreleme butonu
  const handleFilter = () => {
    loadProducts();
  };

  return (
    <div className="container p-4">
      <h2>Ürün Listesi</h2>

      {/* Filtreler */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <input
          name="productName"
          placeholder="Ürün Adı"
          value={filters.productName}
          onChange={handleFilterChange}
          className="form-control"
        />
        <input
          name="categoryId"
          placeholder="Kategori ID"
          value={filters.categoryId}
          onChange={handleFilterChange}
          className="form-control"
        />
        <input
          name="minPrice"
          placeholder="Min Fiyat"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="form-control"
        />
        <input
          name="maxPrice"
          placeholder="Max Fiyat"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="form-control"
        />
        <select
          name="discontinued"
          value={filters.discontinued}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">Durum (Tümü)</option>
          <option value="false">Aktif</option>
          <option value="true">Pasif</option>
        </select>
        <button onClick={handleFilter} className="btn btn-primary">
          Filtrele
        </button>
      </div>

      {/* Tablo */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Fiyat</th>
            <th>Stok</th>
            <th>Durum</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.productId}>
              <td>{p.productId}</td>
              <td>{p.productName}</td>
              <td>{p.unitPrice}</td>
              <td>{p.unitsInStock}</td>
              <td>{p.discontinued ? "Pasif" : "Aktif"}</td>
              <td className="d-flex gap-1">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEdit(p.productId)}
                >
                  Düzenle
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(p.productId)}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ekle/Güncelle Form */}
      <div className="mt-4">
        <h3>{selectedId ? "Ürünü Güncelle" : "Yeni Ürün Ekle"}</h3>
        <form onSubmit={handleSubmit} className="row g-2 align-items-center">
          <div className="col-md-3">
            <input
              name="productName"
              placeholder="Ürün Adı"
              value={form.productName}
              onChange={handleFormChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              name="unitPrice"
              placeholder="Fiyat"
              value={form.unitPrice}
              onChange={handleFormChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              name="unitsInStock"
              placeholder="Stok"
              value={form.unitsInStock}
              onChange={handleFormChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              name="categoryId"
              placeholder="Kategori ID"
              value={form.categoryId}
              onChange={handleFormChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              name="supplierId"
              placeholder="Tedarikçi ID"
              value={form.supplierId}
              onChange={handleFormChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-1 form-check">
            <input
              type="checkbox"
              name="discontinued"
              id="discontinued"
              checked={form.discontinued}
              onChange={handleFormChange}
              className="form-check-input"
            />
            <label htmlFor="discontinued" className="form-check-label">
              Pasif
            </label>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-success">
              {selectedId ? "Güncelle" : "Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductList;
