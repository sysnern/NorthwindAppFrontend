import React, { useState, useEffect } from "react";
import {
    Container, Row, Col, Card, Badge, Button, ButtonGroup,
    Offcanvas, Form, InputGroup, Spinner, Modal, Alert
} from "react-bootstrap";

export default function CrudPage({
    title,
    fetchAll,
    fetchById,
    createItem,
    updateItem,
    deleteItem,
    filterFields,
    sortOptions,
    renderCardBody,    // (item, openEdit, handleDelete) => JSX
    mapItemToId,       // item => unique id
}) {
    // --- Genel state’ler
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(
        Object.fromEntries(filterFields.map(f => [f.name, ""]))
    );
    const [sortKey, setSortKey] = useState(sortOptions[0].value);
    const [showFilters, setShowFilters] = useState(false);

    // CRUD modal state
    const [showModal, setShowModal] = useState(false);
    const [modalForm, setModalForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [selId, setSelId] = useState(null);

    // --- Listeyi yükle
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
    useEffect(() => {
        load();
    }, []);

    // --- Filtre değişti
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

    // --- Sıralanmış, güvenli liste
    const safe = Array.isArray(items) ? items : [];
    const sorted = [...safe].sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return -1;
        if (a[sortKey] > b[sortKey]) return 1;
        return 0;
    });

    // --- Modal: Yeni / Düzenle
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

    // --- Kaydet
    const save = async () => {
        setSaving(true);
        const dto = modalForm;
        let r;
        if (selId != null) r = await updateItem(selId, dto);
        else r = await createItem(dto);
        if (!r.success) alert(r.message);
        setShowModal(false);
        await load();
        setSaving(false);
    };

    // --- Sil
    const handleDelete = async id => {
        if (!window.confirm("Silinsin mi?")) return;
        const r = await deleteItem(id);
        if (!r.success) alert(r.message);
        else await load();
    };

    return (
        <Container fluid className="py-4">
            {/* HEADER */}
            <header className="d-flex align-items-center justify-content-between mb-4">
                <h1 className="m-0">{title}</h1>

                <InputGroup style={{ maxWidth: 300 }}>
                    <Form.Control
                        placeholder={`Ara ${title.toLowerCase()}...`}
                        name={filterFields[0].name}
                        value={filters[filterFields[0].name]}
                        onChange={onFilter}
                    />
                    <Button variant="outline-secondary" onClick={load}>
                        Ara
                    </Button>
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
            </header>

            {/* BODY */}
            {loading ? (
                <div className="text-center py-5"><Spinner /></div>
            ) : safe.length === 0 ? (
                <Alert variant="warning">{title} bulunamadı.</Alert>
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

            {/* OFFCANVAS FILTER */}
            <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
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
                        <Button className="w-100" onClick={applyFilters}>
                            Uygula
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* MODAL CRUD */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selId != null ? `${title} Güncelle` : `Yeni ${title} Ekle`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Burada sizin kendi form component’inizi render edebilirsiniz.
              Örnek: <CategoryForm form={modalForm} setForm={setModalForm} disabled={saving}/> */}
                    {/* Ama eğer kısa kod istiyorsanız: */}
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={saving} onClick={() => setShowModal(false)}>
                        İptal
                    </Button>
                    <Button variant="primary" disabled={saving} onClick={save}>
                        {saving ? <Spinner size="sm" animation="border" /> : "Kaydet"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
