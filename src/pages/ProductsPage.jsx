// 📁 src/pages/ProductsPage.jsx
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
    .required("Birim fiyatı zorunlu"),
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

  // load lookups and products
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [catRes, supRes, prodRes] = await Promise.all([
          getAllCategories(),
          getAllSuppliers(),
          getAllProducts(),
        ]);

        if (catRes.success) setCategories(catRes.data);
        if (supRes.success) setSuppliers(supRes.data);
        if (prodRes.success) setProducts(prodRes.data);
        else throw new Error(prodRes.message);
      } catch (e) {
        toast.error("Veriler yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // re‑load products only
  const reloadProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      if (res.success) setProducts(res.data);
      else toast.error(res.message);
    } catch {
      toast.error("Ürünler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
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
        toast.success(
          selectedId ? "Ürün başarıyla güncellendi" : "Ürün başarıyla eklendi"
        );
        setShowModal(false);
        resetForm();
        reloadProducts();
      } else {
        toast.error(res.message);
      }
    } catch {
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

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Ürün Yönetimi</h2>
        <Button variant="primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2" /> Yeni Ürün
        </Button>
      </div>

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
                  <th>ID</th>
                  <th>Ürün Adı</th>
                  <th>Birim Fiyatı</th>
                  <th>Kategori</th>
                  <th>Tedarikçi</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  // find the human names from the lookups
                  const cat = categories.find((c) => c.categoryId === p.categoryId);
                  const sup = suppliers.find((s) => s.supplierId === p.supplierId);
                  return (
                    <tr key={p.productId}>
                      <td>{p.productId}</td>
                      <td>{p.productName}</td>
                      <td>{p.unitPrice}</td>
                      <td>{cat?.categoryName || "-"}</td>
                      <td>{sup?.companyName || "-"}</td>
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
