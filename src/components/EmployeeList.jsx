// 📁 src/components/EmployeeList.jsx
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
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    employeeID: "",
    firstName: "",
    lastName: "",
  });
  const [selectedId, setSelectedId] = useState(null);

  // —— Listeyi yükle (cleanup guard ile) ——
  useEffect(() => {
    let isMounted = true;
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await getAllEmployees();
        if (isMounted) {
          if (res.success) setEmployees(res.data);
          else alert(res.message);
        }
      } catch {
        if (isMounted) alert("Listeleme hatası.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchList();
    return () => {
      isMounted = false;
    };
  }, []);

  // —— Modal’i aç (Yeni veya Düzenle) ——
  const openModal = async (id = null) => {
    setSelectedId(id);
    if (id) {
      setSaving(true);
      const res = await getEmployeeById(id);
      if (res.success) setForm(res.data);
      else alert(res.message);
      setSaving(false);
    } else {
      setForm({ employeeID: "", firstName: "", lastName: "" });
    }
    setShowModal(true);
  };

  // —— Sil ——
  const handleDelete = async (id) => {
    if (!window.confirm("Silinsin mi?")) return;
    const res = await deleteEmployee(id);
    if (res.success) {
      // listeyi yeniden yükle
      const listRes = await getAllEmployees();
      if (listRes.success) setEmployees(listRes.data);
      else alert(listRes.message);
    } else {
      alert(res.message);
    }
  };

  // —— Kaydet (Yeni / Güncelle) ——
  const handleSave = async () => {
    setSaving(true);
    try {
      let res;
      if (selectedId) {
        // güncelleme: önce id sonra dto
        res = await updateEmployee(selectedId, form);
      } else {
        // yeni kayıt
        res = await createEmployee(form);
      }
      if (!res.success) throw new Error(res.message);
      setShowModal(false);
      // listeyi yeniden yükle
      const listRes = await getAllEmployees();
      if (listRes.success) setEmployees(listRes.data);
      else alert(listRes.message);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // —— Form input değişimi ——
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Çalışan Listesi</h2>
        <Button onClick={() => openModal(null)}>Yeni</Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : employees.length === 0 ? (
        <Alert variant="info">Henüz hiç çalışan yok.</Alert>
      ) : (
        <Table striped hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Ad Soyad</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employeeID}>
                <td>{emp.employeeID}</td>
                <td>
                  {emp.firstName} {emp.lastName}
                </td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => openModal(emp.employeeID)}
                  >
                    <i className="bi bi-pencil-fill" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(emp.employeeID)}
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
            {selectedId ? "Güncelle" : "Yeni"} Çalışan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>ID</Form.Label>
              <Form.Control
                name="employeeID"
                value={form.employeeID}
                disabled={!!selectedId}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
