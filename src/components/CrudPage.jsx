// src/components/CrudPage.jsx
import React, { useState, useEffect } from "react";
import {
  Container, Row, Col,
  Card, Badge, Button, ButtonGroup,
  Offcanvas, Form, InputGroup,
  Spinner, Modal, Alert
} from "react-bootstrap";

export default function CrudPage({
  title,
  fetchAll, fetchById, createItem, updateItem, deleteItem,
  filterFields, sortOptions,
  mapItemToId,           // item => unique id
  renderCardBody,        // (item, open, del) => JSX
  renderFormFields       // ({ form, setForm, disabled }) => JSX
}) {
  // — state’ler
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filters, setFilters]     = useState(
    Object.fromEntries(filterFields.map(f => [f.name, ""]))
  );
  const [sortKey, setSortKey]     = useState(sortOptions[0].value);
  const [showFilters, setShowFilters] = useState(false);

  // CRUD modal state
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({});
  const [saving, setSaving]       = useState(false);
  const [selId, setSelId]         = useState(null);

  // Listeyi yükle
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAll(filters);
      setItems(res.success && Array.isArray(res.data) ? res.data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(load, []);

  // Filtreleme
  const onFilter = e => {
    const { name, value, type, checked } = e.target;
    setFilters(f => ({
      ...f,
      [name]: type === "checkbox" ? checked.toString() : value
    }));
  };
  const applyFilters = () => {
    load();
    setShowFilters(false);
  };

  // Sıralama
  const safe   = Array.isArray(items) ? items : [];
  const sorted = [...safe].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return -1;
    if (a[sortKey] > b[sortKey]) return  1;
    return 0;
  });

  // Modal açma (yeni / düzenle)
  const openModal = async id => {
    setSelId(id);
    if (id != null) {
      setSaving(true);
      const r = await fetchById(id);
      if (r.success) setModalForm(r.data);
      setSaving(false);
    } else {
      setModalForm({});
    }
    setShowModal(true);
  };

  // Kaydet (create / update)
  const save = async () => {
    setSaving(true);
    let r;
    if (selId != null) {
      r = await updateItem(modalForm);
    } else {
      r = await createItem(modalForm);
    }
    if (!r.success) alert(r.message);
    setShowModal(false);
    await load();
    setSaving(false);
  };

  // Sil
  const handleDelete = async id => {
    if (!window.confirm("Silinsin mi?")) return;
    const r = await deleteItem(id);
    if (!r.success) alert(r.message);
    else await load();
  };

  return (
    <Container fluid className="py-4">
      {/* Başlık + Yeni Ekle */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">{title}</h2>
        <Button variant="primary" onClick={() => openModal(null)}>
          Yeni {title.slice(0, -1)}
        </Button>
      </div>

      {/* Ara / Filtrele / Sırala */}
      <div className="d-flex align-items-center mb-4 gap-2">
        <InputGroup style={{ maxWidth: 300 }}>
          <Form.Control
            placeholder={`Ara ${title.toLowerCase()}...`}
            name={filterFields[0].name}
            value={filters[filterFields[0].name]}
            onChange={onFilter}
          />
          <Button variant="outline-secondary" onClick={load}>Ara</Button>
        </InputGroup>
        <ButtonGroup>
          <Button variant="outline-primary" onClick={() => setShowFilters(true)}>
            Filtrele
          </Button>
          <Form.Select
            value={sortKey}
            onChange={e => setSortKey(e.target.value)}
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Form.Select>
        </ButtonGroup>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-5"><Spinner/></div>
      ) : sorted.length === 0 ? (
        <Alert variant="info">{title} bulunamadı.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {sorted.map(item => {
            const id = mapItemToId(item);
            return (
              <Col key={id}>
                <Card className="h-100 shadow-sm border-0 rounded-2">
                  <Card.Body className="d-flex flex-column">
                    {renderCardBody(item, openModal, handleDelete)}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Offcanvas: Filtreler */}
      <Offcanvas show={showFilters} placement="end" onHide={() => setShowFilters(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filtreler</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            {filterFields.map(f => (
              <Form.Group className="mb-3" key={f.name}>
                <Form.Label>{f.label}</Form.Label>
                {f.type === "checkbox" ? (
                  <Form.Check
                    type="checkbox"
                    name={f.name}
                    label={f.label}
                    checked={filters[f.name] === "true"}
                    onChange={onFilter}
                  />
                ) : (
                  <Form.Control
                    name={f.name}
                    value={filters[f.name]}
                    onChange={onFilter}
                    placeholder={f.placeholder}
                    type={f.type || "text"}
                  />
                )}
              </Form.Group>
            ))}
            <Button className="w-100" onClick={applyFilters}>Uygula</Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Modal: Yeni / Düzenle Formu */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selId != null ? `${title.slice(0, -1)} Güncelle` : `Yeni ${title.slice(0, -1)} Ekle`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderFormFields ? (
            renderFormFields({ form: modalForm, setForm: setModalForm, disabled: saving })
          ) : (
            <Form>
              {Object.entries(modalForm).map(([k, v]) => (
                <Form.Group className="mb-2" key={k}>
                  <Form.Label>{k}</Form.Label>
                  <Form.Control
                    name={k}
                    value={v}
                    disabled={saving}
                    onChange={e => setModalForm(f => ({ ...f, [k]: e.target.value }))}
                  />
                </Form.Group>
              ))}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" disabled={saving} onClick={() => setShowModal(false)}>
            İptal
          </Button>
          <Button variant="primary" disabled={saving} onClick={save}>
            {saving ? <Spinner size="sm" animation="border"/> : "Kaydet"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
