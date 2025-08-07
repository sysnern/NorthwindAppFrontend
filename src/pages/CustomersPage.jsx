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
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/CustomerService";


const CustomerSchema = Yup.object().shape({
  companyName: Yup.string()
    .min(2, "Şirket adı en az 2 karakter olmalı")
    .max(100, "Şirket adı en fazla 100 karakter olabilir")
    .required("Şirket adı zorunlu"),
  contactName: Yup.string()
    .min(2, "İletişim kişisi en az 2 karakter olmalı")
    .max(50, "İletişim kişisi en fazla 50 karakter olabilir")
    .required("İletişim kişisi zorunlu"),
  contactTitle: Yup.string()
    .max(50, "İletişim başlığı en fazla 50 karakter olabilir"),
  address: Yup.string()
    .max(200, "Adres en fazla 200 karakter olabilir"),
  city: Yup.string()
    .max(50, "Şehir en fazla 50 karakter olabilir"),
  country: Yup.string()
    .max(50, "Ülke en fazla 50 karakter olabilir"),
  phone: Yup.string()
    .max(20, "Telefon en fazla 20 karakter olabilir"),
});

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // when editing, this holds the DTO
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // the id to pass to update/delete
  const [selectedId, setSelectedId] = useState(null);

  // Filters, sorting, and pagination state
  const [filters, setFilters] = useState({
    companyName: '',
    contactName: '',
    city: '',
    country: '',
    isDeleted: '',
  });
  const [sort, setSort] = useState({ field: 'CustomerId', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load customers on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const res = await getAllCustomers({
          sortField: sort.field,
          sortDirection: sort.direction,
          page,
          pageSize: 10,
        });
        
        if (res.success) {
          setCustomers(res.data.items || res.data);
          setTotalCount(res.totalCount || 0);
        } else {
          toast.error(res.message || "Müşteriler yüklenirken hata oluştu");
        }
      } catch (error) {
        toast.error("Müşteriler yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []); // Sadece component mount'ta çalışsın

  // Listeyi yükle
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      // Parametreleri doğru formata dönüştür
      const params = {
        companyName: filters.companyName || undefined,
        contactName: filters.contactName || undefined,
        city: filters.city || undefined,
        country: filters.country || undefined,
        isDeleted: filters.isDeleted !== '' ? (filters.isDeleted === 'true') : undefined,
        sortField: sort.field,
        sortDirection: sort.direction,
        page,
        pageSize: 10,
      };
      
      const res = await getAllCustomers(params);
      if (res.success) {
        setCustomers(res.data.items || res.data);
        setTotalCount(res.totalCount || 0);
      } else {
        toast.error(res.message || "Müşteriler yüklenirken hata oluştu");
      }
    } catch (error) {
      toast.error("Müşteriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  // Load customers when filters, sort, or page changes (but not on initial load)
  useEffect(() => {
    // Skip initial load since it's handled in the first useEffect
    if (customers.length > 0 || loading === false) {
      loadCustomers();
    }
  }, [loadCustomers, customers.length, loading]);

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
    } catch (error) {
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
        res = await updateCustomer({ ...values, customerId: selectedId });
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
    } catch (error) {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Müşteri silme
  const handleDelete = async () => {
    try {
      const res = await deleteCustomer(selectedCustomer.customerId);
      if (res.success) {
        toast.success("Müşteri başarıyla silindi");
        setShowDeleteModal(false);
        loadCustomers();
      } else {
        toast.error(res.message || "Silme işlemi sırasında hata oluştu");
      }
    } catch (error) {
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

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filtreler</h5>
          <Row className="g-3">
            <Col md={4}>
              <Form.Control
                name="companyName"
                placeholder="Şirket Adı"
                value={filters.companyName}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                name="contactName"
                placeholder="İletişim Kişisi"
                value={filters.contactName}
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
            <Col md={1}>
              <Button variant="outline-primary" onClick={() => {
                setPage(1);
                loadCustomers();
              }} className="w-100">
                <i className="bi bi-search"></i>
              </Button>
            </Col>
          </Row>
        </div>
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
                  <th onClick={() => handleSort('CustomerId')} style={{ cursor: 'pointer' }}>
                    ID {sort.field === 'CustomerId' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('companyName')} style={{ cursor: 'pointer' }}>
                    Şirket Adı {sort.field === 'companyName' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('contactName')} style={{ cursor: 'pointer' }}>
                    İletişim Kişisi {sort.field === 'contactName' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('isDeleted')} style={{ cursor: 'pointer' }}>
                    Durum {sort.field === 'isDeleted' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.customerId}>
                    <td>{c.customerId}</td>
                    <td>{c.companyName}</td>
                    <td>{c.contactName}</td>
                    <td>
                      <span className={`badge ${c.isDeleted ? 'bg-secondary' : 'bg-success'}`}>
                        {c.isDeleted ? 'Silinmiş' : 'Aktif'}
                      </span>
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEditModal(c.customerId)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(c)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center p-3">
        <div>
          Toplam: <b>{totalCount}</b> müşteri
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
                            disabled={page >= Math.ceil(totalCount / 10) || totalCount === 0 || customers.length < 10}
            onClick={() => handlePageChange(page + 1)}
            className="ms-2"
          >
            Sonraki
          </Button>
        </div>
      </div>

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