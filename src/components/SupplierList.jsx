// src/components/SupplierList.jsx
import { useEffect, useState } from "react";
import { getAllSuppliers, deleteSupplier, getSupplierById } from "../services/SupplierService";

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);

  const loadData = async () => {
    const res = await getAllSuppliers();
    if (res.success) {
      setSuppliers(res.data);
    } else {
      alert(res.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    await deleteSupplier(id);
    await loadData();
  };

  return (
    <div>
      <h2>Tedarikçi Listesi</h2>
      <ul>
        {suppliers.map((s) => (
          <li key={s.supplierId}>
            {s.companyName} - {s.contactName}
            <button onClick={() => handleDelete(s.supplierId)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SupplierList;
