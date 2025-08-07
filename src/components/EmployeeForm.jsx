import React from "react";
import { Form, Row, Col } from "react-bootstrap";

export default function EmployeeForm({ form, setForm, disabled }) {

  const onChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ 
      ...f, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Ad Soyad</Form.Label>
        <Form.Control
          name="firstName"
          value={form.firstName || ""}
          disabled={disabled}
          onChange={onChange}
          placeholder="Ad"
        />
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Ad</Form.Label>
            <Form.Control
              name="firstName"
              value={form.firstName || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Soyad</Form.Label>
            <Form.Control
              name="lastName"
              value={form.lastName || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>İş Başlığı</Form.Label>
            <Form.Control
              name="title"
              value={form.title || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Doğum Tarihi</Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              value={form.birthDate || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Adres</Form.Label>
            <Form.Control
              name="address"
              value={form.address || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Şehir</Form.Label>
            <Form.Control
              name="city"
              value={form.city || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Ülke</Form.Label>
            <Form.Control
              name="country"
              value={form.country || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Telefon</Form.Label>
            <Form.Control
              name="homePhone"
              value={form.homePhone || ""}
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