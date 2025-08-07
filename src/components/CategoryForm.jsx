import React from "react";
import { Form, Row, Col } from "react-bootstrap";

export default function CategoryForm({ form, setForm, disabled }) {

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
        <Form.Label>Kategori Adı</Form.Label>
        <Form.Control
          name="categoryName"
          value={form.categoryName || ""}
          disabled={disabled}
          onChange={onChange}
        />
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Açıklama</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description || ""}
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