import { useEffect, useState } from "react";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/CategoryService";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getAllCategories().then(res => setCategories(res.data.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    selectedId
      ? await updateCategory({ categoryId: selectedId, ...form })
      : await createCategory(form);
    setForm({ name: '', description: '' });
    setSelectedId(null);
    loadData();
  };

  const handleEdit = async (id) => {
    const res = await getCategoryById(id);
    setForm(res.data.data);
    setSelectedId(id);
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    loadData();
  };

  return (
    <div>
      <h2>Kategori Listesi</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Kategori Adı" required />
        <input name="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Açıklama" />
        <button type="submit">{selectedId ? "Güncelle" : "Ekle"}</button>
      </form>
      <ul>
        {categories.map(c => (
          <li key={c.categoryId}>
            {c.categoryName} - {c.description}
            <button onClick={() => handleEdit(c.categoryId)}>Düzenle</button>
            <button onClick={() => handleDelete(c.categoryId)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
