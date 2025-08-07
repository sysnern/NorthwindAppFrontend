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
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/OrderService";
import { getAllCustomers } from "../services/CustomerService";
import { getAllEmployees } from "../services/EmployeeService";


const OrderSchema = Yup.object().shape({
  customerId: Yup.number()
    .integer()
    .moreThan(0, "Müşteri seçmelisiniz")
    .required("Müşteri zorunlu"),
  employeeId: Yup.number()
    .integer()
    .moreThan(0, "Çalışan seçmelisiniz")
    .required("Çalışan zorunlu"),
  orderDate: Yup.date(),
  shippedDate: Yup.date(),
  shipAddress: Yup.string()
    .max(200, "Gönderim adresi en fazla 200 karakter olabilir"),
  shipCity: Yup.string()
    .max(50, "Gönderim şehri en fazla 50 karakter olabilir"),
  shipCountry: Yup.string()
    .max(50, "Gönderim ülkesi en fazla 50 karakter olabilir"),
  freight: Yup.number()
    .min(0, "Nakliye ücreti 0'dan küçük olamaz"),
});

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // when editing, this holds the DTO
  const [selectedOrder, setSelectedOrder] = useState(null);
  // the id to pass to update/delete
  const [selectedId, setSelectedId] = useState(null);

  // Filters, sorting, and pagination state
  const [filters, setFilters] = useState({
    orderId: '',
    customerId: '',
    employeeId: '',
    orderDate: '',
    shippedDate: '',
    shipCity: '',
    shipCountry: '',
    isDeleted: '',
  });
  const [sort, setSort] = useState({ field: 'OrderId', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load orders on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const res = await getAllOrders({
          sortField: sort.field,
          sortDirection: sort.direction,
          page,
          pageSize: 10,
        });
        
        if (res.success) {
          setOrders(res.data.items || res.data);
          setTotalCount(res.totalCount || 0);
        } else {
          toast.error(res.message || "Siparişler yüklenirken hata oluştu");
        }
      } catch (error) {
        toast.error("Siparişler yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []); // Sadece component mount'ta çalışsın

  // Listeyi yükle
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Parametreleri doğru formata dönüştür
      const params = {
        customerId: filters.customerId || undefined,
        employeeId: filters.employeeId || undefined,
        orderDate: filters.orderDate || undefined,
        requiredDate: filters.requiredDate || undefined,
        shippedDate: filters.shippedDate || undefined,
        shipCity: filters.shipCity || undefined,
        shipCountry: filters.shipCountry || undefined,
        isDeleted: filters.isDeleted !== '' ? (filters.isDeleted === 'true') : undefined,
        sortField: sort.field,
        sortDirection: sort.direction,
        page,
        pageSize: 10,
      };
      
      const res = await getAllOrders(params);
      if (res.success) {
        setOrders(res.data.items || res.data);
        setTotalCount(res.totalCount || 0);
      } else {
        toast.error(res.message || "Siparişler yüklenirken hata oluştu");
      }
    } catch (error) {
      toast.error("Siparişler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  // Load orders when filters, sort, or page changes (but not on initial load)
  useEffect(() => {
    // Skip initial load since it's handled in the first useEffect
    if (orders.length > 0 || loading === false) {
      loadOrders();
    }
  }, [loadOrders, orders.length, loading]);

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
      loadOrders();
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
      loadOrders();
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

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Sipariş Yönetimi</h2>
        <Button variant="primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2" />
          Yeni Sipariş
        </Button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filtreler</h5>
          <Row className="g-3">
            <Col md={2}>
              <Form.Control
                name="orderId"
                placeholder="Sipariş ID"
                value={filters.orderId}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={3}>
              <Form.Select
                name="customerId"
                value={filters.customerId}
                onChange={handleFilterChange}
              >
                <option value="">Tüm Müşteriler</option>
                {customers.map((c) => (
                  <option key={c.customerId} value={c.customerId}>
                    {c.companyName}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                name="employeeId"
                value={filters.employeeId}
                onChange={handleFilterChange}
              >
                <option value="">Tüm Çalışanlar</option>
                {employees.map((e) => (
                  <option key={e.employeeId} value={e.employeeId}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
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
                loadOrders();
              }} className="w-100">
                <i className="bi bi-search"></i>
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Order List Table */}
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
                  <th onClick={() => handleSort('OrderId')} style={{ cursor: 'pointer' }}>
                    ID {sort.field === 'OrderId' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('CustomerId')} style={{ cursor: 'pointer' }}>
                    Müşteri {sort.field === 'CustomerId' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('EmployeeId')} style={{ cursor: 'pointer' }}>
                    Çalışan {sort.field === 'EmployeeId' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('orderDate')} style={{ cursor: 'pointer' }}>
                    Sipariş Tarihi {sort.field === 'orderDate' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('isDeleted')} style={{ cursor: 'pointer' }}>
                    Durum {sort.field === 'isDeleted' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const customer = customers.find((c) => c.customerId === o.customerId);
                  const employee = employees.find((e) => e.employeeId === o.employeeId);
                  return (
                    <tr key={o.orderId}>
                      <td>{o.orderId}</td>
                      <td>{customer ? customer.companyName : o.customerId}</td>
                      <td>{employee ? `${employee.firstName} ${employee.lastName}` : o.employeeId}</td>
                      <td>{o.orderDate?.slice(0, 10)}</td>
                      <td>
                        <span className={`badge ${o.isDeleted ? 'bg-secondary' : 'bg-success'}`}>
                          {o.isDeleted ? 'Silinmiş' : 'Aktif'}
                        </span>
                      </td>
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
                  );
                })}
              </tbody>
            </Table>
          </div>
          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center p-3">
            <div>
              Toplam: <b>{totalCount}</b> sipariş
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
                disabled={page >= Math.ceil(totalCount / 10) || totalCount === 0 || orders.length < 10}
                onClick={() => handlePageChange(page + 1)}
                className="ms-2"
              >
                Sonraki
              </Button>
            </div>
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
