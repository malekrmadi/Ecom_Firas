import React from "react";
import { Link } from "react-router-dom";
import { categories as catData } from "@/data/mock";
import AdminLayout from "@/components/admin/AdminLayout";

const AddProductPage: React.FC = () => (
  <AdminLayout>
    <div className="admin-page-header">
      <h1>Add New Product</h1>
      <Link to="/admin/products" className="btn btn-secondary">← Back</Link>
    </div>
    <div className="admin-form">
      <h2>Product Information</h2>
      <div className="form-group">
        <label>Product Name</label>
        <input className="form-input" placeholder="Enter product name" />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea className="form-input" placeholder="Describe the product..." />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select className="form-input">
            <option value="">Select category</option>
            {catData.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Price (TND)</label>
          <input className="form-input" type="number" placeholder="0" />
        </div>
      </div>
      <div className="form-group">
        <label>Stock Quantity</label>
        <input className="form-input" type="number" placeholder="0" />
      </div>
      <h2>Variants</h2>
      <div className="form-group">
        <label>Sizes (comma separated)</label>
        <input className="form-input" placeholder="S, M, L, XL" />
      </div>
      <div className="form-group">
        <label>Colors (comma separated)</label>
        <input className="form-input" placeholder="Black, White, Red" />
      </div>
      <h2>Images</h2>
      <div className="form-group">
        <label>Image URLs (one per line)</label>
        <textarea className="form-input" placeholder="https://..." />
      </div>
      <div className="admin-form-actions">
        <Link to="/admin/products" className="btn btn-secondary">Cancel</Link>
        <button className="btn btn-primary">Save Product</button>
      </div>
    </div>
  </AdminLayout>
);

export default AddProductPage;
