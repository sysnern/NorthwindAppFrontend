import React from "react";
import { Card, Button } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/CategoryService";

export default function CategoriesPage() {
  return (
    <CrudPage
      title="Kategoriler"
      fetchAll={getAllCategories}
      fetchById={getCategoryById}
      createItem={createCategory}
      updateItem={updateCategory}
      deleteItem={deleteCategory}

      filterFields={[
        { name:"categoryName", label:"Kategori Adı", placeholder:"Kategori Adı" }
      ]}

      sortOptions={[
        { value:"categoryID",   label:"ID (Artan)" },
        { value:"categoryName", label:"Ad (A–Z)" },
      ]}

      mapItemToId={c=>c.categoryID}

      renderCardBody={(c, open, del) => (
        <>
          <Card.Title className="mb-2 text-truncate">
            {c.categoryName}
          </Card.Title>
          <div className="mt-auto d-flex justify-content-between">
            <Button size="sm" variant="outline-primary" onClick={()=>open(c.categoryID)}>
              Düzenle
            </Button>
            <Button size="sm" variant="outline-danger" onClick={()=>del(c.categoryID)}>
              Sil
            </Button>
          </div>
        </>
      )}
    />
  );
}
