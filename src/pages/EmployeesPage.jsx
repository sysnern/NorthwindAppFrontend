// src/pages/EmployeesPage.jsx
import React from "react";
import { Card, Button, Form } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../services/EmployeeService";

export default function EmployeesPage() {
  return (
    <CrudPage
      title="Çalışanlar"
      fetchAll={getAllEmployees}
      fetchById={getEmployeeById}
      createItem={createEmployee}
      updateItem={updateEmployee}
      deleteItem={deleteEmployee}

      filterFields={[
        { name: "lastName", label: "Soyad", placeholder: "Soyad" }
      ]}

      sortOptions={[
        { value: "employeeID", label: "ID (Artan)" },
        { value: "lastName",   label: "Soyad (A–Z)" }
      ]}

      mapItemToId={e => e.employeeID}

      renderCardBody={(e, open, del) => (
        <>
          <Card.Title className="mb-2 text-truncate">
            {e.firstName} {e.lastName}
          </Card.Title>
          <div className="mt-auto d-flex justify-content-between">
            <Button size="sm" variant="outline-primary" onClick={()=>open(e.employeeID)}>
              Düzenle
            </Button>
            <Button size="sm" variant="outline-danger" onClick={()=>del(e.employeeID)}>
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
              name="employeeID"
              value={form.employeeID || ""}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Ad</Form.Label>
            <Form.Control
              name="firstName"
              value={form.firstName || ""}
              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
              disabled={disabled}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Soyad</Form.Label>
            <Form.Control
              name="lastName"
              value={form.lastName || ""}
              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
              disabled={disabled}
            />
          </Form.Group>
        </Form>
      )}
    />
  );
}
