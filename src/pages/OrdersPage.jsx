import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Table,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/OrderService";
import { getAllCustomers } from "../services/CustomerService";
import { getAllEmployees } from "../services/EmployeeService";

const OrderSchema = Yup.object().shape({
  customerId: Yup.string()
    .required("Müşteri seçimi zorunlu"),
  employeeId: Yup.number()
    .min(1, "Çalışan seçimi zorunlu")
    .required("Çalışan seçimi zorunlu"),
  orderDate: Yup.date()
    .required("Sipariş tarihi zorunlu"),
});

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // fetch orders + lookup data
  const loadAll = async () => {
    setLoading(true);
    try {
      const [oRes, cRes, eRes] = await Promise.all([
        getAllOrders(),
        getAllCustomers(),
        getAllEmployees(),
      ]);
      if (!oRes.success) throw new Error(oRes.message);
      if (!cRes.success) throw new Error(cRes.message);
      if (!eRes.success) throw new Error(eRes.message);

      setOrders(oRes.data);
      setCustomers(cRes.data);
      setEmployees(eRes.data);
    } catch (err) {
      toast.error(err.message || "Veriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openAddModal = () => {
    setSelectedOrder(null);
    setSelectedId(null);
    setShowModal(true);
  };
  const openEditModal = async (id) => {
    try {
      const res = await getOrderById(id);
      if (!res.success) throw new Error(res.message);
      setSelectedOrder(res.data);
      setSelectedId(res.data.orderId);
      setShowModal(true);
    } catch (err) {
      toast.error(err.message || "Sipariş bilgileri alınırken hata oluştu");
    }
  };

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setSelectedId(order.orderId);
    setShowDeleteModal(true);
  };
  const handleDelete = async () => {
    try {
      const res = await deleteOrder(selectedId);
      if (!res.success) throw new Error(res.message);
      toast.success("Sipariş başarıyla silindi");
      setShowDeleteModal(false);
      loadAll();
    } catch (err) {
      toast.error(err.message || "Silme işlemi sırasında hata oluştu");
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let res;
      if (selectedId) {
        res = await updateOrder({ orderId: selectedId, ...values });
      } else {
        res = await createOrder(values);
      }
      if (!res.success) throw new Error(res.message);
      toast.success(
        selectedId
          ? "Sipariş başarıyla güncellendi"
          : "Sipariş başarıyla eklendi"
      );
      setShowModal(false);
      resetForm();
      loadAll();
    } catch (err) {
      toast.error(err.message || "İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = selectedOrder
    ? {
        customerId: selectedOrder.customerId || "",
        employeeId: selectedOrder.employeeId || "",
        orderDate: selectedOrder.orderDate?.slice(0, 10) || "",
      }
    : {
        customerId: "",
        employeeId: "",
        orderDate: "",
      };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Sipariş Yönetimi</h2>
        <Button variant="primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2" />
          Yeni Sipariş
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : orders.length === 0 ? (
        <Alert variant="info" className="text-center">
          Henüz hiç sipariş yok.
        </Alert>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Müşteri</th>
                  <th>Çalışan</th>
                  <th>Sipariş Tarihi</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.orderId}>
                    <td>{o.orderId}</td>
                    <td>
                      {o.customerId} —{" "}
                      {customers.find(c => c.customerId === o.customerId)
                        ?.companyName}
                    </td>
                    <td>
                      {o.employeeId} —{" "}
                      {employees.find(e => e.employeeId === o.employeeId)
                        ? `${employees.find(e => e.employeeId === o.employeeId).firstName} ${employees.find(e => e.employeeId === o.employeeId).lastName}`
                        : ""}
                    </td>
                    <td>{o.orderDate?.slice(0, 10)}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEditModal(o.orderId)}
                      >
                        <i className="bi bi-pencil-fill" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(o)}
                      >
                        <i className="bi bi-trash-fill" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? "Sipariş Güncelle" : "Yeni Sipariş Ekle"}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={OrderSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Müşteri *</Form.Label>
                      <Form.Select
                        name="customerId"
                        value={values.customerId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.customerId && errors.customerId}
                      >
                        <option value="">Seçiniz…</option>
                        {customers.map((c) => (
                          <option key={c.customerId} value={c.customerId}>
                            {c.customerId} — {c.companyName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.customerId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Çalışan *</Form.Label>
                      <Form.Select
                        name="employeeId"
                        value={values.employeeId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.employeeId && errors.employeeId}
                      >
                        <option value="">Seçiniz…</option>
                        {employees.map((e) => (
                          <option key={e.employeeId} value={e.employeeId}>
                            {e.firstName} {e.lastName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.employeeId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Sipariş Tarihi *</Form.Label>
                      <Form.Control
                        name="orderDate"
                        type="date"
                        value={values.orderDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.orderDate && errors.orderDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.orderDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  İptal
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Kaydediliyor…
                    </>
                  ) : selectedId ? (
                    "Güncelle"
                  ) : (
                    "Kaydet"
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Sipariş Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <i
            className="bi bi-exclamation-triangle text-warning"
            style={{ fontSize: "3rem" }}
          />
          <h5 className="mt-3">Emin misiniz?</h5>
          <p className="text-muted">
            #{selectedOrder?.orderId} numaralı siparişi silmek istediğinizden
            emin misiniz? Bu işlem geri alınamaz.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <i className="bi bi-trash-fill me-2" />
            Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
