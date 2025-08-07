// 📁 src/pages/ProductsPage.jsx
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
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/ProductService";
import { getAllCategories } from "../services/CategoryService";
import { getAllSuppliers } from "../services/SupplierService";

const ProductSchema = Yup.object().shape({
  productName: Yup.string()
    .min(2, "Ürün adı en az 2 karakter olmalı")
    .max(100, "Ürün adı en fazla 100 karakter olabilir")
    .required("Ürün adı zorunlu"),
  unitPrice: Yup.number()
    .typeError("Birim fiyatı sayı olmalı")
    .min(0, "Birim fiyatı 0'dan büyük veya eşit olmalı")
    .required("Birim fiyatı zorunlu"), // Backend'de required olduğu için
  categoryId: Yup.number()
    .integer()
    .moreThan(0, "Kategori seçmelisiniz")
    .required("Kategori zorunlu"),
  supplierId: Yup.number()
    .integer()
    .moreThan(0, "Tedarikçi seçmelisiniz")
    .required("Tedarikçi zorunlu"),
});

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // when editing, this holds the DTO
  const [selectedProduct, setSelectedProduct] = useState(null);
  // the id to pass to update/delete
  const [selectedId, setSelectedId] = useState(null);

  // Filters, sorting, and pagination state
  const [filters, setFilters] = useState({
    productName: '',
    categoryId: '',
    supplierId: '',
    minPrice: '',
    maxPrice: '',
    isDeleted: '',
  });
  const [sort, setSort] = useState({ field: 'productId', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load lookups and products on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Load lookups and products in parallel
        const [catRes, supRes, productsRes] = await Promise.all([
          getAllCategories(),
          getAllSuppliers(),
          getAllProducts({
            sortField: sort.field,
            sortDirection: sort.direction,
            page,
            pageSize: 10,
          })
        ]);
        
        if (catRes.success) setCategories(catRes.data);
        if (supRes.success) setSuppliers(supRes.data);
        if (productsRes.success) {
          setProducts(productsRes.data);
          setTotalCount(productsRes.totalCount || 0);
        }
      } catch (error) {
        toast.error('Veriler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []); // Sadece component mount'ta çalışsın

  // Load products when filters, sort, or page changes
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Parametreleri doğru formata dönüştür
      const params = {
        productName: filters.productName || undefined,
        categoryId: filters.categoryId ? parseInt(filters.categoryId) : undefined,
        supplierId: filters.supplierId ? parseInt(filters.supplierId) : undefined,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
        isDeleted: filters.isDeleted !== '' ? (filters.isDeleted === 'true') : undefined,
        sortField: sort.field,
        sortDirection: sort.direction,
        page,
        pageSize: 10,
      };
      
      const res = await getAllProducts(params);
      if (res.success) {
        setProducts(res.data);
        setTotalCount(res.totalCount || 0);
      } else {
        toast.error(res.message || 'Ürünler yüklenirken hata oluştu');
      }
    } catch (error) {
      toast.error('Ürünler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  // Load products when filters, sort, or page changes (but not on initial load)
  useEffect(() => {
    // Skip initial load since it's handled in the first useEffect
    if (categories.length > 0 || suppliers.length > 0) {
      loadProducts();
    }
  }, [loadProducts, categories.length, suppliers.length]);

  const reloadProducts = async () => {
    await loadProducts();
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setSelectedId(null);
    setShowModal(true);
  };

  const openEditModal = async (id) => {
    try {
      const res = await getProductById(id);
      if (!res.success) throw new Error(res.message);

      setSelectedProduct(res.data);
      setSelectedId(id);
      setShowModal(true);
    } catch {
      toast.error("Ürün bilgileri alınırken hata oluştu");
    }
  };

  const openDeleteModal = (p) => {
    setSelectedProduct(p);
    setSelectedId(p.productId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteProduct(selectedId);
      if (res.success) {
        toast.success("Ürün başarıyla silindi");
        setShowDeleteModal(false);
        reloadProducts();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Silme işlemi sırasında hata oluştu");
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let res;
      if (selectedId) {
        res = await updateProduct({ productId: selectedId, ...values });
      } else {
        res = await createProduct(values);
      }

      if (res.success) {
        toast.success(selectedId ? "Ürün başarıyla güncellendi" : "Ürün başarıyla oluşturuldu");
        setShowModal(false);
        resetForm();
        reloadProducts();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = selectedProduct
    ? {
        productName: selectedProduct.productName,
        unitPrice: selectedProduct.unitPrice,
        categoryId: selectedProduct.categoryId,
        supplierId: selectedProduct.supplierId,
      }
    : {
        productName: "",
        unitPrice: "",
        categoryId: 0,
        supplierId: 0,
      };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handleSort = (field) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setPage(1); // Reset to first page when sort changes
  };

  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Ürün Yönetimi</h2>
        <Button variant="primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2" /> Yeni Ürün
        </Button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filtreler</h5>
          <Row className="g-3">
            <Col md={3}>
              <Form.Control
                name="productName"
                placeholder="Ürün Adı"
                value={filters.productName}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={2}>
              <Form.Select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                name="supplierId"
                value={filters.supplierId}
                onChange={handleFilterChange}
              >
                <option value="">Tüm Tedarikçiler</option>
                {suppliers.map((s) => (
                  <option key={s.supplierId} value={s.supplierId}>
                    {s.companyName}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={1}>
              <Form.Control
                name="minPrice"
                placeholder="Min Fiyat"
                type="number"
                min="0"
                step="0.01"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={1}>
              <Form.Control
                name="maxPrice"
                placeholder="Max Fiyat"
                type="number"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
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
                loadProducts();
              }} className="w-100">
                <i className="bi bi-search"></i>
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Product List Table */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : products.length === 0 ? (
        <Alert variant="info" className="text-center">
          Henüz hiçbir ürün yok.
        </Alert>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th onClick={() => handleSort('ProductId')} style={{ cursor: 'pointer' }}>
                    ID {sort.field === 'ProductId' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('productName')} style={{ cursor: 'pointer' }}>
                    Ürün Adı {sort.field === 'productName' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('unitPrice')} style={{ cursor: 'pointer' }}>
                    Birim Fiyatı {sort.field === 'unitPrice' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th>Kategori</th>
                  <th>Tedarikçi</th>
                  <th onClick={() => handleSort('isDeleted')} style={{ cursor: 'pointer' }}>
                    Durum {sort.field === 'isDeleted' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const cat = categories.find((c) => c.categoryId === p.categoryId);
                  const sup = suppliers.find((s) => s.supplierId === p.supplierId);
                  return (
                    <tr key={p.productId}>
                      <td>{p.productId}</td>
                      <td>{p.productName}</td>
                      <td>₺{p.unitPrice?.toFixed(2)}</td>
                      <td>{cat?.categoryName || '-'}</td>
                      <td>{sup?.companyName || '-'}</td>
                      <td>
                        <span className={`badge ${p.isDeleted ? 'bg-secondary' : 'bg-success'}`}>
                          {p.isDeleted ? 'Silinmiş' : 'Aktif'}
                        </span>
                      </td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          onClick={() => openEditModal(p.productId)}
                        >
                          <i className="bi bi-pencil-fill" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => openDeleteModal(p)}
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
              Toplam: <b>{totalCount}</b> ürün
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
                disabled={page >= Math.ceil(totalCount / 10) || totalCount === 0 || products.length < 10}
                onClick={() => handlePageChange(page + 1)}
                className="ms-2"
              >
                Sonraki
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? "Ürün Güncelle" : "Yeni Ürün Ekle"}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={ProductSchema}
          enableReinitialize
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
                      <Form.Label>Ürün Adı *</Form.Label>
                      <Form.Control
                        name="productName"
                        value={values.productName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.productName && errors.productName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.productName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Birim Fiyatı *</Form.Label>
                      <Form.Control
                        name="unitPrice"
                        type="number"
                        value={values.unitPrice}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.unitPrice && errors.unitPrice}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.unitPrice}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Kategori *</Form.Label>
                      <Form.Select
                        name="categoryId"
                        value={values.categoryId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.categoryId && errors.categoryId}
                      >
                        <option value={0}>Seçiniz…</option>
                        {categories.map((c) => (
                          <option key={c.categoryId} value={c.categoryId}>
                            {c.categoryName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.categoryId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Tedarikçi *</Form.Label>
                      <Form.Select
                        name="supplierId"
                        value={values.supplierId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.supplierId && errors.supplierId}
                      >
                        <option value={0}>Seçiniz…</option>
                        {suppliers.map((s) => (
                          <option key={s.supplierId} value={s.supplierId}>
                            {s.companyName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.supplierId}
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
                    <Spinner size="sm" animation="border" className="me-2" />
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

      {/* Delete Confirmation */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ürün Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <i
            className="bi bi-exclamation-triangle text-warning"
            style={{ fontSize: "3rem" }}
          />
          <h5 className="mt-3">Emin misiniz?</h5>
          <p className="text-muted">
            <strong>{selectedProduct?.productName}</strong> ürününü silmek
            istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
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
