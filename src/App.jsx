import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import config from './config/config';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalLoading from './components/GlobalLoading';

import HomePage       from "./pages/HomePage";
import ProductsPage   from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import CustomersPage  from "./pages/CustomersPage";
import SuppliersPage  from "./pages/SuppliersPage";
import EmployeesPage  from "./pages/EmployeesPage";
import OrdersPage     from "./pages/OrdersPage";

export default function App() {
  return (
    <>
      <ErrorBoundary>
        <GlobalLoading />
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand href="/">
              <i className="bi bi-building me-2"></i>
              Northwind App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="main-nav" />
            <Navbar.Collapse id="main-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">Anasayfa</Nav.Link>
                <Nav.Link as={Link} to="/products">Ürünler</Nav.Link>
                <Nav.Link as={Link} to="/categories">Kategoriler</Nav.Link>
                <Nav.Link as={Link} to="/customers">Müşteriler</Nav.Link>
                <Nav.Link as={Link} to="/suppliers">Tedarikçiler</Nav.Link>
                <Nav.Link as={Link} to="/employees">Çalışanlar</Nav.Link>
                <Nav.Link as={Link} to="/orders">Siparişler</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container fluid>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            {/* Bilinmeyen yol gelirse anasayfaya yönlendir */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer 
            position={config.toast.position} 
            autoClose={config.toast.autoClose}
            hideProgressBar={config.toast.hideProgressBar}
            closeOnClick={config.toast.closeOnClick}
            pauseOnHover={config.toast.pauseOnHover}
            draggable={config.toast.draggable}
          />
        </Container>
      </ErrorBoundary>
    </>
  );
}
