import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/lib/services";
import { Save, X, Image as ImageIcon, Check } from "lucide-react";

const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", slug: "", image_url: "", is_active: true });

  const createMutation = useMutation({
    mutationFn: CategoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/admin/categories");
    },
  });

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
    createMutation.mutate(formData);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Create New Category</h1>
        <Link to="/admin/categories" className="btn btn-secondary">
          <X size={18} className="mr-2" />
          Cancel
        </Link>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="admin-form chart-card space-y-6">
          <div className="form-group">
            <label className="block text-sm font-bold mb-2">Category Name*</label>
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
            <label className="block text-sm font-bold mb-2">URL Slug (Auto-generated)</label>
            <input 
              className="form-input font-mono text-sm bg-gray-50" 
              name="slug" 
              value={formData.slug} 
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-bold mb-2">Image URL</label>
            <div className="flex gap-4">
               <div className="flex-1">
                <input 
                  className="form-input" 
                  name="image_url" 
                  value={formData.image_url} 
                  onChange={handleInputChange}
                  placeholder="https://example.com/category-image.jpg"
                />
               </div>
               <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                 {formData.image_url ? (
                   <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <ImageIcon size={20} className="text-muted" />
                 )}
               </div>
            </div>
            <p className="text-xs text-muted mt-2">Enter a direct link to an image (JPG, PNG, WebP).</p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <input 
              type="checkbox" 
              id="is_active" 
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              checked={formData.is_active} 
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            />
            <label htmlFor="is_active" className="font-semibold cursor-pointer">Publish Category (make it visible in the shop)</label>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="btn btn-primary px-8" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : <span className="flex items-center gap-2"><Check size={18} /> Create Category</span>}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddCategoryPage;
