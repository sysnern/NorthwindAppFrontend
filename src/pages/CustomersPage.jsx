import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert, Row, Col } from "react-bootstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/CustomerService";

const CustomerSchema = Yup.object().shape({
  companyName: Yup.string()
    .min(2, 'Şirket adı en az 2 karakter olmalı')
    .max(100, 'Şirket adı en fazla 100 karakter olabilir')
    .required('Şirket adı zorunlu'),
  contactName: Yup.string()
    .min(2, 'İletişim adı en az 2 karakter olmalı')
    .max(50, 'İletişim adı en fazla 50 karakter olabilir')
    .required('İletişim adı zorunlu')
});

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Listeyi yükle
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await getAllCustomers();
      if (res.success) {
        setCustomers(res.data);
      } else {
        toast.error(res.message || "Müşteriler yüklenirken hata oluştu");
      }
    } catch (e) {
      toast.error("Müşteriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Yeni müşteri ekleme modalını aç
  const openAddModal = () => {
    setSelectedCustomer(null);
    setSelectedId(null);
    setShowModal(true);
  };

  // Düzenleme modalını aç
  const openEditModal = async (id) => {
    try {
      const res = await getCustomerById(id);
      if (res.success) {
        setSelectedCustomer(res.data);
        setSelectedId(id);
        setShowModal(true);
      } else {
        toast.error(res.message || "Müşteri bilgileri alınırken hata oluştu");
      }
    } catch (e) {
      toast.error("Müşteri bilgileri alınırken hata oluştu");
    }
  };

  // Silme modalını aç
  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  // Müşteri kaydetme
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let res;
      if (selectedId) {
        res = await updateCustomer({ ...values, customerID: selectedId });
      } else {
        res = await createCustomer(values);
      }

      if (res.success) {
        toast.success(selectedId ? "Müşteri başarıyla güncellendi" : "Müşteri başarıyla eklendi");
        setShowModal(false);
        resetForm();
        loadCustomers();
      } else {
        toast.error(res.message || "İşlem sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Müşteri silme
  const handleDelete = async () => {
    try {
      const res = await deleteCustomer(selectedCustomer.customerID);
      if (res.success) {
        toast.success("Müşteri başarıyla silindi");
        setShowDeleteModal(false);
        loadCustomers();
      } else {
        toast.error(res.message || "Silme işlemi sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("Silme işlemi sırasında hata oluştu");
    }
  };

  const initialValues = selectedCustomer ? {
    companyName: selectedCustomer.companyName || "",
    contactName: selectedCustomer.contactName || ""
  } : {
    companyName: "",
    contactName: ""
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Müşteri Yönetimi</h2>
        <Button variant="primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Yeni Müşteri
        </Button>
      </div>

      {/* Müşteri Listesi */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </Spinner>
        </div>
      ) : customers.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          Henüz hiç müşteri yok.
        </Alert>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Şirket Adı</th>
                  <th>İletişim Kişisi</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.customerID}>
                    <td>{c.customerID}</td>
                    <td>{c.companyName}</td>
                    <td>{c.contactName}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEditModal(c.customerID)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(c)}
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

      {/* Müşteri Ekleme/Düzenleme Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? 'Müşteri Güncelle' : 'Yeni Müşteri Ekle'}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={CustomerSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Şirket Adı *</Form.Label>
                      <Form.Control
                        name="companyName"
                        value={values.companyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.companyName && errors.companyName}
                        disabled={isSubmitting}
                        placeholder="Şirket adını giriniz"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.companyName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>İletişim Kişisi *</Form.Label>
                      <Form.Control
                        name="contactName"
                        value={values.contactName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.contactName && errors.contactName}
                        disabled={isSubmitting}
                        placeholder="İletişim kişisinin adını giriniz"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contactName}
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
          <Modal.Title>Müşteri Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3">Emin misiniz?</h5>
            <p className="text-muted">
              <strong>{selectedCustomer?.companyName}</strong> müşterisini silmek istediğinizden emin misiniz? 
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