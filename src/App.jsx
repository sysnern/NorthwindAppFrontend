// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./components/ProductList";
import CategoryList from "./components/CategoryList";
import CustomerList from "./components/CustomerList";
import SupplierList from "./components/SupplierList";
import EmployeeList from "./components/EmployeeList";
import OrderList from "./components/OrderList";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/products">Products</Link> |{" "}
          <Link to="/categories">Categories</Link> |{" "}
          <Link to="/customers">Customers</Link> |{" "}
          <Link to="/suppliers">Suppliers</Link> |{" "}
          <Link to="/employees">Employees</Link> |{" "}
          <Link to="/orders">Orders</Link>
        </nav>
        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/orders" element={<OrderList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
