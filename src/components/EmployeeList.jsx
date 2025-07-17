// src/components/EmployeeList.jsx
import { useEffect, useState } from "react";
import { getAllEmployees, deleteEmployee, getEmployeeById } from "../services/EmployeeService";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const loadData = async () => {
    const res = await getAllEmployees();
    if (res.success) {
      setEmployees(res.data);
    } else {
      alert(res.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    await deleteEmployee(id);
    await loadData();
  };

  return (
    <div>
      <h2>Çalışan Listesi</h2>
      <ul>
        {employees.map((e) => (
          <li key={e.employeeId}>
            {e.firstName} {e.lastName} - {e.title}
            <button onClick={() => handleDelete(e.employeeId)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeList;
