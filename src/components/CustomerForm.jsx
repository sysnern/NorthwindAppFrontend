import React from "react";
import { Form, Row, Col } from "react-bootstrap";

export default function CustomerForm({ form, setForm, disabled }) {

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
        <Form.Label>Şirket Adı</Form.Label>
        <Form.Control
          name="companyName"
          value={form.companyName || ""}
          disabled={disabled}
          onChange={onChange}
        />
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>İletişim Kişisi</Form.Label>
            <Form.Control
              name="contactName"
              value={form.contactName || ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>İletişim Başlığı</Form.Label>
            <Form.Control
              name="contactTitle"
              value={form.contactTitle || ""}
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
              name="phone"
              value={form.phone || ""}
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