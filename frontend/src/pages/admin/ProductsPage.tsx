import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getPlaceholderImage } from "@/lib/api";

const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then(res => res.data),
  });

  // Fetch categories to map category_id to name
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then(res => res.data),
  });

  const categoriesMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (categories) {
      categories.forEach((c: any) => {
        map[c.id] = c.name;
      });
    }
    return map;
  }, [categories]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
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
            {(products || []).map((p: any) => {
              const stock = p.ProductVariants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
              return (
                <tr key={p.id}>
                  <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <img src={getPlaceholderImage(p.id)} alt="" className="product-thumb" />
                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                  </td>
                  <td>{categoriesMap[p.category_id] || "Unknown"}</td>
                  <td className="tabular">{parseFloat(p.base_price || 0).toLocaleString()} TND</td>
                  <td className="tabular">{stock}</td>
                  <td>
                    {stock === 0 && (!p.ProductVariants || p.ProductVariants.length > 0)
                      ? <span className="badge badge-out-of-stock">Out of stock</span>
                      : <span className={`badge badge-${p.is_active ? 'active' : 'draft'}`}>{p.is_active ? 'Active' : 'Draft'}</span>
                    }
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-sm btn-secondary" onClick={() => alert("Edit not implemented fully yet")}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!products?.length && !isLoading && (
              <tr><td colSpan={6} style={{textAlign: "center", padding: "1rem"}}>No products found</td></tr>
            )}
            {isLoading && (
              <tr><td colSpan={6} style={{textAlign: "center", padding: "1rem"}}>Loading...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
