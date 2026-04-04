import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories for the select dropdown
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post("/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    },
    onError: (err) => {
      alert("Error adding product");
      console.error(err);
      setIsLoading(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !basePrice) {
      alert("Please fill required fields (Name, Category, Price)");
      return;
    }
    
    setIsLoading(true);
    createMutation.mutate({
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      description,
      base_price: parseFloat(basePrice),
      category_id: parseInt(categoryId, 10),
      is_active: true
    });
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Add New Product</h1>
        <Link to="/admin/products" className="btn btn-secondary">← Back</Link>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>Product Information</h2>
        <div className="form-group">
          <label>Product Name*</label>
          <input className="form-input" placeholder="Enter product name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the product..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Category*</label>
            <select className="form-input" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
              <option value="">Select category</option>
              {(categories || []).map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Price (TND)*</label>
            <input className="form-input" type="number" step="0.01" value={basePrice} onChange={e => setBasePrice(e.target.value)} placeholder="0.00" required />
          </div>
        </div>
        {/* Removed Variants and Images as backend currently doesn't seamlessly support nested creates or image storage */}
        <div className="admin-form-actions" style={{ marginTop: '2rem' }}>
          <Link to="/admin/products" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddProductPage;
