// 📁 src/components/CustomerList.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert } from "react-bootstrap";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/CustomerService";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({
    customerID: "",
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
        const res = await getAllCustomers();
        if (isMounted) {
          if (res.success) setCustomers(res.data);
          else alert(res.message);
        }
      } catch {
        if (isMounted) alert("Müşteri listeleme hatası.");
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
      const res = await getCustomerById(id);
      if (res.success) {
        setForm(res.data);
      } else {
        alert(res.message);
      }
      setSaving(false);
    } else {
      setForm({ customerID: "", companyName: "", contactName: "" });
    }
    setShowModal(true);
  };

  // —— Sil
  const handleDelete = async (id) => {
    if (!window.confirm("Silinsin mi?")) return;
    const res = await deleteCustomer(id);
    if (res.success) {
      // listeyi yenile
      const listRes = await getAllCustomers();
      if (listRes.success) setCustomers(listRes.data);
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
        res = await updateCustomer(form.customerID, {
          companyName: form.companyName,
          contactName: form.contactName,
        });
      } else {
        res = await createCustomer(form);
      }
      if (!res.success) throw new Error(res.message);
      setShowModal(false);
      // listeyi yenile
      const listRes = await getAllCustomers();
      if (listRes.success) setCustomers(listRes.data);
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
        <h2>Müşteri Listesi</h2>
        <Button onClick={() => openModal(null)}>Yeni</Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : customers.length === 0 ? (
        <Alert variant="info">Henüz hiç müşteri yok.</Alert>
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
            {customers.map(c => (
              <tr key={c.customerID}>
                <td>{c.customerID}</td>
                <td>{c.companyName}</td>
                <td>{c.contactName}</td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => openModal(c.customerID)}
                  >
                    <i className="bi bi-pencil-fill" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(c.customerID)}
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
            {selectedId !== null ? "Güncelle" : "Yeni"} Müşteri
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>ID</Form.Label>
              <Form.Control
                name="customerID"
                value={form.customerID}
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
            {saving ? <Spinner size="sm" animation="border" /> : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
