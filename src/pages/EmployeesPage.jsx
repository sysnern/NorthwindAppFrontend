import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert, Row, Col } from "react-bootstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/EmployeeService";

const EmployeeSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Ad en az 2 karakter olmalı')
    .max(50, 'Ad en fazla 50 karakter olabilir')
    .required('Ad zorunlu'),
  lastName: Yup.string()
    .min(2, 'Soyad en az 2 karakter olmalı')
    .max(50, 'Soyad en fazla 50 karakter olabilir')
    .required('Soyad zorunlu')
});

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Listeyi yükle
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await getAllEmployees();
      if (res.success) {
        setEmployees(res.data);
      } else {
        toast.error(res.message || "Çalışanlar yüklenirken hata oluştu");
      }
    } catch (e) {
      toast.error("Çalışanlar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Yeni çalışan ekleme modalını aç
  const openAddModal = () => {
    setSelectedEmployee(null);
    setSelectedId(null);
    setShowModal(true);
  };

  // Düzenleme modalını aç
  const openEditModal = async (id) => {
    try {
      const res = await getEmployeeById(id);
      if (res.success) {
        setSelectedEmployee(res.data);
        setSelectedId(id);
        setShowModal(true);
      } else {
        toast.error(res.message || "Çalışan bilgileri alınırken hata oluştu");
      }
    } catch (e) {
      toast.error("Çalışan bilgileri alınırken hata oluştu");
    }
  };

  // Silme modalını aç
  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  // Çalışan kaydetme
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let res;
      if (selectedId) {
        res = await updateEmployee({ ...values, employeeID: selectedId });
      } else {
        res = await createEmployee(values);
      }

      if (res.success) {
        toast.success(selectedId ? "Çalışan başarıyla güncellendi" : "Çalışan başarıyla eklendi");
        setShowModal(false);
        resetForm();
        loadEmployees();
      } else {
        toast.error(res.message || "İşlem sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Çalışan silme
  const handleDelete = async () => {
    try {
      const res = await deleteEmployee(selectedEmployee.employeeID);
      if (res.success) {
        toast.success("Çalışan başarıyla silindi");
        setShowDeleteModal(false);
        loadEmployees();
      } else {
        toast.error(res.message || "Silme işlemi sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("Silme işlemi sırasında hata oluştu");
    }
  };

  const initialValues = selectedEmployee ? {
    firstName: selectedEmployee.firstName || "",
    lastName: selectedEmployee.lastName || ""
  } : {
    firstName: "",
    lastName: ""
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Çalışan Yönetimi</h2>
        <Button variant="primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Yeni Çalışan
        </Button>
      </div>

      {/* Çalışan Listesi */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </Spinner>
        </div>
      ) : employees.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          Henüz hiç çalışan yok.
        </Alert>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Ad</th>
                  <th>Soyad</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(e => (
                  <tr key={e.employeeID}>
                    <td>{e.employeeID}</td>
                    <td>{e.firstName}</td>
                    <td>{e.lastName}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEditModal(e.employeeID)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(e)}
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

      {/* Çalışan Ekleme/Düzenleme Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? 'Çalışan Güncelle' : 'Yeni Çalışan Ekle'}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={EmployeeSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Ad *</Form.Label>
                      <Form.Control
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.firstName && errors.firstName}
                        disabled={isSubmitting}
                        placeholder="Adını giriniz"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Soyad *</Form.Label>
                      <Form.Control
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.lastName && errors.lastName}
                        disabled={isSubmitting}
                        placeholder="Soyadını giriniz"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
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
          <Modal.Title>Çalışan Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3">Emin misiniz?</h5>
            <p className="text-muted">
              <strong>{selectedEmployee?.firstName} {selectedEmployee?.lastName}</strong> çalışanını silmek istediğinizden emin misiniz? 
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