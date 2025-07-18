// 📁 src/components/CategoryList.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert } from "react-bootstrap";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/CategoryService";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState({ categoryName: "" });
  const [selectedId, setSelectedId] = useState(null);

  // —— Listeyi yükle (cleanup guard ile)
  useEffect(() => {
    let isMounted = true;
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await getAllCategories();
        if (isMounted) {
          if (res.success) setCategories(res.data);
          else alert(res.message);
        }
      } catch {
        if (isMounted) alert("Kategori listeleme hatası.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchList();
    return () => {
      isMounted = false;
    };
  }, []);

  // —— Modal’i aç (Yeni / Düzenle)
  const openModal = async (id = null) => {
    setSelectedId(id);
    if (id !== null) {
      setSaving(true);
      const res = await getCategoryById(id);
      if (res.success) {
        setForm({ categoryName: res.data.categoryName });
      } else {
        alert(res.message);
      }
      setSaving(false);
    } else {
      setForm({ categoryName: "" });
    }
    setShowModal(true);
  };

  // —— Sil
  const handleDelete = async (id) => {
    if (!window.confirm("Silinsin mi?")) return;
    const res = await deleteCategory(id);
    if (res.success) {
      // listeyi yenile
      const listRes = await getAllCategories();
      if (listRes.success) setCategories(listRes.data);
      else alert(listRes.message);
    } else {
      alert(res.message);
    }
  };

  // —— Kaydet (Yeni / Güncelle)
  const handleSave = async () => {
    setSaving(true);
    try {
      let res;
      if (selectedId !== null) {
        res = await updateCategory({ categoryId: selectedId, ...form });
      } else {
        res = await createCategory(form);
      }
      if (!res.success) throw new Error(res.message);
      setShowModal(false);
      // listeyi yenile
      const listRes = await getAllCategories();
      if (listRes.success) setCategories(listRes.data);
      else alert(listRes.message);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // —— Form input değişimi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Kategori Listesi</h2>
        <Button onClick={() => openModal(null)}>Yeni</Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : categories.length === 0 ? (
        <Alert variant="info">Henüz hiç kategori yok.</Alert>
      ) : (
        <Table striped hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.categoryId}>
                <td>{cat.categoryId}</td>
                <td>{cat.categoryName}</td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => openModal(cat.categoryId)}
                  >
                    <i className="bi bi-pencil-fill" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(cat.categoryId)}
                  >
                    <i className="bi bi-trash-fill" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* —— Modal / Popup —— */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId !== null ? "Güncelle" : "Yeni"} Kategori
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                name="categoryName"
                value={form.categoryName}
                onChange={handleChange}
                disabled={saving}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={saving}
          >
            İptal
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Spinner size="sm" animation="border" /> : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
