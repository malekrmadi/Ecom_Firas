import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { useQuery } from "@tanstack/react-query";
import { api, getPlaceholderImage } from "@/lib/api";
import { ProductService, Product, ProductVariant } from "@/lib/services";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Check, X, AlertTriangle, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { getImageUrl } = useStoreSettings();

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Fetch single product with variants
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => ProductService.getById(id!),
    enabled: !!id,
  });

  // Extract all unique attributes and their values from the variants
  const attributesMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    const variants = product?.ProductVariants || [];
    
    // Check if any variant has formal attributes
    const hasFormalAttributes = variants.some(v => v.AttributeValues && v.AttributeValues.length > 0);

    if (!hasFormalAttributes && variants.length > 1) {
      // Fallback: Create a virtual "Modèle" attribute using SKUs
      map["Modèle"] = new Set(variants.map(v => v.sku));
    } else {
      variants.forEach(v => {
        v.AttributeValues?.forEach(av => {
          const attrName = (av as any).Attribute?.name || "Option";
          if (!map[attrName]) map[attrName] = new Set();
          map[attrName].add(av.value);
        });
      });
    }

    const result: Record<string, string[]> = {};
    Object.keys(map).forEach(key => {
      result[key] = Array.from(map[key]);
    });
    return result;
  }, [product]);

  // Set initial selection
  useEffect(() => {
    if (Object.keys(attributesMap).length > 0 && Object.keys(selectedAttributes).length === 0) {
      const initial: Record<string, string> = {};
      Object.keys(attributesMap).forEach(key => {
        initial[key] = attributesMap[key][0];
      });
      setSelectedAttributes(initial);
    }
  }, [attributesMap]);

  // Find the variant that matches the selected attributes
  const selectedVariant = useMemo(() => {
    if (!product?.ProductVariants) return null;
    
    // Special case: Only one variant exists or No attributes at all
    if (product.ProductVariants.length === 1) return product.ProductVariants[0];
    if (Object.keys(attributesMap).length === 0) return product.ProductVariants[0];

    if (Object.keys(selectedAttributes).length < Object.keys(attributesMap).length) return null;
    
    return product.ProductVariants.find(v => {
      // Check if it's the virtual "Modèle" logic
      if (attributesMap["Modèle"]) {
        return v.sku === selectedAttributes["Modèle"];
      }

      // Standard attribute matching
      return Object.entries(selectedAttributes).every(([attrName, attrValue]) => {
        return v.AttributeValues?.some(av => 
          ((av as any).Attribute?.name || "Option") === attrName && av.value === attrValue
        );
      });
    });
  }, [product, selectedAttributes, attributesMap]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addItem(product, selectedVariant, quantity, selectedAttributes);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stock = selectedVariant?.stock || 0;
  const price = Number(selectedVariant?.price || product?.base_price || 0);

  const isAllSelected = Object.keys(selectedAttributes).length === Object.keys(attributesMap).length;

  const stockStatus = !isAllSelected
    ? { text: "Veuillez choisir vos options", cls: "text-blue-600 bg-blue-50 border-blue-100", icon: AlertTriangle }
    : stock === 0
    ? { text: "Rupture de stock", cls: "text-red-700 bg-red-50 border-red-200", icon: X }
    : stock <= 5
    ? { text: `${stock} restants seulement !`, cls: "text-orange-700 bg-orange-50 border-orange-200 animate-pulse", icon: AlertTriangle }
    : { text: `En stock : ${stock} disponibles`, cls: "text-green-700 bg-green-50 border-green-200", icon: Check };

  if (isLoading) return <><Navbar /><div className="container py-24 text-center"><Loader2 className="animate-spin mx-auto mb-4" /> Chargement du produit...</div><Footer /></>;
  if (!product) return <><Navbar /><div className="container py-24 text-center"><h1>Produit non trouvé</h1><Link to="/categories" className="btn btn-primary mt-4">Parcourir la collection</Link></div><Footer /></>;

  return (
    <>
      <Navbar />
      <div className="product-page py-12">
        <div className="container">
          <Link to="/categories" className="flex items-center gap-2 text-muted hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> Retour au catalogue
          </Link>
          
          <div className="product-page-layout grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="product-gallery">
              <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group">
                <img 
                  src={product.image_url ? getImageUrl(product.image_url) : getPlaceholderImage(String(product.id))} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                {isAllSelected && stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-white text-black px-6 py-3 rounded-full font-bold shadow-xl uppercase tracking-widest text-center mx-4">Rupture de stock</span>
                  </div>
                )}
              </div>
            </div>

            <div className="product-details flex flex-col">
              <div className="mb-6">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-baseline gap-4 mb-6">
                   <span className="text-3xl font-bold text-primary">{price.toLocaleString()} TND</span>
                   {product.base_price > price && <span className="text-xl text-muted line-through">{parseFloat(product.base_price.toString()).toLocaleString()} TND</span>}
                </div>
                <p className="text-muted leading-relaxed text-lg">{product.description}</p>
              </div>

              <div className="variants-section space-y-8 mb-10 py-8 border-y border-gray-100">
                {Object.entries(attributesMap).map(([attrName, values]) => (
                  <div key={attrName} className="attribute-selector">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Choisir {attrName}</span>
                      {selectedAttributes[attrName] && (
                        <span className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">{selectedAttributes[attrName]}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {values.map(val => (
                        <button
                          key={val}
                          onClick={() => setSelectedAttributes(prev => {
                            const next = { ...prev };
                            if (next[attrName] === val) delete next[attrName];
                            else next[attrName] = val;
                            return next;
                          })}
                          className={`min-w-[50px] h-12 px-5 rounded-2xl border-2 transition-all duration-300 font-bold flex items-center justify-center ${
                            selectedAttributes[attrName] === val
                              ? "border-primary bg-primary text-white shadow-lg ring-4 ring-primary/10 scale-105"
                              : "border-gray-100 hover:border-primary/30 bg-white text-gray-700 hover:scale-[1.02]"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl border font-bold w-fit mb-10 shadow-sm transition-all duration-500 scale-in-center ${stockStatus.cls}`}>
                <stockStatus.icon size={20} className={!isAllSelected ? "animate-bounce" : ""} />
                <span className="text-lg">{stockStatus.text}</span>
              </div>

              {isAllSelected && stock > 0 && (
                <div className="action-section flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="quantity-selector flex items-center bg-gray-100 rounded-2xl p-1 h-14 w-full sm:w-auto">
                    <button 
                      className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all font-bold text-xl"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold text-lg tabular">{quantity}</span>
                    <button 
                      className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all font-bold text-xl"
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className={`btn btn-primary btn-lg flex-1 h-14 flex items-center justify-center gap-3 transition-all ${added ? "bg-green-600 border-green-600 scale-[0.98]" : ""}`} 
                    onClick={handleAddToCart}
                  >
                    {added ? <Check size={20} /> : <ShoppingCart size={20} />}
                    {added ? "Ajouté au panier" : "Ajouter au panier"}
                  </button>
                </div>
              )}

              {isAllSelected && stock === 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-medium text-center">
                   Désolé, cette combinaison n'est plus disponible actuellement.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
