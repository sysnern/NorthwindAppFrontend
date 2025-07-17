// src/components/CategoryList.jsx
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
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [show,    setShow]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState({ categoryName: "" });
  const [selId,   setSelId]   = useState(null);

  useEffect(() => { fetchList() }, []);

  async function fetchList() {
    setLoading(true);
    const res = await getAllCategories();
    if (res.success) setItems(res.data);
    else alert(res.message);
    setLoading(false);
  }

  async function open(itId = null) {
    setSelId(itId);
    if (itId !== null) {
      setSaving(true);
      const res = await getCategoryById(itId);
      if (!res.success) { alert(res.message); return; }
      setForm({ categoryName: res.data.categoryName });
      setSaving(false);
    } else {
      setForm({ categoryName: "" });
    }
    setShow(true);
  }

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function save() {
    setSaving(true);
    const fn = selId ? updateCategory : createCategory;
    const dto = selId ? { categoryId: selId, ...form } : form;
    const res = await fn(dto);
    if (!res.success) alert(res.message);
    setShow(false);
    fetchList();
    setSaving(false);
  }

  async function destroy(id) {
    if (!window.confirm("Silinsin mi?")) return;
    const res = await deleteCategory(id);
    if (!res.success) alert(res.message);
    fetchList();
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Kategori Listesi</h2>
        <Button onClick={() => open(null)}>Yeni</Button>
      </div>

      {loading
        ? <div className="text-center"><Spinner/></div>
        : items.length === 0
          ? <Alert variant="info">Henüz hiç kategori yok.</Alert>
          : <Table striped hover>
              <thead className="table-dark">
                <tr>
                  <th>ID</th><th>Ad</th><th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => (
                  <tr key={it.categoryId}>
                    <td>{it.categoryId}</td>
                    <td>{it.categoryName}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => open(it.categoryId)}
                      ><i className="bi bi-pencil-fill"/></Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => destroy(it.categoryId)}
                      ><i className="bi bi-trash-fill"/></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
      }

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selId ? "Güncelle" : "Yeni"} Kategori</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                name="categoryName"
                value={form.categoryName}
                onChange={onChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>İptal</Button>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? <Spinner size="sm" animation="border"/> : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
