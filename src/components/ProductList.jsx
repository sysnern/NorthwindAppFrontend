import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert, Row, Col } from "react-bootstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
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
    .min(2, 'Ürün adı en az 2 karakter olmalı')
    .max(50, 'Ürün adı en fazla 50 karakter olabilir')
    .required('Ürün adı zorunlu'),
  unitPrice: Yup.number()
    .min(0, 'Fiyat 0 veya pozitif olmalı')
    .required('Fiyat zorunlu'),
  unitsInStock: Yup.number()
    .min(0, 'Stok 0 veya pozitif olmalı')
    .integer('Stok tam sayı olmalı')
    .required('Stok zorunlu'),
  categoryID: Yup.number()
    .required('Kategori seçimi zorunlu'),
  supplierID: Yup.number()
    .required('Tedarikçi seçimi zorunlu')
});

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filters, setFilters] = useState({
    productName: "",
    categoryID: "",
    minPrice: "",
    maxPrice: "",
    discontinued: "",
  });
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Listeyi yükle
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts(filters);
      if (res.success) {
        setProducts(res.data);
      } else {
        toast.error(res.message || "Ürünler yüklenirken hata oluştu");
      }
    } catch (e) {
      toast.error("Ürünler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Kategorileri ve tedarikçileri yükle
  const loadDropdownData = async () => {
    try {
      const [catRes, supRes] = await Promise.all([
        getAllCategories(),
        getAllSuppliers()
      ]);
      
      if (catRes.success) setCategories(catRes.data);
      if (supRes.success) setSuppliers(supRes.data);
    } catch (e) {
      toast.error("Dropdown verileri yüklenirken hata oluştu");
    }
  };

  useEffect(() => {
    loadProducts();
    loadDropdownData();
  }, []);

  // Filtre değişimi
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  // Yeni ürün ekleme modalını aç
  const openAddModal = () => {
    setSelectedProduct(null);
    setSelectedId(null);
    setShowModal(true);
  };

  // Düzenleme modalını aç
  const openEditModal = async (id) => {
    try {
      const res = await getProductById(id);
      if (res.success) {
        setSelectedProduct(res.data);
        setSelectedId(id);
        setShowModal(true);
      } else {
        toast.error(res.message || "Ürün bilgileri alınırken hata oluştu");
      }
    } catch (e) {
      toast.error("Ürün bilgileri alınırken hata oluştu");
    }
  };

  // Silme modalını aç
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  // Ürün kaydetme
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let res;
      if (selectedId) {
        res = await updateProduct({ ...values, productID: selectedId });
      } else {
        res = await createProduct(values);
      }

      if (res.success) {
        toast.success(selectedId ? "Ürün başarıyla güncellendi" : "Ürün başarıyla eklendi");
        setShowModal(false);
        resetForm();
        loadProducts();
      } else {
        toast.error(res.message || "İşlem sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Ürün silme
  const handleDelete = async () => {
    try {
      const res = await deleteProduct(selectedProduct.productID);
      if (res.success) {
        toast.success("Ürün başarıyla silindi");
        setShowDeleteModal(false);
        loadProducts();
      } else {
        toast.error(res.message || "Silme işlemi sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("Silme işlemi sırasında hata oluştu");
    }
  };

  const initialValues = selectedProduct ? {
    productName: selectedProduct.productName || "",
    unitPrice: selectedProduct.unitPrice || 0,
    unitsInStock: selectedProduct.unitsInStock || 0,
    categoryID: selectedProduct.categoryID || "",
    supplierID: selectedProduct.supplierID || "",
    discontinued: selectedProduct.discontinued || false
  } : {
    productName: "",
    unitPrice: 0,
    unitsInStock: 0,
    categoryID: "",
    supplierID: "",
    discontinued: false
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Ürün Yönetimi</h2>
        <Button variant="primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Yeni Ürün
        </Button>
      </div>

      {/* Filtreler */}
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
                name="categoryID"
                value={filters.categoryID}
                onChange={handleFilterChange}
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(c => (
                  <option key={c.categoryID} value={c.categoryID}>
                    {c.categoryName}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control
                name="minPrice"
                placeholder="Min Fiyat"
                type="number"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                name="maxPrice"
                placeholder="Max Fiyat"
                type="number"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={2}>
              <Form.Select
                name="discontinued"
                value={filters.discontinued}
                onChange={handleFilterChange}
              >
                <option value="">Tüm Durumlar</option>
                <option value="false">Aktif</option>
                <option value="true">Pasif</option>
              </Form.Select>
            </Col>
            <Col md={1}>
              <Button variant="outline-primary" onClick={loadProducts} className="w-100">
                <i className="bi bi-search"></i>
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Ürün Listesi */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </Spinner>
        </div>
      ) : products.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          Hiç ürün bulunamadı.
        </Alert>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Ürün Adı</th>
                  <th>Kategori</th>
                  <th>Tedarikçi</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                  <th>Durum</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.productID}>
                    <td>{p.productID}</td>
                    <td>{p.productName}</td>
                    <td>
                      {categories.find(c => c.categoryID === p.categoryID)?.categoryName || '-'}
                    </td>
                    <td>
                      {suppliers.find(s => s.supplierID === p.supplierID)?.companyName || '-'}
                    </td>
                    <td>₺{p.unitPrice?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.unitsInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {p.unitsInStock}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.discontinued ? 'bg-secondary' : 'bg-success'}`}>
                        {p.discontinued ? 'Pasif' : 'Aktif'}
                      </span>
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEditModal(p.productID)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(p)}
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

      {/* Ürün Ekleme/Düzenleme Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? 'Ürün Güncelle' : 'Yeni Ürün Ekle'}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Ürün Adı *</Form.Label>
                      <Form.Control
                        name="productName"
                        value={values.productName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.productName && errors.productName}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.productName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Kategori *</Form.Label>
                      <Form.Select
                        name="categoryID"
                        value={values.categoryID}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.categoryID && errors.categoryID}
                        disabled={isSubmitting}
                      >
                        <option value="">Kategori Seçin</option>
                        {categories.map(c => (
                          <option key={c.categoryID} value={c.categoryID}>
                            {c.categoryName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.categoryID}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Tedarikçi *</Form.Label>
                      <Form.Select
                        name="supplierID"
                        value={values.supplierID}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.supplierID && errors.supplierID}
                        disabled={isSubmitting}
                      >
                        <option value="">Tedarikçi Seçin</option>
                        {suppliers.map(s => (
                          <option key={s.supplierID} value={s.supplierID}>
                            {s.companyName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.supplierID}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Birim Fiyat *</Form.Label>
                      <Form.Control
                        name="unitPrice"
                        type="number"
                        step="0.01"
                        value={values.unitPrice}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.unitPrice && errors.unitPrice}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.unitPrice}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Stok Miktarı *</Form.Label>
                      <Form.Control
                        name="unitsInStock"
                        type="number"
                        value={values.unitsInStock}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.unitsInStock && errors.unitsInStock}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.unitsInStock}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Check
                      type="checkbox"
                      name="discontinued"
                      label="Ürün Pasif"
                      checked={values.discontinued}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
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
          <Modal.Title>Ürün Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3">Emin misiniz?</h5>
            <p className="text-muted">
              <strong>{selectedProduct?.productName}</strong> ürününü silmek istediğinizden emin misiniz? 
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