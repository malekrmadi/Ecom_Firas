import AdminLayout from "@/components/admin/AdminLayout";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getPlaceholderImage, API_BASE } from "@/lib/api";
import { CategoryService } from "@/lib/services";
import { Edit, Trash2, Plus, X, Image as ImageIcon, Check } from "lucide-react";

const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: CategoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <h1>Catégories</h1>
          <span className="badge badge-secondary">{(categories || []).length} au total</span>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/admin/categories/new")}>
          <Plus size={18} className="mr-2" />
          Ajouter une Catégorie
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>Image</th>
              <th>Nom</th>
              <th>Slug</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(categories || []).map((c: any) => (
              <tr key={c.id}>
                <td>
                  <div className="category-thumb-wrapper">
                    {c.image_url ? (
                      <img src={`${API_BASE}${c.image_url}`} alt={c.name} className="product-thumb" />
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
                    {c.is_active ? 'Active' : 'Masquée'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-sm btn-icon btn-secondary" onClick={() => navigate(`/admin/categories/${c.id}`)}>
                      <Edit size={14} />
                    </button>
                    <button className="btn btn-sm btn-icon btn-danger btn-ghost" onClick={() => {
                      if (window.confirm("Supprimer cette catégorie ?")) deleteMutation.mutate(c.id);
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

    </AdminLayout>
  );
};

export default AdminCategoriesPage;
