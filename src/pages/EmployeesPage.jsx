import React from "react";
import { Card, Button } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../services/EmployeeService";

export default function EmployeesPage() {
  return (
    <CrudPage
      title="Çalışanlar"
      fetchAll={getAllEmployees}
      fetchById={getEmployeeById}
      createItem={createEmployee}
      updateItem={updateEmployee}
      deleteItem={deleteEmployee}

      filterFields={[
        { name:"lastName", label:"Soyadı", placeholder:"Soyadı" }
      ]}

      sortOptions={[
        { value:"employeeID", label:"ID (Artan)" },
        { value:"lastName",   label:"Soyadı (A–Z)" },
      ]}

      mapItemToId={e=>e.employeeID}

      renderCardBody={(e, open, del) => (
        <>
          <Card.Title className="mb-2 text-truncate">
            {e.firstName} {e.lastName}
          </Card.Title>
          <div className="mb-2 text-truncate">{e.title}</div>
          <div className="mt-auto d-flex justify-content-between">
            <Button size="sm" variant="outline-primary" onClick={()=>open(e.employeeID)}>
              Düzenle
            </Button>
            <Button size="sm" variant="outline-danger" onClick={()=>del(e.employeeID)}>
              Sil
            </Button>
          </div>
        </>
      )}
    />
  );
}
