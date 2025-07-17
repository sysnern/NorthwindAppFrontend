// src/components/EmployeeList.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert } from "react-bootstrap";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/EmployeeService";

export default function EmployeeList() {
  const [items,setItems]   = useState([]);
  const [loading,setLoading]= useState(true);
  const [show,setShow]     = useState(false);
  const [saving,setSaving] = useState(false);
  const [form,setForm]     = useState({
    employeeID: "",
    firstName: "",
    lastName: ""
  });
  const [selId,setSelId]   = useState(null);

  useEffect(() => { fetchList() }, []);
  async function fetchList() {
    setLoading(true);
    const r = await getAllEmployees();
    if (r.success) setItems(r.data);
    else alert(r.message);
    setLoading(false);
  }

  async function open(id=null) {
    setSelId(id);
    if (id) {
      setSaving(true);
      const r = await getEmployeeById(id);
      if (!r.success) { alert(r.message); return; }
      setForm(r.data);
      setSaving(false);
    } else {
      setForm({ employeeID:"", firstName:"", lastName:"" });
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
      ? await updateEmployee(form)
      : await createEmployee(form);
    if (!r.success) alert(r.message);
    setShow(false);
    fetchList();
    setSaving(false);
  }

  async function destroy(id) {
    if (!window.confirm("Silinsin mi?")) return;
    const r = await deleteEmployee(id);
    if (!r.success) alert(r.message);
    fetchList();
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Çalışan Listesi</h2>
        <Button onClick={()=>open(null)}>Yeni</Button>
      </div>

      {loading
        ? <div className="text-center"><Spinner/></div>
        : items.length === 0
          ? <Alert variant="info">Henüz hiç çalışan yok.</Alert>
          : <Table striped hover>
              <thead className="table-dark">
                <tr>
                  <th>ID</th><th>Ad Soyad</th><th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(e => (
                  <tr key={e.employeeID}>
                    <td>{e.employeeID}</td>
                    <td>{e.firstName} {e.lastName}</td>
                    <td className="text-end">
                      <Button size="sm" variant="outline-primary" className="me-2"
                        onClick={()=>open(e.employeeID)}>
                        <i className="bi bi-pencil-fill"/>
                      </Button>
                      <Button size="sm" variant="outline-danger"
                        onClick={()=>destroy(e.employeeID)}>
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
          <Modal.Title>{selId ? "Güncelle" : "Yeni"} Çalışan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>ID</Form.Label>
              <Form.Control
                name="employeeID"
                value={form.employeeID}
                disabled={!!selId}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                name="firstName"
                value={form.firstName}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                name="lastName"
                value={form.lastName}
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
