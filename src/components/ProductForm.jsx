import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { getAllCategories } from "../services/CategoryService";

export default function ProductForm({ form, setForm, disabled }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Kategori listesini alıp dropdown'a dolduralım
    (async () => {
      const res = await getAllCategories();
      if (res.success) setCategories(res.data);
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
      <Form.Group className="mb-3">
        <Form.Label>Ürün Adı</Form.Label>
        <Form.Control
          name="productName"
          value={form.productName || ""}
          disabled={disabled}
          onChange={onChange}
        />
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Kategori</Form.Label>
            <Form.Select
              name="categoryID"
              value={form.categoryID || ""}
              disabled={disabled}
              onChange={onChange}
            >
              <option value="">-- Seçiniz --</option>
              {categories.map(c => (
                <option key={c.categoryID} value={c.categoryID}>
                  {c.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Fiyat</Form.Label>
            <Form.Control
              type="number"
              name="unitPrice"
              value={form.unitPrice ?? ""}
              disabled={disabled}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Stok</Form.Label>
            <Form.Control
              type="number"
              name="unitsInStock"
              value={form.unitsInStock ?? ""}
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
          name="discontinued"
          checked={!!form.discontinued}
          disabled={disabled}
          onChange={onChange}
        />
      </Form.Group>
    </Form>
  );
}
