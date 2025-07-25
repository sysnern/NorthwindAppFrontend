// 📁 src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert } from "react-bootstrap";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/ProductService";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    productName: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    discontinued: "",
  });
  const [loading, setLoading] = useState(true);

  // --- Modal state ---
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    productName: "",
    unitPrice: "",
    unitsInStock: "",
    categoryId: "",
    supplierId: "",
    discontinued: false,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);

  // listeyi yükle
  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts(filters);
      if (res.success) {
        setProducts(res.data);
      } else {
        alert(res.message);
      }
    } catch (e) {
      alert("Listeleme hatası.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect artık doğrudan load() çağırıyor
  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [true]);

  // filtre değişti
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  // düzenleme / ekleme aç
  const openForEdit = async id => {
    if (id) {
      const res = await getProductById(id);
      if (!res.success) return alert(res.message);
      const dto = res.data;
      setForm({
        productName: dto.productName,
        unitPrice: dto.unitPrice?.toString() || "",
        unitsInStock: dto.unitsInStock?.toString() || "",
        categoryId: dto.categoryId?.toString() || "",
        supplierId: dto.supplierId?.toString() || "",
        discontinued: dto.discontinued,
      });
      setSelectedId(dto.productID);
    } else {
      setForm({
        productName: "",
        unitPrice: "",
        unitsInStock: "",
        categoryId: "",
        supplierId: "",
        discontinued: false,
      });
      setSelectedId(null);
    }
    setShowModal(true);
  };

  // form inputları
  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // kaydet
  const handleSave = async () => {
    setSaving(true);
    try {
      if (selectedId) await updateProduct(selectedId, form);
      else await createProduct(form);
      setShowModal(false);
      load();
    } catch {
      alert("Kaydetme hatası.");
    } finally {
      setSaving(false);
    }
  };

  // sil
  const handleDelete = async id => {
    if (!window.confirm("Silinsin mi?")) return;
    const res = await deleteProduct(id);
    if (res.success) load();
    else alert(res.message);
  };

  return (
    <div className="container py-4">
      <h2>Ürün Listesi</h2>

      {/* --- Filtre --- */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {["productName", "categoryId", "minPrice", "maxPrice"].map(f => (
          <Form.Control
            key={f}
            name={f}
            placeholder={{
              productName: "Ürün Adı",
              categoryId: "Kategori ID",
              minPrice: "Min Fiyat",
              maxPrice: "Max Fiyat",
            }[f]}
            value={filters[f]}
            onChange={handleFilterChange}
          />
        ))}
        <Form.Select
          name="discontinued"
          value={filters.discontinued}
          onChange={handleFilterChange}
        >
          <option value="">Durum (Tümü)</option>
          <option value="false">Aktif</option>
          <option value="true">Pasif</option>
        </Form.Select>
        <Button onClick={load}>Filtrele</Button>
        <Button variant="success" onClick={() => openForEdit(null)}>
          Yeni
        </Button>
      </div>

      {/* --- Liste / Spinner / Alert --- */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : products.length === 0 ? (
        <Alert variant="warning">Hiç ürün yok.</Alert>
      ) : (
        <Table striped hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>Durum</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.productID}>
                <td>{p.productID}</td>
                <td>{p.productName}</td>
                <td>{p.unitPrice}</td>
                <td>{p.unitsInStock}</td>
                <td>{p.discontinued ? "Pasif" : "Aktif"}</td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => openForEdit(p.productID)}
                  >
                    <i className="bi bi-pencil-fill" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(p.productID)}
                  >
                    <i className="bi bi-trash-fill" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* --- Modal / Popup --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? "Ürünü Güncelle" : "Yeni Ürün Ekle"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Ürün Adı</Form.Label>
              <Form.Control
                name="productName"
                value={form.productName}
                onChange={handleFormChange}
              />
            </Form.Group>
            <div className="d-flex gap-2 mb-2">
              <Form.Group className="flex-fill">
                <Form.Label>Fiyat</Form.Label>
                <Form.Control
                  name="unitPrice"
                  value={form.unitPrice}
                  onChange={handleFormChange}
                />
              </Form.Group>
              <Form.Group className="flex-fill">
                <Form.Label>Stok</Form.Label>
                <Form.Control
                  name="unitsInStock"
                  value={form.unitsInStock}
                  onChange={handleFormChange}
                />
              </Form.Group>
            </div>
            <div className="d-flex gap-2 mb-2">
              <Form.Group className="flex-fill">
                <Form.Label>Kategori ID</Form.Label>
                <Form.Control
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleFormChange}
                />
              </Form.Group>
              <Form.Group className="flex-fill">
                <Form.Label>Tedarikçi ID</Form.Label>
                <Form.Control
                  name="supplierId"
                  value={form.supplierId}
                  onChange={handleFormChange}
                />
              </Form.Group>
            </div>
            <Form.Check
              type="checkbox"
              label="Pasif"
              name="discontinued"
              checked={form.discontinued}
              onChange={handleFormChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner animation="border" size="sm" /> : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
