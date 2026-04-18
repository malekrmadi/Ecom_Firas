import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService, CategoryService } from "@/lib/services";
import { getPlaceholderImage, API_BASE } from "@/lib/api";
import { Edit, Trash2, Plus, Search, ChevronDown, ChevronRight, PackageOpen } from "lucide-react";

const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: ProductService.getAll,
  });

  // Fetch categories to map category_id to name
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
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
    mutationFn: ProductService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product? All variants will be lost.")) {
      deleteMutation.mutate(id);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Produits</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          <Plus size={18} className="mr-2" />
          Ajouter un Produit
        </Link>
      </div>
      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} />
            <input placeholder="Rechercher des produits..." />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}></th>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Prix de Base</th>
              <th>Stock Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p: any) => {
              const stock = p.ProductVariants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
              const isExpanded = expandedRows[p.id];

              return (
                <React.Fragment key={p.id}>
                  <tr>
                    <td>
                      <button 
                        className="btn btn-icon btn-ghost btn-xs" 
                        onClick={() => toggleExpand(p.id)}
                        title="View variants"
                      >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </td>
                    <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img 
                        src={p.image_url ? `${API_BASE}${p.image_url}` : getPlaceholderImage(p.id)} 
                        alt="" 
                        className="product-thumb" 
                      />
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </td>
                    <td>{categoriesMap[p.category_id] || "Unknown"}</td>
                    <td className="tabular">{parseFloat(p.base_price || 0).toLocaleString()} TND</td>
                    <td className="tabular">{stock}</td>
                    <td>
                      {stock === 0 && (!p.ProductVariants || p.ProductVariants.length > 0)
                        ? <span className="badge badge-out-of-stock">Rupture</span>
                        : <span className={`badge badge-${p.is_active ? 'active' : 'draft'}`}>{p.is_active ? 'Actif' : 'Brouillon'}</span>
                      }
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-sm btn-secondary" 
                          onClick={() => navigate(`/admin/products/${p.id}`)}
                        >
                          <Edit size={14} className="mr-1" />
                          Modifier
                        </button>
                        <button 
                          className="btn btn-sm btn-danger btn-ghost" 
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="expanded-row">
                      <td colSpan={7} style={{ padding: "0" }}>
                        <div className="variant-details-subview">
                          <div className="flex items-center gap-2 mb-3 px-4 pt-3">
                            <PackageOpen size={16} className="text-primary" />
                            <h4 className="m-0 text-sm font-semibold">Détail du Stock par Variante</h4>
                          </div>
                          <table className="sub-table w-full">
                            <thead>
                                <tr>
                                  <th style={{ paddingLeft: "48px" }}>SKU</th>
                                  <th>Combinaison</th>
                                  <th>Prix</th>
                                  <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                              {(p.ProductVariants || []).map((v: any) => (
                                <tr key={v.id}>
                                  <td style={{ paddingLeft: "48px" }} className="tabular font-mono text-xs">{v.sku}</td>
                                  <td>
                                    <div className="flex gap-1">
                                      {v.AttributeValues?.map((av: any) => (
                                        <span key={av.id} className="badge badge-secondary badge-xs">
                                          {av.value}
                                        </span>
                                      ))}
                                      {(!v.AttributeValues || v.AttributeValues.length === 0) && <span className="text-muted text-xs italic">Par défaut</span>}
                                    </div>
                                  </td>
                                  <td className="tabular">{parseFloat(v.price || 0).toLocaleString()} TND</td>
                                  <td className="tabular">
                                    <span className={v.stock === 0 ? "text-red-500 font-bold" : v.stock <= 5 ? "text-orange-500" : ""}>
                                      {v.stock}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              {(!p.ProductVariants || p.ProductVariants.length === 0) && (
                                <tr>
                                  <td colSpan={4} className="text-center p-4 text-muted italic">Aucune variante définie</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {!products?.length && !isLoading && (
              <tr><td colSpan={7} style={{textAlign: "center", padding: "1rem"}}>Aucun produit trouvé</td></tr>
            )}
            {isLoading && (
              <tr><td colSpan={7} style={{textAlign: "center", padding: "1rem"}}>Chargement...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
