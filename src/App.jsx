import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,           // ← Burayı ekleyin
} from "react-router-dom";
import ProductList   from "./components/ProductList";
import CategoryList  from "./components/CategoryList";
import CustomerList  from "./components/CustomerList";
import SupplierList  from "./components/SupplierList";
import EmployeeList  from "./components/EmployeeList";
import OrderList     from "./components/OrderList";

export default function App() {
  return (
    <Router>
      <div className="container py-4">
        <nav className="mb-4">
          <Link className="me-3" to="/products">Products</Link>
          <Link className="me-3" to="/categories">Categories</Link>
          <Link className="me-3" to="/customers">Customers</Link>
          <Link className="me-3" to="/suppliers">Suppliers</Link>
          <Link className="me-3" to="/employees">Employees</Link>
          <Link to="/orders">Orders</Link>
        </nav>

        <Routes>
          <Route path="/products"   element={<ProductList />}   />
          <Route path="/categories" element={<CategoryList />}  />
          <Route path="/customers"  element={<CustomerList />}  />
          <Route path="/suppliers"  element={<SupplierList />}  />
          <Route path="/employees"  element={<EmployeeList />}  />
          <Route path="/orders"     element={<OrderList />}     />

          {/* / girilince products’a yönlendir */}
          <Route path="/"           element={<Navigate to="/products" replace />} />
          {/* bilinmeyen tüm rotalarda da products */}
          <Route path="*"           element={<Navigate to="/products" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
