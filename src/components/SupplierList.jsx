// src/components/SupplierList.jsx
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
  const [items, setItems] = useState([]);
  const [loading,setLoading] = useState(true);
  const [show,   setShow]    = useState(false);
  const [saving, setSaving]  = useState(false);
  const [form,   setForm]    = useState({
    supplierID: "",
    companyName: "",
    contactName: ""
  });
  const [selId, setSelId]    = useState(null);

  useEffect(() => { fetchList() }, []);
  async function fetchList() {
    setLoading(true);
    const res = await getAllSuppliers();
    if (res.success) setItems(res.data);
    else alert(res.message);
    setLoading(false);
  }

  async function open(id=null) {
    setSelId(id);
    if (id) {
      setSaving(true);
      const r = await getSupplierById(id);
      if (!r.success) { alert(r.message); return; }
      setForm(r.data);
      setSaving(false);
    } else {
      setForm({ supplierID:"", companyName:"", contactName:"" });
    }
    setShow(true);
  }

  function onChange(e) {
    const { name,value } = e.target;
    setForm(f => ({ ...f, [name]:value }));
  }

  async function save() {
    setSaving(true);
    const r = selId
      ? await updateSupplier(form)
      : await createSupplier(form);
    if (!r.success) alert(r.message);
    setShow(false);
    fetchList();
    setSaving(false);
  }

  async function destroy(id) {
    if (!window.confirm("Silinsin mi?")) return;
    const r = await deleteSupplier(id);
    if (!r.success) alert(r.message);
    fetchList();
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Tedarikçi Listesi</h2>
        <Button onClick={()=>open(null)}>Yeni</Button>
      </div>

      {loading
        ? <div className="text-center"><Spinner/></div>
        : items.length === 0
          ? <Alert variant="info">Henüz hiç tedarikçi yok.</Alert>
          : <Table striped hover>
              <thead className="table-dark">
                <tr>
                  <th>ID</th><th>Şirket</th><th>İletişim</th><th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(s => (
                  <tr key={s.supplierID}>
                    <td>{s.supplierID}</td>
                    <td>{s.companyName}</td>
                    <td>{s.contactName}</td>
                    <td className="text-end">
                      <Button size="sm" variant="outline-primary" className="me-2"
                        onClick={()=>open(s.supplierID)}>
                        <i className="bi bi-pencil-fill"/>
                      </Button>
                      <Button size="sm" variant="outline-danger"
                        onClick={()=>destroy(s.supplierID)}>
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
          <Modal.Title>{selId ? "Güncelle" : "Yeni"} Tedarikçi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>ID</Form.Label>
              <Form.Control
                name="supplierID"
                value={form.supplierID}
                disabled={!!selId}
                onChange={onChange}
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
