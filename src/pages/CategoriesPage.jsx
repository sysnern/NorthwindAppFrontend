import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table, Alert, Row, Col } from "react-bootstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/CategoryService";

const CategorySchema = Yup.object().shape({
  categoryName: Yup.string()
    .min(2, 'Kategori adı en az 2 karakter olmalı')
    .max(100, 'Kategori adı en fazla 100 karakter olabilir')
    .required('Kategori adı zorunlu'),
  description: Yup.string()
    .max(500, 'Açıklama en fazla 500 karakter olabilir')
});

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Listeyi yükle
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      if (res.success) {
        setCategories(res.data);
      } else {
        toast.error(res.message || "Kategoriler yüklenirken hata oluştu");
      }
    } catch (e) {
      toast.error("Kategoriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Yeni kategori ekleme modalını aç
  const openAddModal = () => {
    setSelectedCategory(null);
    setSelectedId(null);
    setShowModal(true);
  };

  // Düzenleme modalını aç
  const openEditModal = async (id) => {
    try {
      const res = await getCategoryById(id);
      if (res.success) {
        setSelectedCategory(res.data);
        setSelectedId(id);
        setShowModal(true);
      } else {
        toast.error(res.message || "Kategori bilgileri alınırken hata oluştu");
      }
    } catch (e) {
      toast.error("Kategori bilgileri alınırken hata oluştu");
    }
  };

  // Silme modalını aç
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  // Kategori kaydetme
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let res;
      if (selectedId) {
        res = await updateCategory({ ...values, categoryID: selectedId });
      } else {
        res = await createCategory(values);
      }

      if (res.success) {
        toast.success(selectedId ? "Kategori başarıyla güncellendi" : "Kategori başarıyla eklendi");
        setShowModal(false);
        resetForm();
        loadCategories();
      } else {
        toast.error(res.message || "İşlem sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Kategori silme
  const handleDelete = async () => {
    try {
      const res = await deleteCategory(selectedCategory.categoryID);
      if (res.success) {
        toast.success("Kategori başarıyla silindi");
        setShowDeleteModal(false);
        loadCategories();
      } else {
        toast.error(res.message || "Silme işlemi sırasında hata oluştu");
      }
    } catch (e) {
      toast.error("Silme işlemi sırasında hata oluştu");
    }
  };

  const initialValues = selectedCategory ? {
    categoryName: selectedCategory.categoryName || "",
    description: selectedCategory.description || ""
  } : {
    categoryName: "",
    description: ""
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Kategori Yönetimi</h2>
        <Button variant="primary" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Yeni Kategori
        </Button>
      </div>

      {/* Kategori Listesi */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </Spinner>
        </div>
      ) : categories.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          Henüz hiçbir kategori yok.
        </Alert>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Kategori Adı</th>
                  <th>Açıklama</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.categoryID}>
                    <td>{cat.categoryID}</td>
                    <td>{cat.categoryName}</td>
                    <td>{cat.description}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEditModal(cat.categoryID)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openDeleteModal(cat)}
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

      {/* Kategori Ekleme/Düzenleme Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedId ? 'Kategori Güncelle' : 'Yeni Kategori Ekle'}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={CategorySchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Kategori Adı *</Form.Label>
                      <Form.Control
                        name="categoryName"
                        value={values.categoryName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.categoryName && errors.categoryName}
                        disabled={isSubmitting}
                        placeholder="Kategori adını giriniz"
                      />
                      <Form.Control.Feedback type="invalid">{errors.categoryName}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Açıklama</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.description && errors.description}
                        disabled={isSubmitting}
                        placeholder="Açıklama giriniz"
                      />
                      <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                  İptal
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <><Spinner size="sm" animation="border" className="me-2" />Kaydediliyor...</> : (selectedId ? 'Güncelle' : 'Kaydet')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Silme Onay Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kategori Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3">Emin misiniz?</h5>
            <p className="text-muted">
              <strong>{selectedCategory?.categoryName}</strong> kategorisini silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <i className="bi bi-trash-fill me-2"></i>Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
