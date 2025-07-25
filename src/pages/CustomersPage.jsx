// src/pages/CustomersPage.jsx
import React from "react";
import { Card, Button, Form } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../services/CustomerService";

export default function CustomersPage() {
  return (
    <CrudPage
      title="Müşteriler"
      fetchAll={getAllCustomers}
      fetchById={getCustomerById}
      createItem={createCustomer}
      updateItem={updateCustomer}
      deleteItem={deleteCustomer}

      filterFields={[
        { name: "companyName", label: "Şirket", placeholder: "Şirket Adı" }
      ]}

      sortOptions={[
        { value: "customerID",  label: "ID (Artan)" },
        { value: "companyName", label: "Şirket (A–Z)" }
      ]}

      mapItemToId={c => c.customerID}

      renderCardBody={(c, open, del) => (
        <>
          <Card.Title className="mb-2 text-truncate">
            {c.companyName}
          </Card.Title>
          <div className="text-muted mb-3">{c.contactName}</div>
          <div className="mt-auto d-flex justify-content-between">
            <Button size="sm" variant="outline-primary" onClick={()=>open(c.customerID)}>
              Düzenle
            </Button>
            <Button size="sm" variant="outline-danger" onClick={()=>del(c.customerID)}>
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
              name="customerID"
              value={form.customerID || ""}
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
