import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService, CategoryService, AttributeService, Attribute, AttributeValue } from "@/lib/services";
import { Plus, Trash2, Layers, Check, X, Upload, Image as ImageIcon } from "lucide-react";

interface VariantForm {
  sku: string;
  price: number;
  stock: number;
  values: AttributeValue[]; // The combination of attribute values that define this variant
}

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Basic Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Variant Management
  const [useVariants, setUseVariants] = useState(false);
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<number[]>([]);
  const [selectedValueIds, setSelectedValueIds] = useState<Record<number, number[]>>({});
  const [generatedVariants, setGeneratedVariants] = useState<VariantForm[]>([]);

  // Data Fetching
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: CategoryService.getAll });
  const { data: attributes } = useQuery<Attribute[]>({ queryKey: ["attributes"], queryFn: AttributeService.getAll });

  // Helpers
  const cartesianProduct = (arrays: any[][]) => {
    return arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]]);
  };

  const handleGenerateVariants = () => {
    if (Object.keys(selectedValueIds).length === 0) return;

    const valuesToCombine: AttributeValue[][] = [];
    selectedAttributeIds.forEach(attrId => {
      const attr = attributes?.find(a => a.id === attrId);
      const valIds = selectedValueIds[attrId] || [];
      const vals = attr?.AttributeValues?.filter(v => valIds.includes(v.id)) || [];
      if (vals.length > 0) valuesToCombine.push(vals);
    });

    if (valuesToCombine.length === 0) return;

    const combinations = cartesianProduct(valuesToCombine);
    const newVariants: VariantForm[] = combinations.map((combo: AttributeValue[]) => ({
      sku: `${name.substring(0, 3).toUpperCase()}-${combo.map(v => v.value.substring(0, 2).toUpperCase()).join("-")}`,
      price: parseFloat(basePrice) || 0,
      stock: 0,
      values: combo
    }));

    setGeneratedVariants(newVariants);
  };

  const handleToggleAttribute = (id: number) => {
    setSelectedAttributeIds(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleToggleValue = (attrId: number, valId: number) => {
    setSelectedValueIds(prev => {
      const current = prev[attrId] || [];
      const next = current.includes(valId) ? current.filter(v => v !== valId) : [...current, valId];
      return { ...prev, [attrId]: next };
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !basePrice) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    setIsSaving(true);
    try {
      const productPrice = parseFloat(basePrice);
      
      // 1. Prepare FormData for Product
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', name.toLowerCase().replace(/ /g, '-'));
      formData.append('description', description);
      formData.append('base_price', productPrice.toString());
      formData.append('category_id', categoryId);
      formData.append('is_active', 'true');
      if (image) {
        formData.append('image', image);
      }

      // 2. Create Product
      const product = await ProductService.create(formData);

      // 3. Create Variants
      if (useVariants && generatedVariants.length > 0) {
        for (const vForm of generatedVariants) {
          try {
            const variant = await ProductService.createVariant(product.id, {
              sku: vForm.sku,
              price: productPrice,
              stock: vForm.stock
            });

            for (const val of vForm.values) {
              await ProductService.addVariantAttribute(variant.id, val.id);
            }
          } catch (vErr: any) {
            const msg = vErr.response?.data?.error || vErr.message;
            throw new Error(`Échec de la variante "${vForm.sku}" : ${msg}`);
          }
        }
      } else if (!useVariants) {
        await ProductService.createVariant(product.id, {
          sku: `${name.substring(0, 3).toUpperCase()}-DEF`,
          price: productPrice,
          stock: 0
        });
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Échec de l'enregistrement du produit.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Ajouter un Nouveau Produit</h1>
        <Link to="/admin/products" className="btn btn-secondary">← Retour</Link>
      </div>

      <form className="admin-form space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="chart-card">
              <h2 className="text-xl font-bold mb-6">Informations Générales</h2>
              <div className="form-group mb-6">
                <label className="block text-sm font-bold mb-2">Nom du Produit*</label>
                <input 
                  className="form-input" 
                  placeholder="ex: Robe Traditionnelle Kabyle" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group mb-6">
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea 
                  className="form-input" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Artisanat premium tunisien..." 
                  rows={6} 
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-bold mb-4">Image du Produit</label>
                <div className="flex flex-col md:flex-row gap-6">
                  <div 
                    className={`relative w-full md:w-48 h-48 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center overflow-hidden bg-gray-50 ${
                      imagePreview ? 'border-primary/30' : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => { setImage(null); setImagePreview(null); }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Charger Photo</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleImageChange}
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                    />
                  </div>
                  <div className="flex-1 space-y-3 pt-2">
                    <p className="text-xs text-muted flex items-center gap-2">
                      <Check size={14} className="text-green-500" />
                      Formats : JPEG, PNG, JPG, WEBP
                    </p>
                    <p className="text-xs text-muted flex items-center gap-2">
                      <Check size={14} className="text-green-500" />
                      Taille Max : 5 Mo
                    </p>
                    <p className="text-xs text-muted flex items-center gap-2">
                      <ImageIcon size={14} className="text-blue-500" />
                      Des photos claires et lumineuses sont préférables
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="chart-card">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Layers size={22} className="text-primary" />
                  <h2 className="text-xl font-bold m-0">Variantes Dynamiques</h2>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <input 
                    id="use-variants"
                    type="checkbox" 
                    checked={useVariants} 
                    onChange={e => setUseVariants(e.target.checked)} 
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label className="text-xs font-bold uppercase cursor-pointer" htmlFor="use-variants">Activer</label>
                </div>
              </div>

              {!useVariants ? (
                <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                  <Layers className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-muted text-sm max-w-xs mx-auto">Activez les variantes pour gérer plusieurs tailles, couleurs ou matériaux pour ce produit.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Step 1: Selection */}
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 mb-4 uppercase tracking-wider">1. Configurer les Options</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {attributes?.map(attr => (
                          <button 
                            key={attr.id}
                            type="button"
                            onClick={() => handleToggleAttribute(attr.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                              selectedAttributeIds.includes(attr.id) 
                                ? "bg-primary border-primary text-white shadow-md" 
                                : "bg-white border-gray-200 text-gray-600 hover:border-primary/50"
                            }`}
                          >
                            {attr.name}
                          </button>
                        ))}
                      </div>

                      {selectedAttributeIds.map(attrId => {
                        const attr = attributes?.find(a => a.id === attrId);
                        return (
                          <div key={attrId} className="mb-4 last:mb-0">
                            <span className="text-xs font-bold text-gray-500 mb-2 block">Valeurs de {attr?.name} :</span>
                            <div className="flex flex-wrap gap-2">
                              {attr?.AttributeValues?.map(val => (
                                <button 
                                  key={val.id}
                                  type="button"
                                  onClick={() => handleToggleValue(attrId, val.id)}
                                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                    selectedValueIds[attrId]?.includes(val.id) 
                                      ? "bg-blue-600 text-white" 
                                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  {val.value}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      <button 
                        type="button" 
                        className="btn btn-secondary w-full mt-6 py-2.5 font-bold flex items-center justify-center gap-2" 
                        onClick={handleGenerateVariants}
                        disabled={selectedAttributeIds.length === 0}
                      >
                        <Check size={18} /> Générer l'Aperçu des Variantes
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Preview Table */}
                  {generatedVariants.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">2. Révision et Stock ({generatedVariants.length} variantes)</p>
                      <div className="table-wrapper border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <table className="data-table">
                          <thead className="bg-gray-50">
                            <tr>
                              <th>Configuration</th>
                              <th>SKU</th>
                              <th style={{ width: "100px" }}>Stock</th>
                              <th style={{ width: "50px" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {generatedVariants.map((v, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50">
                                <td>
                                  <div className="flex gap-1.5">
                                    {v.values.map(val => (
                                      <span key={val.id} className="badge badge-secondary badge-xs py-1 px-2">{val.value}</span>
                                    ))}
                                  </div>
                                </td>
                                <td>
                                  <input 
                                    className="form-input form-input-sm font-mono text-xs max-w-[140px]" 
                                    value={v.sku} 
                                    onChange={e => {
                                      const copy = [...generatedVariants];
                                      copy[idx].sku = e.target.value;
                                      setGeneratedVariants(copy);
                                    }}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="number"
                                    className="form-input form-input-sm text-center tabular font-bold" 
                                    value={v.stock} 
                                    onChange={e => {
                                      const copy = [...generatedVariants];
                                      copy[idx].stock = parseInt(e.target.value, 10) || 0;
                                      setGeneratedVariants(copy);
                                    }}
                                  />
                                </td>
                                <td className="text-right">
                                  <button 
                                    type="button" 
                                    onClick={() => setGeneratedVariants(prev => prev.filter((_, i) => i !== idx))}
                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <section className="chart-card">
              <h2 className="text-xl font-bold mb-6">Prix et Catégorie</h2>
              <div className="form-group mb-6">
                <label className="block text-sm font-bold mb-2">Prix de Base (TND)*</label>
                <div className="relative">
                  <input 
                    className="form-input pl-12 font-bold text-lg" 
                    type="number" 
                    step="0.01" 
                    value={basePrice} 
                    onChange={e => setBasePrice(e.target.value)} 
                    placeholder="0.00" 
                    required 
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">DT</div>
                </div>
                <p className="text-[10px] text-muted mt-2 uppercase tracking-wide">Appliqué à toutes les variantes automatiquement</p>
              </div>
              <div className="form-group">
                <label className="block text-sm font-bold mb-2">Catégorie*</label>
                <select className="form-input" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                  <option value="">Sélectionner une catégorie</option>
                  {(categories || []).map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </section>

            <section className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                <Check size={18} className="text-primary" />
                Prêt à Publier ?
              </h3>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Vérifiez toutes les variantes et les prix avant de créer. Le produit sera immédiatement visible en magasin.
              </p>
              <button 
                type="submit" 
                className="btn btn-primary w-full py-3 h-auto font-bold shadow-lg shadow-primary/20" 
                disabled={isSaving}
              >
                {isSaving ? "Création..." : "Publier le Produit"}
              </button>
            </section>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddProductPage;
