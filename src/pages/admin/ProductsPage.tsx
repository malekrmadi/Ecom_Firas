import React from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/mock";
import AdminLayout from "@/components/admin/AdminLayout";

const ProductsPage: React.FC = () => (
  <AdminLayout>
    <div className="admin-page-header">
      <h1>Products</h1>
      <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
    </div>
    <div className="table-wrapper">
      <div className="table-toolbar">
        <div className="table-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search products..." />
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src={p.images[0]} alt="" className="product-thumb" />
                <span style={{ fontWeight: 500 }}>{p.name}</span>
              </td>
              <td>{p.category}</td>
              <td className="tabular">{p.price.toLocaleString()} TND</td>
              <td className="tabular">{p.stock}</td>
              <td>
                {p.stock === 0
                  ? <span className="badge badge-out-of-stock">Out of stock</span>
                  : <span className={`badge badge-${p.status}`}>{p.status === "active" ? "Active" : "Draft"}</span>
                }
              </td>
              <td>
                <div className="table-actions">
                  <button className="btn btn-sm btn-secondary">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminLayout>
);

export default ProductsPage;
