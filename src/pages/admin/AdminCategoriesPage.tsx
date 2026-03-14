import React from "react";
import { categories } from "@/data/mock";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminCategoriesPage: React.FC = () => (
  <AdminLayout>
    <div className="admin-page-header">
      <h1>Categories</h1>
      <button className="btn btn-primary">+ Add Category</button>
    </div>
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr><th>Image</th><th>Name</th><th>Slug</th><th>Products</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td><img src={c.image} alt="" className="product-thumb" /></td>
              <td style={{ fontWeight: 500 }}>{c.name}</td>
              <td style={{ color: "var(--fg-muted)" }}>{c.slug}</td>
              <td className="tabular">{c.count}</td>
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

export default AdminCategoriesPage;
