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
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/CategoryService";


const CategorySchema = Yup.object().shape({
  categoryName: Yup.string()
    .min(2, "Kategori adı en az 2 karakter olmalı")
    .max(50, "Kategori adı en fazla 50 karakter olabilir")
    .required("Kategori adı zorunlu"),
});

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // when editing, this holds the DTO
  const [selectedCategory, setSelectedCategory] = useState(null);
  // the id to pass to update/delete
  const [selectedId, setSelectedId] = useState(null);

  // Filters, sorting, and pagination state
  const [filters, setFilters] = useState({
    categoryName: '',
    isDeleted: '',
  });
  const [sort, setSort] = useState({ field: 'categoryId', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load categories on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const res = await getAllCategories({
          sortField: sort.field,
          sortDirection: sort.direction,
          page,
          pageSize: 10,
        });
        
        if (res.success) {
          setCategories(res.data.items || res.data);
          setTotalCount(res.totalCount || 0);
        } else {
          toast.error(res.message || "Kategoriler yüklenirken hata oluştu");
        }
      } catch (error) {
        toast.error("Kategoriler yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []); // Sadece component mount'ta çalışsın

  // Listeyi yükle
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      // Parametreleri doğru formata dönüştür
      const params = {
        categoryName: filters.categoryName || undefined,
        isDeleted: filters.isDeleted !== '' ? (filters.isDeleted === 'true') : undefined,
        sortField: sort.field,
        sortDirection: sort.direction,
        page,
        pageSize: 10,
      };
      
      const res = await getAllCategories(params);
      if (res.success) {
        setCategories(res.data.items || res.data);
        setTotalCount(res.totalCount || 0);
      } else {
        toast.error(res.message || "Kategoriler yüklenirken hata oluştu");
      }
    } catch (error) {
      toast.error("Kategoriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  // Load categories when filters, sort, or page changes (but not on initial load)
  useEffect(() => {
    // Skip initial load since it's handled in the first useEffect
    if (categories.length > 0 || loading === false) {
      loadCategories();
    }
  }, [loadCategories, categories.length, loading]);

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

  // Yeni kategori ekleme modalını aç
  const openAddModal = () => {
    setSelectedCategory(null);
    setSelectedId(null);
    setShowModal(true);
  };

  // Düzenleme modalını aç
  const openEditModal = async (categoryId) => {
    try {
      const res = await getCategoryById(categoryId);
      if (res.success) {
        setSelectedCategory(res.data);
        setSelectedId(categoryId);
        setShowModal(true);
      } else {
        toast.error(res.message || "Kategori bilgileri alınırken hata oluştu");
      }
    } catch (error) {
      toast.error("Kategori bilgileri alınırken hata oluştu");
    }
  };

  // Silme modalını aç
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setSelectedId(category.categoryId);
    setShowDeleteModal(true);
  };

  // Kategori kaydetme (ekleme / güncelleme)
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let res;
      if (selectedId) {
        // Güncelleme
        res = await updateCategory({ categoryId: selectedId, ...values });
      } else {
        // Yeni ekleme
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
    } catch (error) {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Kategori silme
  const handleDelete = async () => {
    try {
      const res = await deleteCategory(selectedId);
      if (res.success) {
        toast.success("Kategori başarıyla silindi");
        setShowDeleteModal(false);
        loadCategories();
      } else {
        toast.error(res.message || "Silme işlemi sırasında hata oluştu");
      }
    } catch (error) {
      toast.error("Silme işlemi sırasında hata oluştu");
    }
  };

  // Formik başlangıç değerleri
  const initialValues = selectedCategory
    ? {
        categoryName: selectedCategory.categoryName || "",
        description: selectedCategory.description || ""
      }
    : {
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

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filtreler</h5>
          <Row className="g-3">
            <Col md={4}>
              <Form.Control
                name="categoryName"
                placeholder="Kategori Adı"
                value={filters.categoryName}
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
                loadCategories();
              }} className="w-100">
                <i className="bi bi-search"></i>
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Category List Table */}
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
                  <th onClick={() => handleSort('CategoryId')} style={{ cursor: 'pointer' }}>
                    ID {sort.field === 'CategoryId' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th onClick={() => handleSort('categoryName')} style={{ cursor: 'pointer' }}>
                    Kategori Adı {sort.field === 'categoryName' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th>Açıklama</th>
                  <th onClick={() => handleSort('isDeleted')} style={{ cursor: 'pointer' }}>
                    Durum {sort.field === 'isDeleted' ? (sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                  </th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.categoryId}>
                    <td>{cat.categoryId}</td>
                    <td>{cat.categoryName}</td>
                    <td>{cat.description}</td>
                    <td>
                      <span className={`badge ${cat.isDeleted ? 'bg-secondary' : 'bg-success'}`}>
                        {cat.isDeleted ? 'Silinmiş' : 'Aktif'}
                      </span>
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEditModal(cat.categoryId)}
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
          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center p-3">
            <div>
              Toplam: <b>{totalCount}</b> kategori
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
                disabled={page >= Math.ceil(totalCount / 10) || totalCount === 0 || categories.length < 10}
                onClick={() => handlePageChange(page + 1)}
                className="ms-2"
              >
                Sonraki
              </Button>
            </div>
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
                      <Form.Control.Feedback type="invalid">
                        {errors.categoryName}
                      </Form.Control.Feedback>
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
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
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
                  {isSubmitting
                    ? (<><Spinner size="sm" animation="border" className="me-2" />Kaydediliyor...</>)
                    : (selectedId ? 'Güncelle' : 'Kaydet')}
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
