// src/components/OrderList.jsx
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
  const [items,setItems]   = useState([]);
  const [loading,setLoading]= useState(true);
  const [show,setShow]     = useState(false);
  const [saving,setSaving] = useState(false);
  const [form,setForm]     = useState({
    orderID: "",
    customerID: "",
    employeeID: "",
    orderDate: ""
  });
  const [selId,setSelId]   = useState(null);

  useEffect(() => { fetchList() }, []);
  async function fetchList() {
    setLoading(true);
    const r = await getAllOrders();
    if (r.success) setItems(r.data);
    else alert(r.message);
    setLoading(false);
  }

  async function open(id=null) {
    setSelId(id);
    if (id) {
      setSaving(true);
      const r = await getOrderById(id);
      if (!r.success) { alert(r.message); return; }
      setForm({
        orderID:    r.data.orderID,
        customerID: r.data.customerID,
        employeeID: r.data.employeeID,
        orderDate:  r.data.orderDate?.slice(0,10) || ""
      });
      setSaving(false);
    } else {
      setForm({ orderID:"",customerID:"",employeeID:"",orderDate:"" });
    }
    setShow(true);
  }

  function onChange(e) {
    const { name,value } = e.target;
    setForm(f=>({...f,[name]:value}));
  }

  async function save() {
    setSaving(true);
    let r;
    if (selId) r = await updateOrder(form);
    else       r = await createOrder(form);
    if (!r.success) alert(r.message);
    setShow(false);
    fetchList();
    setSaving(false);
  }

  async function destroy(id) {
    if (!window.confirm("Silinsin mi?")) return;
    const r = await deleteOrder(id);
    if (!r.success) alert(r.message);
    fetchList();
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Sipariş Listesi</h2>
        <Button onClick={()=>open(null)}>Yeni</Button>
      </div>

      {loading
        ? <div className="text-center"><Spinner/></div>
        : items.length === 0
          ? <Alert variant="info">Henüz hiç sipariş yok.</Alert>
          : <Table striped hover>
              <thead className="table-dark">
                <tr>
                  <th>ID</th><th>Customer</th><th>Employee</th><th>Tarih</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(o=>(
                  <tr key={o.orderID}>
                    <td>{o.orderID}</td>
                    <td>{o.customerID}</td>
                    <td>{o.employeeID}</td>
                    <td>{o.orderDate?.slice(0,10)}</td>
                    <td className="text-end">
                      <Button size="sm" variant="outline-primary" className="me-2"
                        onClick={()=>open(o.orderID)}>
                        <i className="bi bi-pencil-fill"/>
                      </Button>
                      <Button size="sm" variant="outline-danger"
                        onClick={()=>destroy(o.orderID)}>
                        <i className="bi bi-trash-fill"/>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
      }

      <Modal show={show} onHide={()=>setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selId? "Güncelle":"Yeni"} Sipariş</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>ID</Form.Label>
              <Form.Control
                name="orderID"
                value={form.orderID}
                disabled={!!selId}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>CustomerID</Form.Label>
              <Form.Control
                name="customerID"
                value={form.customerID}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>EmployeeID</Form.Label>
              <Form.Control
                name="employeeID"
                value={form.employeeID}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>OrderDate</Form.Label>
              <Form.Control
                type="date"
                name="orderDate"
                value={form.orderDate}
                onChange={onChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)}>İptal</Button>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving? <Spinner size="sm" animation="border"/> : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
