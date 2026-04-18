import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/lib/services";
import { Save, X, Image as ImageIcon, Check, Upload } from "lucide-react";

const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", slug: "", is_active: true });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La taille de l'image doit être inférieure à 5 Mo");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('slug', formData.slug);
    data.append('is_active', formData.is_active ? 'true' : 'false');
    if (image) {
      data.append('image', image);
    }
    createMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Créer une Nouvelle Catégorie</h1>
        <Link to="/admin/categories" className="btn btn-secondary">
          <X size={18} className="mr-2" />
          Annuler
        </Link>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="admin-form chart-card space-y-6">
          <div className="form-group">
            <label className="block text-sm font-bold mb-2">Nom de la Catégorie*</label>
            <input 
              className="form-input" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="ex: Smartphones"
              required 
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-bold mb-2">Slug URL (Généré automatiquement)</label>
            <input 
              className="form-input font-mono text-sm bg-gray-50" 
              name="slug" 
              value={formData.slug} 
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="form-group border-t border-gray-100 pt-6">
            <label className="block text-sm font-bold mb-4">Image de la Catégorie</label>
            <div className="flex flex-col md:flex-row gap-6">
              <div 
                className={`relative w-full md:w-32 h-32 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center overflow-hidden bg-gray-50 ${
                  imagePreview ? 'border-primary/30' : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setImage(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-gray-400 mb-1" size={20} />
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">Photo</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                />
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <p className="text-xs text-muted flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  JPEG, PNG, JPG, WEBP
                </p>
                <p className="text-xs text-muted flex items-center gap-2">
                  <ImageIcon size={14} className="text-blue-500" />
                  Taille Max : 5 Mo
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <input 
              type="checkbox" 
              id="is_active" 
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              checked={formData.is_active} 
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            />
            <label htmlFor="is_active" className="font-semibold cursor-pointer">Publier la catégorie (la rendre visible en magasin)</label>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="btn btn-primary px-8" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Création..." : <span className="flex items-center gap-2"><Check size={18} /> Créer la Catégorie</span>}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddCategoryPage;
