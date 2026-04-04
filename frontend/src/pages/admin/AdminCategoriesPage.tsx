import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getPlaceholderImage } from "@/lib/api";
import { CategoryService } from "@/lib/services";
import { Edit, Trash2, Plus, X, Image as ImageIcon, Check } from "lucide-react";

const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", image_url: "", is_active: true });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
  });

  const upsertMutation = useMutation({
    mutationFn: (data: any) => editingCategory 
      ? CategoryService.update(editingCategory.id, data)
      : CategoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: CategoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const openModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        image_url: category.image_url || "",
        is_active: category.is_active ?? true
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", slug: "", image_url: "", is_active: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "name" ? { slug: value.toLowerCase().replace(/ /g, '-') } : {})
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate(formData);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <h1>Categories</h1>
          <span className="badge badge-secondary">{(categories || []).length} total</span>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} className="mr-2" />
          Add Category
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(categories || []).map((c: any) => (
              <tr key={c.id}>
                <td>
                  <div className="category-thumb-wrapper">
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.name} className="product-thumb" />
                    ) : (
                      <div className="product-thumb-placeholder">
                         <ImageIcon size={20} className="text-muted" />
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td className="text-muted font-mono text-sm">{c.slug}</td>
                <td>
                  <span className={`badge badge-${c.is_active ? 'active' : 'draft'}`}>
                    {c.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-sm btn-icon btn-secondary" onClick={() => openModal(c)}>
                      <Edit size={14} />
                    </button>
                    <button className="btn btn-sm btn-icon btn-danger btn-ghost" onClick={() => {
                      if (window.confirm("Delete this category?")) deleteMutation.mutate(c.id);
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content chart-card">
            <div className="modal-header">
              <h3>{editingCategory ? "Update Category" : "New Category"}</h3>
              <button className="btn-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="form-group">
                <label>Category Name</label>
                <input 
                  className="form-input" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Smartphones"
                  required 
                />
              </div>
              <div className="form-group">
                <label>URL Slug</label>
                <input 
                  className="form-input font-mono" 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input 
                  className="form-input" 
                  name="image_url" 
                  value={formData.image_url} 
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="is_active" 
                  checked={formData.is_active} 
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
                <label htmlFor="is_active">Publish Category (visible in store)</label>
              </div>
              <div className="modal-footer pt-4 flex justify-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={upsertMutation.isPending}>
                  {upsertMutation.isPending ? "Saving..." : <span className="flex items-center gap-2"><Check size={18} /> Save Changes</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
