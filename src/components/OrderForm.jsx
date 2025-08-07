import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { getAllCustomers } from "../services/CustomerService";
import { getAllEmployees } from "../services/EmployeeService";

export default function OrderForm({ form, setForm, disabled }) {
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Dropdown listelerini yükle
    (async () => {
      const [customersRes, employeesRes] = await Promise.all([
        getAllCustomers(),
        getAllEmployees()
      ]);
      
      if (customersRes.success) setCustomers(customersRes.data);
      if (employeesRes.success) setEmployees(employeesRes.data);
    })();
  }, []);

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ 
      ...f, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  return (
    <Form>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Müşteri</Form.Label>
            <Form.Select
              name="customerId"
              value={form.customerId || ""}
              disabled={disabled}
              onChange={onChange}
            >
              <option value="">-- Müşteri Seçiniz --</option>
              {customers.map(c => (
                <option key={c.customerId} value={c.customerId}>
                  {c.companyName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Çalışan</Form.Label>
            <Form.Select
              name="employeeId"
              value={form.employeeId || ""}
              disabled={disabled}
              onChange={onChange}
            >
              <option value="">-- Çalışan Seçiniz --</option>
              {employees.map(e => (
                <option key={e.employeeId} value={e.employeeId}>
                  {e.firstName} {e.lastName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Sipariş Tarihi</Form.Label>
            <Form.Control
              type="date"
              name="orderDate"
              value={form.orderDate || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Gönderim Tarihi</Form.Label>
            <Form.Control
              type="date"
              name="shippedDate"
              value={form.shippedDate || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Gönderim Adresi</Form.Label>
            <Form.Control
              name="shipAddress"
              value={form.shipAddress || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Gönderim Şehri</Form.Label>
            <Form.Control
              name="shipCity"
              value={form.shipCity || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Gönderim Ülkesi</Form.Label>
            <Form.Control
              name="shipCountry"
              value={form.shipCountry || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Nakliye Ücreti</Form.Label>
            <Form.Control
              type="number"
              name="freight"
              value={form.freight || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="Pasif"
          name="isDeleted"
          checked={!!form.isDeleted}
          disabled={disabled}
          onChange={onChange}
        />
      </Form.Group>
    </Form>
  );
}
      
