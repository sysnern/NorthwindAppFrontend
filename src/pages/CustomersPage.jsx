import React from "react";
import { Card, Button } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../services/CustomerService";

export default function CustomersPage() {
  return (
    <CrudPage
      title="Müşteriler"
      fetchAll={getAllCustomers}
      fetchById={getCustomerById}
      createItem={createCustomer}
      updateItem={updateCustomer}
      deleteItem={deleteCustomer}

      filterFields={[
        { name:"companyName", label:"Şirket Adı", placeholder:"Şirket Adı" }
      ]}

      sortOptions={[
        { value:"customerID",  label:"ID (Artan)" },
        { value:"companyName", label:"Şirket (A–Z)" },
      ]}

      mapItemToId={c=>c.customerID}

      renderCardBody={(c, open, del) => (
        <>
          <Card.Title className="mb-2 text-truncate">
            {c.companyName}
          </Card.Title>
          <div className="mb-2 text-truncate">{c.contactName}</div>
          <div className="mt-auto d-flex justify-content-between">
            <Button size="sm" variant="outline-primary" onClick={()=>open(c.customerID)}>
              Düzenle
            </Button>
            <Button size="sm" variant="outline-danger" onClick={()=>del(c.customerID)}>
              Sil
            </Button>
          </div>
        </>
      )}
    />
  );
}
