import React, { useEffect, useState, useCallback } from "react";
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
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/EmployeeService";


const EmployeeSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Ad en az 2 karakter olmalı")
    .max(50, "Ad en fazla 50 karakter olabilir")
    .required("Ad zorunlu"),
  lastName: Yup.string()
    .min(2, "Soyad en az 2 karakter olmalı")
    .max(50, "Soyad en fazla 50 karakter olabilir")
    .required("Soyad zorunlu"),
  title: Yup.string()
    .max(100, "İş başlığı en fazla 100 karakter olabilir"),
  birthDate: Yup.date(),
  address: Yup.string()
    .max(200, "Adres en fazla 200 karakter olabilir"),
  city: Yup.string()
    .max(50, "Şehir en fazla 50 karakter olabilir"),
  country: Yup.string()
    .max(50, "Ülke en fazla 50 karakter olabilir"),
  homePhone: Yup.string()
    .max(20, "Telefon en fazla 20 karakter olabilir"),
});

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // when editing, this holds the DTO
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // the id to pass to update/delete
  const [selectedId, setSelectedId] = useState(null);

  // Filters, sorting, and pagination state
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    title: '',
    city: '',
    country: '',
    isDeleted: '',
  });
  const [sort, setSort] = useState({ field: 'EmployeeId', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load employees on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const res = await getAllEmployees({
          sortField: sort.field,
          sortDirection: sort.direction,
          page,
          pageSize: 10,
        });
        
        if (res.success) {
          setEmployees(res.data.items || res.data);
          setTotalCount(res.totalCount || 0);
        } else {
          toast.error(res.message || "Çalışanlar yüklenirken hata oluştu");
        }
      } catch (error) {
        toast.error("Çalışanlar yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []); // Sadece component mount'ta çalışsın

  // Listeyi yükle
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      // Parametreleri doğru formata dönüştür
      const params = {
        firstName: filters.firstName || undefined,
        lastName: filters.lastName || undefined,
        title: filters.title || undefined,
        city: filters.city || undefined,
        country: filters.country || undefined,
        isDeleted: filters.isDeleted !== '' ? (filters.isDeleted === 'true') : undefined,
        sortField: sort.field,
        sortDirection: sort.direction,
        page,
        pageSize: 10,
      };
      
      const res = await getAllEmployees(params);
      if (res.success) {
        setEmployees(res.data.items || res.data);
        setTotalCount(res.totalCount || 0);
      } else {
        toast.error(res.message || "Çalışanlar yüklenirken hata oluştu");
      }
    } catch (error) {
      toast.error("Çalışanlar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  // Load employees when filters, sort, or page changes (but not on initial load)
  useEffect(() => {
    // Skip initial load since it's handled in the first useEffect
    if (employees.length > 0 || loading === false) {
      loadEmployees();
    }
  }, [loadEmployees, employees.length, loading]);

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  // Sorting handler
  const handleSort = (field) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setPage(1); // Reset to first page when sort changes
  };

  // Pagination handlers
  const handlePageChange = (newPage) => setPage(newPage);

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
    } catch (error) {
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
        res = await updateEmployee({ ...values, employeeId: selectedId });
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
    } catch (error) {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Çalışan silme
  const handleDelete = async () => {
    try {
      const res = await deleteEmployee(selectedEmployee.employeeId);
      if (res.success) {
        toast.success("Çalışan başarıyla silindi");
        setShowDeleteModal(false);
        loadEmployees();
      } else {
        toast.error(res.message || "Silme işlemi sırasında hata oluştu");
      }
    } catch (error) {
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

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filtreler</h5>
          <Row className="g-3">
            <Col md={3}>
              <Form.Control
                name="firstName"
                placeholder="Ad"
                value={filters.firstName}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                name="lastName"
                placeholder="Soyad"
                value={filters.lastName}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={3}>
              <Form.Select
                name="isDeleted"
                value={filters.isDeleted}
                onChange={handleFilterChange}
              >
                <option value="">Tüm Durumlar</option>
                <option value="false">Aktif</option>
                <option value="true">Silinmiş</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="outline-primary" onClick={() => {
                setPage(1);
                loadEmployees();
              }} className="w-100">
                <i className="bi bi-search"></i>
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Employee List Table */}
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
                  <th onClick={() => handleSort('EmployeeId')} style={{ cursor: 'pointer' }}>
                    ID {sort.field === 'EmployeeId' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer' }}>
                    Ad {sort.field === 'firstName' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('lastName')} style={{ cursor: 'pointer' }}>
                    Soyad {sort.field === 'lastName' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('city')} style={{ cursor: 'pointer' }}>
                    Şehir {sort.field === 'city' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('country')} style={{ cursor: 'pointer' }}>
                    Ülke {sort.field === 'country' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('isDeleted')} style={{ cursor: 'pointer' }}>
                    Durum {sort.field === 'isDeleted' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.employeeId}>
                    <td>{e.employeeId}</td>
                    <td>{e.firstName}</td>
                    <td>{e.lastName}</td>
                    <td>{e.city || '-'}</td>
                    <td>{e.country || '-'}</td>
                    <td>
                      <span className={`badge ${e.isDeleted ? 'bg-secondary' : 'bg-success'}`}>
                        {e.isDeleted ? 'Silinmiş' : 'Aktif'}
                      </span>
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEditModal(e.employeeId)}
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
          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center p-3">
            <div>
              Toplam: <b>{totalCount}</b> çalışan
            </div>
            <div>
              <span style={{ marginRight: 8 }}>
                10 / sayfa
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="me-2"
              >
                Önceki
              </Button>
              <span>
                Sayfa <b>{page}</b> / {Math.max(1, Math.ceil(totalCount / 10))}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={page >= Math.ceil(totalCount / 10) || totalCount === 0 || employees.length < 10}
                onClick={() => handlePageChange(page + 1)}
                className="ms-2"
              >
                Sonraki
              </Button>
            </div>
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