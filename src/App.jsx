import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import { ToastContainer } from 'react-toastify';
import { LinkContainer } from 'react-router-bootstrap';

import ProductsPage   from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import CustomersPage  from "./pages/CustomersPage";
import SuppliersPage  from "./pages/SuppliersPage";
import EmployeesPage  from "./pages/EmployeesPage";
import OrdersPage     from "./pages/OrdersPage";

export default function App() {
  return (
    <>
      {/* --- ÜST BAR --- */}
      <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
        <Container fluid>
          <Navbar.Brand href="/products" className="fw-bold text-primary">
            Northwind UI
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/products">
                <Nav.Link>Ürünler</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/categories">
                <Nav.Link>Kategoriler</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/customers">
                <Nav.Link>Müşteriler</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/suppliers">
                <Nav.Link>Tedarikçiler</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/employees">
                <Nav.Link>Çalışanlar</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/orders">
                <Nav.Link>Siparişler</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* --- SAYFA İÇERİĞİ --- */}
      <Container fluid className="px-4">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />

          <Route path="/products"   element={<ProductsPage   />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/customers"  element={<CustomersPage  />} />
          <Route path="/suppliers"  element={<SuppliersPage  />} />
          <Route path="/employees"  element={<EmployeesPage  />} />
          <Route path="/orders"     element={<OrdersPage     />} />

          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </Container>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
