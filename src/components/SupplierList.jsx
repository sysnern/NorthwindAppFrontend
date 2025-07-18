// 📁 src/components/SupplierList.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert } from "react-bootstrap";
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/SupplierService";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    supplierID: "",
    companyName: "",
    contactName: "",
  });
  const [selectedId, setSelectedId] = useState(null);

  // —— Listeyi yükle (cleanup guard ile)
  useEffect(() => {
    let isMounted = true;
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await getAllSuppliers();
        if (isMounted) {
          if (res.success) setSuppliers(res.data);
          else alert(res.message);
        }
      } catch {
        if (isMounted) alert("Tedarikçi listeleme hatası.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchList();
    return () => { isMounted = false; };
  }, []);

  // —— Modal’i aç (Yeni / Düzenle)
  const openModal = async (id = null) => {
    setSelectedId(id);
    if (id !== null) {
      setSaving(true);
      const res = await getSupplierById(id);
      if (res.success) setForm(res.data);
      else alert(res.message);
      setSaving(false);
    } else {
      setForm({ supplierID: "", companyName: "", contactName: "" });
    }
    setShowModal(true);
  };

  // —— Sil
  const handleDelete = async (id) => {
    if (!window.confirm("Silinsin mi?")) return;
    const res = await deleteSupplier(id);
    if (res.success) {
      const listRes = await getAllSuppliers();
      if (listRes.success) setSuppliers(listRes.data);
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
        res = await updateSupplier(form);
      } else {
        res = await createSupplier(form);
      }
      if (!res.success) throw new Error(res.message);
      setShowModal(false);
      const listRes = await getAllSuppliers();
      if (listRes.success) setSuppliers(listRes.data);
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
        <h2>Tedarikçi Listesi</h2>
        <Button onClick={() => openModal(null)}>Yeni</Button>
      </div>

      {loading ? (
        <div className="text-center"><Spinner /></div>
      ) : suppliers.length === 0 ? (
        <Alert variant="info">Henüz hiç tedarikçi yok.</Alert>
      ) : (
        <Table striped hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Şirket</th>
              <th>İletişim</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.supplierID}>
                <td>{s.supplierID}</td>
                <td>{s.companyName}</td>
                <td>{s.contactName}</td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => openModal(s.supplierID)}
                  >
                    <i className="bi bi-pencil-fill"/>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(s.supplierID)}
                  >
                    <i className="bi bi-trash-fill"/>
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
          <Modal.Title>{selectedId !== null ? "Güncelle" : "Yeni"} Tedarikçi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>ID</Form.Label>
              <Form.Control
                name="supplierID"
                value={form.supplierID}
                disabled={!!selectedId || saving}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Şirket</Form.Label>
              <Form.Control
                name="companyName"
                value={form.companyName}
                disabled={saving}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>İletişim</Form.Label>
              <Form.Control
                name="contactName"
                value={form.contactName}
                disabled={saving}
                onChange={handleChange}
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
            {saving ? <Spinner size="sm" animation="border"/> : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
