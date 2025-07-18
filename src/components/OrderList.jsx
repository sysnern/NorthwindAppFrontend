// 📁 src/components/OrderList.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert } from "react-bootstrap";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/OrderService";

export default function OrderList() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({
    orderID: "",
    customerID: "",
    employeeID: "",
    orderDate: "",
  });
  const [selectedId, setSelectedId] = useState(null);

  // —— Listeyi yükle (cleanup‑guard ile)
  useEffect(() => {
    let isMounted = true;
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await getAllOrders();
        if (isMounted) {
          if (res.success) setOrders(res.data);
          else alert(res.message);
        }
      } catch {
        if (isMounted) alert("Sipariş listeleme hatası.");
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
      const res = await getOrderById(id);
      if (res.success) {
        setForm({
          orderID: res.data.orderID,
          customerID: res.data.customerID,
          employeeID: res.data.employeeID,
          orderDate: res.data.orderDate?.slice(0, 10) ?? "",
        });
      } else {
        alert(res.message);
      }
      setSaving(false);
    } else {
      setForm({ orderID: "", customerID: "", employeeID: "", orderDate: "" });
    }
    setShowModal(true);
  };

  // —— Sil
  const handleDelete = async (id) => {
    if (!window.confirm("Silinsin mi?")) return;
    const res = await deleteOrder(id);
    if (res.success) {
      const listRes = await getAllOrders();
      if (listRes.success) setOrders(listRes.data);
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
        res = await updateOrder({
          orderID: form.orderID,
          customerID: form.customerID,
          employeeID: form.employeeID,
          orderDate: form.orderDate,
        });
      } else {
        res = await createOrder(form);
      }
      if (!res.success) throw new Error(res.message);
      setShowModal(false);
      const listRes = await getAllOrders();
      if (listRes.success) setOrders(listRes.data);
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
        <h2>Sipariş Listesi</h2>
        <Button onClick={() => openModal(null)}>Yeni</Button>
      </div>

      {loading ? (
        <div className="text-center"><Spinner /></div>
      ) : orders.length === 0 ? (
        <Alert variant="info">Henüz hiç sipariş yok.</Alert>
      ) : (
        <Table striped hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Employee</th>
              <th>Tarih</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.orderID}>
                <td>{o.orderID}</td>
                <td>{o.customerID}</td>
                <td>{o.employeeID}</td>
                <td>{o.orderDate?.slice(0, 10)}</td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => openModal(o.orderID)}
                  >
                    <i className="bi bi-pencil-fill" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(o.orderID)}
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
            {selectedId !== null ? "Güncelle" : "Yeni"} Sipariş
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>ID</Form.Label>
              <Form.Control
                name="orderID"
                value={form.orderID}
                disabled={!!selectedId || saving}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>CustomerID</Form.Label>
              <Form.Control
                name="customerID"
                value={form.customerID}
                disabled={saving}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>EmployeeID</Form.Label>
              <Form.Control
                name="employeeID"
                value={form.employeeID}
                disabled={saving}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>OrderDate</Form.Label>
              <Form.Control
                type="date"
                name="orderDate"
                value={form.orderDate}
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
