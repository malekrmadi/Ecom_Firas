import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService, CategoryService, AttributeService, Product, ProductVariant } from "@/lib/services";
import { Layers, Save, Trash2, AlertCircle, ArrowLeft, Package, Plus, Loader2, Tag, X as CloseIcon } from "lucide-react";

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Basic Info
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    base_price: 0,
    category_id: 0,
    is_active: true
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch product data
  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductService.getById(id!),
    enabled: !!id
  });

  // Fetch categories
  const { data: categories } = useQuery({ 
    queryKey: ["categories"], 
    queryFn: CategoryService.getAll 
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        base_price: parseFloat(product.base_price),
        category_id: product.category_id,
        is_active: product.is_active
      });
    }
  }, [product]);

  const updateProductMutation = useMutation({
    mutationFn: (data: Partial<Product>) => ProductService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      alert("Product updated successfully");
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: ({ variantId, data }: { variantId: number; data: Partial<ProductVariant> }) => 
      ProductService.updateVariant(variantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });

  const createVariantMutation = useMutation({
    mutationFn: (data: Partial<ProductVariant>) => ProductService.createVariant(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message;
      alert(`Failed to add variant: ${msg}`);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProductMutation.mutateAsync({
        ...formData,
        slug: formData.name?.toLowerCase().replace(/ /g, '-')
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingProduct) return <AdminLayout><div className="flex items-center justify-center p-24"><Loader2 className="animate-spin text-primary" size={32} /></div></AdminLayout>;

  const totalStock = product?.ProductVariants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Edit Product: {product?.name}</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
              <Package size={18} className="text-primary" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider leading-none">Total Stock</span>
                <span className="text-sm font-bold">{totalStock} units</span>
              </div>
           </div>
           <button onClick={handleSubmit} className="btn btn-primary" disabled={isSaving}>
             {isSaving ? "Saving..." : <span className="flex items-center gap-2"><Save size={18} /> Update Product</span>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <form className="admin-form chart-card space-y-6">
            <h2 className="text-xl font-bold m-0">General Details</h2>
            <div className="form-group">
              <label className="block text-sm font-bold mb-2">Product Name*</label>
              <input 
                className="form-input" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea 
                className="form-input" 
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                rows={5} 
              />
            </div>
            <div className="form-row grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-bold mb-2">Category*</label>
                <select 
                  className="form-input" 
                  value={formData.category_id} 
                  onChange={e => setFormData({ ...formData, category_id: parseInt(e.target.value) })} 
                  required
                >
                  {(categories || []).map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="block text-sm font-bold mb-2">Product Status</label>
                <select 
                  className="form-input" 
                  value={formData.is_active ? "true" : "false"}
                  onChange={e => setFormData({ ...formData, is_active: e.target.value === "true" })}
                >
                  <option value="true">Active & Visible</option>
                  <option value="false">Hidden / Draft</option>
                </select>
              </div>
            </div>
          </form>

          {/* Variants Management */}
          <section className="chart-card">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                   <Layers size={22} />
                </div>
                <h2 className="text-xl font-bold m-0">Inventory & Variants</h2>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                   const sku = prompt("Enter SKU for new variant:");
                   if (sku) createVariantMutation.mutate({ sku, price: formData.base_price, stock: 0 });
                }}
              >
                <Plus size={16} className="mr-2" /> Add New SKU
              </button>
            </div>

            <div className="table-wrapper border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="data-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th>Variant Attributes</th>
                    <th>SKU</th>
                    <th>Stock Level</th>
                    <th className="text-center">Feeding Logic</th>
                  </tr>
                </thead>
                <tbody>
                  {(product?.ProductVariants || []).map((v: any) => (
                    <VariantRow 
                      key={v.id} 
                      variant={v} 
                      onUpdate={(data) => updateVariantMutation.mutate({ variantId: v.id, data })} 
                    />
                  ))}
                  {(!product?.ProductVariants || product.ProductVariants.length === 0) && (
                    <tr><td colSpan={4} className="text-center p-12 text-muted italic">No variants found. Add a SKU to manage stock.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 flex gap-4 items-start shadow-inner">
               <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400">
                  <AlertCircle size={16} />
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 m-0">Inventory Policy</p>
                  <p className="text-xs text-slate-500 m-0 leading-relaxed">
                    Stock updates are atomic. "Feeding" stock adds to the current balance. Total stock is recalculated across all active variants.
                  </p>
               </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="chart-card">
            <h2 className="text-xl font-bold mb-6">Price Controller</h2>
            <div className="form-group mb-6">
              <label className="block text-sm font-bold mb-2">Display Price (TND)*</label>
              <div className="relative">
                <input 
                  className="form-input pl-12 font-bold text-xl" 
                  type="number" 
                  step="0.01" 
                  value={formData.base_price} 
                  onChange={e => setFormData({ ...formData, base_price: parseFloat(e.target.value) })} 
                  required 
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">DT</div>
              </div>
              <p className="text-[10px] text-muted mt-3 uppercase tracking-widest font-bold">Syncs with all variants</p>
            </div>
          </section>

          <section className="chart-card bg-red-50/50 border-red-100">
             <div className="flex items-center gap-2 mb-4 text-red-600">
                <Trash2 size={18} />
                <h3 className="text-sm font-bold m-0 uppercase tracking-wider">Danger Zone</h3>
             </div>
             <p className="text-xs text-red-600/70 mb-6">Once deleted, a product and all its sales history cannot be recovered.</p>
             <button className="btn btn-danger btn-ghost btn-sm w-full font-bold border-red-200 hover:bg-red-100">
                Delete Product Permanently
             </button>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

// Advanced Variant Row with "Feed Stock" logic
const VariantRow = ({ variant, onUpdate }: { variant: any, onUpdate: (data: any) => void }) => {
  const [stockAdd, setStockAdd] = useState("");
  const isLowStock = variant.stock <= 5;

  const handleAdd = (amount: number) => {
    onUpdate({ stock: variant.stock + amount });
  };

  const handleDirectStockUpdate = (newStock: number) => {
    onUpdate({ stock: newStock });
  };

  const { data: allAttributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => ProductService.getById(variant.product_id).then(() => AttributeService.getAll())
  });

  const addAttrMutation = useMutation({
    mutationFn: (attributeValueId: number) => ProductService.addVariantAttribute(variant.id, attributeValueId),
    onSuccess: () => {
      // Invalidate the specific product query to refresh the row
      window.location.reload(); // Quickest way for now given the context
    }
  });

  return (
    <tr className="hover:bg-gray-50/30 transition-colors">
      <td className="py-4">
        <div className="flex gap-2 flex-wrap items-center">
          {variant.AttributeValues?.map((av: any) => (
            <span key={av.id} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-xs font-bold border border-primary/20">
              {av.Attribute?.name}: {av.value}
            </span>
          ))}
          
          <div className="relative group/attr">
            <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all">
              <Plus size={14} />
            </button>
            <div className="absolute left-0 top-full mt-2 hidden group-focus-within/attr:block group-hover/attr:block bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 z-50 min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-200">
               <div className="flex items-center gap-2 mb-3 text-gray-400">
                  <Tag size={12} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Link Attribute</span>
               </div>
               <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  {allAttributes?.map((attr: any) => (
                    <div key={attr.id} className="space-y-1.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{attr.name}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {attr.AttributeValues?.map((val: any) => (
                          <button 
                            key={val.id}
                            onClick={() => addAttrMutation.mutate(val.id)}
                            className="px-2 py-1 bg-gray-50 hover:bg-primary hover:text-white rounded-md text-[10px] font-bold transition-colors border border-gray-200"
                          >
                            {val.value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {(!variant.AttributeValues || variant.AttributeValues.length === 0) && <span className="text-muted italic text-[10px] uppercase tracking-wide opacity-50 ml-2">No attributes linked</span>}
        </div>
      </td>
      <td className="tabular text-xs font-mono text-slate-500 tracking-tighter">{variant.sku}</td>
      <td>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${variant.stock > 0 ? (isLowStock ? 'bg-orange-500' : 'bg-green-500') : 'bg-red-500'}`}></div>
          <span className={`text-sm font-bold tabular ${isLowStock && variant.stock > 0 ? 'text-orange-600' : ''}`}>
            {variant.stock} <span className="text-[10px] text-muted font-normal">PCS</span>
          </span>
        </div>
      </td>
      <td>
        <div className="flex items-center justify-center gap-2">
           <button 
             onClick={() => handleAdd(1)} 
             className="w-10 h-10 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs transition-all border border-primary/10"
             title="Add 1 item"
           >
             +1
           </button>
           <button 
             onClick={() => handleAdd(5)} 
             className="w-10 h-10 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs transition-all border border-primary/10"
             title="Add 5 items"
           >
             +5
           </button>
           <button 
             onClick={() => handleAdd(10)} 
             className="w-10 h-10 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs transition-all border border-primary/10"
             title="Add 10 items"
           >
             +10
           </button>
           <div className="w-px h-6 bg-gray-200 mx-1"></div>
           <input 
             type="number" 
             placeholder="Set"
             className="w-16 h-10 px-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-center tabular focus:border-primary focus:ring-0 outline-none"
             defaultValue={variant.stock}
             onBlur={(e) => handleDirectStockUpdate(parseInt(e.target.value) || 0)}
           />
        </div>
      </td>
    </tr>
  );
};

export default EditProductPage;
