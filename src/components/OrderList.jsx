// src/components/OrderList.jsx
import React, { useEffect, useState } from 'react';
import { getAllOrders, deleteOrder } from '../services/OrderService';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      if (res.success) {
        setOrders(res.data);
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert('Siparişler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleDelete = async (orderID) => {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
    const res = await deleteOrder(orderID);
    if (res.success) loadOrders();
    else alert(res.message);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Sipariş Listesi</h2>
        {/* İleride buraya “Yeni Sipariş” butonu koyabilirsiniz */}
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>OrderID</th>
              <th>CustomerID</th>
              <th>EmployeeID</th>
              <th>Tarih</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.orderID}>
                <td>{o.orderID}</td>
                <td>{o.customerID}</td>
                <td>{o.employeeID}</td>
                <td>
                  {o.orderDate
                    ? new Date(o.orderDate).toLocaleDateString()
                    : '-'}
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-danger me-2"
                    onClick={() => handleDelete(o.orderID)}
                  >
                    <i className="bi bi-trash-fill"></i> {/* Bootstrap Icons */}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    /* onClick={() => editHandler(o.orderID)} */
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="alert alert-warning text-center">
          Henüz hiç sipariş yok.
        </div>
      )}
    </div>
  );
}
