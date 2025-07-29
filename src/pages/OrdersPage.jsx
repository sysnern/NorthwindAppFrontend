import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert, Row, Col } from "react-bootstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/OrderService";

const OrderSchema = Yup.object().shape({
  customerID: Yup.string()
    .min(2, 'Müşteri ID en az 2 karakter olmalı')
    .required('Müşteri ID zorunlu'),
  employeeID: Yup.number()
    .min(1, 'Çalışan ID geçerli olmalı')
    .required('Çalışan ID zorunlu'),
  orderDate: Yup.date()
    .required('Sipariş tarihi zorunlu')
});

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Listeyi yükle
  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      if (res.success) {
        setOrders(res.data);
      } else {
        toast.error(res.message || "Siparişler yüklenirken hata oluştu");
      }
    } catch (e) {
      toast.error("Siparişler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Yeni sipariş ekleme modalını aç
  const openAddModal = () => {
    setSelectedOrder(null);
    setSelectedId(null);
    setShowModal(true);
  };

  // Düzenleme modalını aç
  const openEditModal = async (id) => {
    try {
      const res = await getOrderById(id);
      if (res.success) {
        setSelectedOrder(res.data);
        setSelectedId(id);
        setShowModal(true);
      } else {
        toast.error(res.message || "Sipariş bilgileri alınırken hata oluştu");
      }
    } catch (e) {
      toast.error("Sipariş bilgileri alınırken hata oluştu");
    }
  };

  // Silme modalını aç
  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  // Sipariş kaydetme
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let res;
      if (selectedId) {
        res = await updateOrder({ ...values, orderID: selectedId });
      } else {
        res = await createOrder(values);
      }

      if (res.success) {
        toast.success(selectedId ? "Sipariş başarıyla güncellendi" : "Sipariş başarıyla eklendi");
        setShowModal(false);
        resetForm();
        loadOrders();
      } else {
        toast.error(res.message || "İşlem sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Sipariş silme
  const handleDelete = async () => {
    try {
      const res = await deleteOrder(selectedOrder.orderID);
      if (res.success) {
        toast.success("Sipariş başarıyla silindi");
        setShowDeleteModal(false);
        loadOrders();
      } else {
        toast.error(res.message || "Silme işlemi sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("Silme işlemi sırasında hata oluştu");
    }
  };

  const initialValues = selectedOrder ? {
    customerID: selectedOrder.customerID || "",
    employeeID: selectedOrder.employeeID || "",
    orderDate: selectedOrder.orderDate?.slice(0, 10) || ""
  } : {
    customerID: "",
    employeeID: "",
    orderDate: ""
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Sipariş Yönetimi</h2>
        <Button variant="primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Yeni Sipariş
        </Button>
      </div>

      {/* Sipariş Listesi */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </Spinner>
        </div>
      ) : orders.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          Henüz hiç sipariş yok.
        </Alert>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Müşteri ID</th>
                  <th>Çalışan ID</th>
                  <th>Sipariş Tarihi</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.orderID}>
                    <td>{o.orderID}</td>
                    <td>{o.customerID}</td>
                    <td>{o.employeeID}</td>
                    <td>{o.orderDate?.slice(0, 10)}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEditModal(o.orderID)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(o)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Sipariş Ekleme/Düzenleme Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? 'Sipariş Güncelle' : 'Yeni Sipariş Ekle'}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={OrderSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Müşteri ID *</Form.Label>
                      <Form.Control
                        name="customerID"
                        value={values.customerID}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.customerID && errors.customerID}
                        disabled={isSubmitting}
                        placeholder="Müşteri ID giriniz"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.customerID}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Çalışan ID *</Form.Label>
                      <Form.Control
                        name="employeeID"
                        type="number"
                        value={values.employeeID}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.employeeID && errors.employeeID}
                        disabled={isSubmitting}
                        placeholder="Çalışan ID giriniz"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.employeeID}
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
                        disabled={isSubmitting}
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
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Kaydediliyor...
                    </>
                  ) : (
                    selectedId ? 'Güncelle' : 'Kaydet'
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Silme Onay Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sipariş Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3">Emin misiniz?</h5>
            <p className="text-muted">
              <strong>#{selectedOrder?.orderID}</strong> numaralı siparişi silmek istediğinizden emin misiniz? 
              Bu işlem geri alınamaz.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <i className="bi bi-trash-fill me-2"></i>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}