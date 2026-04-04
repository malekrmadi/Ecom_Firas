import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getPlaceholderImage } from "@/lib/api";

const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Categories</h1>
        <button className="btn btn-primary" onClick={() => {
          const name = window.prompt("New category name:");
          if (name) {
            const slug = name.toLowerCase().replace(/ /g, '-');
            api.post("/categories", { name, slug }).then(() => queryClient.invalidateQueries({ queryKey: ["categories"] }));
          }
        }}>+ Add Category</button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Slug</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {(categories || []).map((c: any) => (
              <tr key={c.id}>
                <td><img src={getPlaceholderImage(`cat_${c.id}`)} alt="" className="product-thumb" /></td>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td style={{ color: "var(--fg-muted)" }}>{c.slug}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => {
                      const name = window.prompt("Edit category name:", c.name);
                      if (name && name !== c.name) {
                        api.put(`/categories/${c.id}`, { name, slug: name.toLowerCase().replace(/ /g, '-') }).then(() => queryClient.invalidateQueries({ queryKey: ["categories"] }));
                      }
                    }}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!categories?.length && !isLoading && (
              <tr><td colSpan={4} style={{textAlign: "center", padding: "1rem"}}>No categories found</td></tr>
            )}
            {isLoading && (
              <tr><td colSpan={4} style={{textAlign: "center", padding: "1rem"}}>Loading...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
