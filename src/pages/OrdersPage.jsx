import React from "react";
import { Card, Button } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from "../services/OrderService";

export default function OrdersPage() {
  return (
    <CrudPage
      title="Siparişler"
      fetchAll={getAllOrders}
      fetchById={getOrderById}
      createItem={createOrder}
      updateItem={updateOrder}
      deleteItem={deleteOrder}

      filterFields={[
        { name:"customerID", label:"Müşteri ID", placeholder:"Müşteri ID" }
      ]}

      sortOptions={[
        { value:"orderID",    label:"ID (Artan)" },
        { value:"orderDate",  label:"Tarih (Eski–Yeni)" },
      ]}

      mapItemToId={o=>o.orderID}

      renderCardBody={(o, open, del) => (
        <>
          <Card.Title className="mb-2 text-truncate">
            Sipariş #{o.orderID}
          </Card.Title>
          <div className="mb-2 text-truncate">
            Tarih: {o.orderDate?.slice(0,10)}
          </div>
          <div className="mt-auto d-flex justify-content-between">
            <Button size="sm" variant="outline-primary" onClick={()=>open(o.orderID)}>
              Düzenle
            </Button>
            <Button size="sm" variant="outline-danger" onClick={()=>del(o.orderID)}>
              Sil
            </Button>
          </div>
        </>
      )}
    />
  );
}
