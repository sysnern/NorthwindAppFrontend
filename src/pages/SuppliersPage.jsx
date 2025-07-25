// src/pages/SuppliersPage.jsx
import React from "react";
import { Card, Button, Form } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../services/SupplierService";

export default function SuppliersPage() {
  return (
    <CrudPage
      title="Tedarikçiler"
      fetchAll={getAllSuppliers}
      fetchById={getSupplierById}
      createItem={createSupplier}
      updateItem={updateSupplier}
      deleteItem={deleteSupplier}

      filterFields={[
        { name: "companyName", label: "Şirket", placeholder: "Şirket Adı" }
      ]}

      sortOptions={[
        { value: "supplierID",  label: "ID (Artan)" },
        { value: "companyName", label: "Şirket (A–Z)" }
      ]}

      mapItemToId={s => s.supplierID}

      renderCardBody={(s, open, del) => (
        <>
          <Card.Title className="mb-2 text-truncate">
            {s.companyName}
          </Card.Title>
          <div className="text-muted mb-3">{s.contactName}</div>
          <div className="mt-auto d-flex justify-content-between">
            <Button size="sm" variant="outline-primary" onClick={()=>open(s.supplierID)}>
              Düzenle
            </Button>
            <Button size="sm" variant="outline-danger" onClick={()=>del(s.supplierID)}>
              Sil
            </Button>
          </div>
        </>
      )}

      renderFormFields={({ form, setForm, disabled }) => (
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>ID</Form.Label>
            <Form.Control
              name="supplierID"
              value={form.supplierID || ""}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Şirket</Form.Label>
            <Form.Control
              name="companyName"
              value={form.companyName || ""}
              onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
              disabled={disabled}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>İletişim</Form.Label>
            <Form.Control
              name="contactName"
              value={form.contactName || ""}
              onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
              disabled={disabled}
            />
          </Form.Group>
        </Form>
      )}
    />
  );
}
