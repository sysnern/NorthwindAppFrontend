// src/pages/OrdersPage.jsx
import React from "react";
import { Card, Button, Form } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from "../services/OrderService";

export default function OrdersPage() {
  return (
    <CrudPage
      title="Siparişler"
      fetchAll={getAllOrders}
      fetchById={getOrderById}
      createItem={createOrder}
      updateItem={updateOrder}
      deleteItem={deleteOrder}

      filterFields={[
        { name: "customerID", label: "Müşteri ID", placeholder: "Müşteri ID" }
      ]}

      sortOptions={[
        { value: "orderID",    label: "ID (Artan)" },
        { value: "orderDate",  label: "Tarih (Artan)" }
      ]}

      mapItemToId={o => o.orderID}

      renderCardBody={(o, open, del) => (
        <>
          <Card.Title className="mb-2 text-truncate">
            #{o.orderID} — {o.customerID}
          </Card.Title>
          <div className="text-muted mb-3">
            {o.orderDate?.slice(0,10)}
          </div>
          <div className="mt-auto d-flex justify-content-between">
            <Button size="sm" variant="outline-primary" onClick={()=>open(o.orderID)}>
              Düzenle
            </Button>
            <Button size="sm" variant="outline-danger" onClick={()=>del(o.orderID)}>
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
              name="orderID"
              value={form.orderID || ""}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Müşteri ID</Form.Label>
            <Form.Control
              name="customerID"
              value={form.customerID || ""}
              onChange={e => setForm(f => ({ ...f, customerID: e.target.value }))}
              disabled={disabled}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Çalışan ID</Form.Label>
            <Form.Control
              name="employeeID"
              value={form.employeeID || ""}
              onChange={e => setForm(f => ({ ...f, employeeID: e.target.value }))}
              disabled={disabled}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Sipariş Tarihi</Form.Label>
            <Form.Control
              type="date"
              name="orderDate"
              value={form.orderDate?.slice(0,10) || ""}
              onChange={e => setForm(f => ({ ...f, orderDate: e.target.value }))}
              disabled={disabled}
            />
          </Form.Group>
        </Form>
      )}
    />
  );
}
