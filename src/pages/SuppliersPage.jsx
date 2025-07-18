import React from "react";
import { Card, Button } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../services/SupplierService";

export default function SuppliersPage() {
  return (
    <CrudPage
      title="Tedarikçiler"
      fetchAll={getAllSuppliers}
      fetchById={getSupplierById}
      createItem={createSupplier}
      updateItem={updateSupplier}
      deleteItem={deleteSupplier}

      filterFields={[
        { name:"companyName", label:"Şirket Adı", placeholder:"Şirket Adı" }
      ]}

      sortOptions={[
        { value:"supplierID",   label:"ID (Artan)" },
        { value:"companyName",  label:"Şirket (A–Z)" },
      ]}

      mapItemToId={s=>s.supplierID}

      renderCardBody={(s, open, del) => (
        <>
          <Card.Title className="mb-2 text-truncate">
            {s.companyName}
          </Card.Title>
          <div className="mb-2 text-truncate">{s.contactName}</div>
          <div className="mt-auto d-flex justify-content-between">
            <Button size="sm" variant="outline-primary" onClick={()=>open(s.supplierID)}>
              Düzenle
            </Button>
            <Button size="sm" variant="outline-danger" onClick={()=>del(s.supplierID)}>
              Sil
            </Button>
          </div>
        </>
      )}
    />
  );
}
