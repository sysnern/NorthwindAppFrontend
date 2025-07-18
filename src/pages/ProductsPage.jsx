import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/ProductService";

export default function ProductsPage() {
  return (
    <CrudPage
      title="Ürünler"
      fetchAll={getAllProducts}
      fetchById={getProductById}
      createItem={createProduct}
      updateItem={updateProduct}
      deleteItem={deleteProduct}

      filterFields={[
        { name:"productName", label:"Ürün Adı", placeholder:"Ürün Adı" },
        { name:"categoryId", label:"Kategori ID", placeholder:"Kategori ID" },
        { name:"minPrice",   label:"Min Fiyat",  placeholder:"Min Fiyat", type:"number" },
        { name:"maxPrice",   label:"Max Fiyat",  placeholder:"Max Fiyat", type:"number" },
        { name:"discontinued", label:"Pasif",     type:"checkbox" },
      ]}

      sortOptions={[
        { value:"productName", label:"Ad (A–Z)" },
        { value:"unitPrice",   label:"Fiyat (Artan)" },
        { value:"unitsInStock",label:"Stok (Artan)" },
      ]}

      mapItemToId={p=>p.productID}

      renderCardBody={(p, open, del) => (
        <>
          <Card.Title className="mb-2 text-truncate">{p.productName}</Card.Title>
          <div className="mb-2">
            <Badge bg="success">₺{p.unitPrice?.toFixed(2)}</Badge>{" "}
            <Badge bg={p.unitsInStock>0?"info":"secondary"}>
              {p.unitsInStock} stok
            </Badge>
          </div>
          <div className="mt-auto d-flex justify-content-between">
            <Button size="sm" variant="outline-primary" onClick={()=>open(p.productID)}>
              Düzenle
            </Button>
            <Button size="sm" variant="outline-danger" onClick={()=>del(p.productID)}>
              Sil
            </Button>
          </div>
        </>
      )}
    />
  );
}
