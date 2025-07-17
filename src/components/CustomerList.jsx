// src/components/CustomerList.jsx
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
  const [items, setItems] = useState([]);
  const [loading,setLoading] = useState(true);
  const [show,   setShow]    = useState(false);
  const [saving, setSaving]  = useState(false);
  const [form,   setForm]    = useState({
    customerID: "",
    companyName: "",
    contactName: ""
  });
  const [selId, setSelId]    = useState(null);

  useEffect(() => { fetchList() }, []);
  async function fetchList() {
    setLoading(true);
    const res = await getAllCustomers();
    if (res.success) setItems(res.data);
    else alert(res.message);
    setLoading(false);
  }

  async function open(id=null) {
    setSelId(id);
    if (id) {
      setSaving(true);
      const r = await getCustomerById(id);
      if (!r.success) { alert(r.message); return; }
      setForm(r.data);
      setSaving(false);
    } else {
      setForm({ customerID:"", companyName:"", contactName:"" });
    }
    setShow(true);
  }

  function onChange(e) {
    const { name,value } = e.target;
    setForm(f => ({ ...f, [name]:value }));
  }

  async function save() {
    setSaving(true);
    let res;
    if (selId) res = await updateCustomer(form);
    else       res = await createCustomer(form);
    if (!res.success) alert(res.message);
    setShow(false);
    fetchList();
    setSaving(false);
  }

  async function destroy(id) {
    if (!window.confirm("Silinsin mi?")) return;
    const r = await deleteCustomer(id);
    if (!r.success) alert(r.message);
    fetchList();
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Müşteri Listesi</h2>
        <Button onClick={()=>open(null)}>Yeni</Button>
      </div>

      {loading
        ? <div className="text-center"><Spinner/></div>
        : items.length === 0
          ? <Alert variant="info">Henüz hiç müşteri yok.</Alert>
          : <Table striped hover>
              <thead className="table-dark">
                <tr>
                  <th>ID</th><th>Şirket</th><th>İletişim</th><th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(c => (
                  <tr key={c.customerID}>
                    <td>{c.customerID}</td>
                    <td>{c.companyName}</td>
                    <td>{c.contactName}</td>
                    <td className="text-end">
                      <Button size="sm" variant="outline-primary" className="me-2"
                        onClick={()=>open(c.customerID)}>
                        <i className="bi bi-pencil-fill"/>
                      </Button>
                      <Button size="sm" variant="outline-danger"
                        onClick={()=>destroy(c.customerID)}>
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
          <Modal.Title>{selId ? "Güncelle" : "Yeni"} Müşteri</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>ID</Form.Label>
              <Form.Control
                name="customerID"
                value={form.customerID}
                onChange={onChange}
                disabled={!!selId}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Şirket</Form.Label>
              <Form.Control
                name="companyName"
                value={form.companyName}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>İletişim</Form.Label>
              <Form.Control
                name="contactName"
                value={form.contactName}
                onChange={onChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)}>İptal</Button>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? <Spinner size="sm" animation="border"/> : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
  