// src/pages/ProductsPage.jsx
import React from "react";
import { Card, Button, Form, Badge } from "react-bootstrap";
import CrudPage from "../components/CrudPage";
import ProductForm from "../components/ProductForm";
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


     renderForm={(form, setForm, saving) => (
      <ProductForm form={form} setForm={setForm} disabled={saving} />
    )}


      filterFields={[
        { name:"productName", label:"Ürün Adı", placeholder:"Ürün Adı" },
        { name:"minPrice",    label:"Min Fiyat",  placeholder:"Min Fiyat", type:"number" },
        { name:"maxPrice",    label:"Max Fiyat",  placeholder:"Max Fiyat", type:"number" },
        { name:"discontinued",label:"Pasif",      type:"checkbox" },
      ]}

      sortOptions={[
        { value:"productName",   label:"Ad (A–Z)" },
        { value:"unitPrice",     label:"Fiyat (Artan)" },
        { value:"unitsInStock",  label:"Stok (Artan)" },
      ]}

      mapItemToId={p=>p.productID}

      renderCardBody={(p, open, del)=>(
        <>
          <Card.Title className="mb-2 text-truncate">{p.productName}</Card.Title>
          <div className="mb-3">
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

      renderFormFields={({ form, setForm, disabled })=>(
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Ürün Adı</Form.Label>
            <Form.Control
              name="productName"
              value={form.productName||""}
              onChange={e=>setForm(f=>({...f, productName:e.target.value}))}
              disabled={disabled}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Fiyat</Form.Label>
            <Form.Control
              name="unitPrice"
              type="number"
              value={form.unitPrice||0}
              onChange={e=>setForm(f=>({...f, unitPrice:+e.target.value}))}
              disabled={disabled}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Stok</Form.Label>
            <Form.Control
              name="unitsInStock"
              type="number"
              value={form.unitsInStock||0}
              onChange={e=>setForm(f=>({...f, unitsInStock:+e.target.value}))}
              disabled={disabled}
            />
          </Form.Group>

          <Form.Check
            type="checkbox"
            name="discontinued"
            label="Pasif"
            checked={form.discontinued||false}
            onChange={e=>setForm(f=>({...f, discontinued:e.target.checked}))}
            disabled={disabled}
          />
        </Form>
      )}
    />
  );
}
