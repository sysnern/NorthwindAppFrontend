import { useEffect, useState } from "react";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/CustomerService";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ companyName: '', contactName: '' });
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getAllCustomers().then(res => setCustomers(res.data.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    selectedId
      ? await updateCustomer({ customerId: selectedId, ...form })
      : await createCustomer(form);
    setForm({ companyName: '', contactName: '' });
    setSelectedId(null);
    loadData();
  };

  const handleEdit = async (id) => {
    const res = await getCustomerById(id);
    setForm(res.data.data);
    setSelectedId(id);
  };

  const handleDelete = async (id) => {
    await deleteCustomer(id);
    loadData();
  };

  return (
    <div>
      <h2>Müşteri Listesi</h2>
      <form onSubmit={handleSubmit}>
        <input name="companyName" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="Şirket Adı" required />
        <input name="contactName" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} placeholder="İrtibat Kişisi" />
        <button type="submit">{selectedId ? "Güncelle" : "Ekle"}</button>
      </form>
      <ul>
        {customers.map(c => (
          <li key={c.customerId}>
            {c.companyName} - {c.contactName}
            <button onClick={() => handleEdit(c.customerId)}>Düzenle</button>
            <button onClick={() => handleDelete(c.customerId)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerList;
