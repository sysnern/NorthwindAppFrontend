import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert, Row, Col } from "react-bootstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/SupplierService";

const SupplierSchema = Yup.object().shape({
  companyName: Yup.string()
    .min(2, 'Şirket adı en az 2 karakter olmalı')
    .max(100, 'Şirket adı en fazla 100 karakter olabilir')
    .required('Şirket adı zorunlu'),
  contactName: Yup.string()
    .min(2, 'İletişim adı en az 2 karakter olmalı')
    .max(50, 'İletişim adı en fazla 50 karakter olabilir')
    .required('İletişim adı zorunlu')
});

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Listeyi yükle
  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const res = await getAllSuppliers();
      if (res.success) {
        setSuppliers(res.data);
      } else {
        toast.error(res.message || "Tedarikçiler yüklenirken hata oluştu");
      }
    } catch (e) {
      toast.error("Tedarikçiler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Yeni tedarikçi ekleme modalını aç
  const openAddModal = () => {
    setSelectedSupplier(null);
    setSelectedId(null);
    setShowModal(true);
  };

  // Düzenleme modalını aç
  const openEditModal = async (id) => {
    try {
      const res = await getSupplierById(id);
      if (res.success) {
        setSelectedSupplier(res.data);
        setSelectedId(id);
        setShowModal(true);
      } else {
        toast.error(res.message || "Tedarikçi bilgileri alınırken hata oluştu");
      }
    } catch (e) {
      toast.error("Tedarikçi bilgileri alınırken hata oluştu");
    }
  };

  // Silme modalını aç
  const openDeleteModal = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteModal(true);
  };

  // Tedarikçi kaydetme
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let res;
      if (selectedId) {
        res = await updateSupplier({ ...values, supplierID: selectedId });
      } else {
        res = await createSupplier(values);
      }

      if (res.success) {
        toast.success(selectedId ? "Tedarikçi başarıyla güncellendi" : "Tedarikçi başarıyla eklendi");
        setShowModal(false);
        resetForm();
        loadSuppliers();
      } else {
        toast.error(res.message || "İşlem sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Tedarikçi silme
  const handleDelete = async () => {
    try {
      const res = await deleteSupplier(selectedSupplier.supplierID);
      if (res.success) {
        toast.success("Tedarikçi başarıyla silindi");
        setShowDeleteModal(false);
        loadSuppliers();
      } else {
        toast.error(res.message || "Silme işlemi sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("Silme işlemi sırasında hata oluştu");
    }
  };

  const initialValues = selectedSupplier ? {
    companyName: selectedSupplier.companyName || "",
    contactName: selectedSupplier.contactName || ""
  } : {
    companyName: "",
    contactName: ""
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Tedarikçi Yönetimi</h2>
        <Button variant="primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Yeni Tedarikçi
        </Button>
      </div>

      {/* Tedarikçi Listesi */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </Spinner>
        </div>
      ) : suppliers.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          Henüz hiçbir tedarikçi yok.
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
                {suppliers.map(s => (
                  <tr key={s.supplierID}>
                    <td>{s.supplierID}</td>
                    <td>{s.companyName}</td>
                    <td>{s.contactName}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEditModal(s.supplierID)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(s)}
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

      {/* Tedarikçi Ekleme/Düzenleme Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? 'Tedarikçi Güncelle' : 'Yeni Tedarikçi Ekle'}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={SupplierSchema}
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
                <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                  İptal
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
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
          <Modal.Title>Tedarikçi Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3">Emin misiniz?</h5>
            <p className="text-muted">
              <strong>{selectedSupplier?.companyName}</strong> tedarikçisini silmek istediğinizden emin misiniz?
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
