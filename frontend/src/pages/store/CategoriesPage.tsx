import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Search, SlidersHorizontal, Package, CheckCircle2, ChevronRight, X } from "lucide-react";

const CategoriesPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then(res => res.data),
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then(res => res.data),
  });

  const activeCategoryId = useMemo(() => {
    if (!slug || slug === "all" || !categories) return "all";
    const cat = categories.find((c: any) => c.slug === slug);
    return cat ? cat.id : "all";
  }, [slug, categories]);

  const categoriesMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (categories) {
      categories.forEach((c: any) => {
        map[c.id] = c.name;
      });
    }
    return map;
  }, [categories]);

  const absoluteMaxPrice = useMemo(() => {
    if (!products?.length) return 1000;
    return Math.ceil(Math.max(...products.map((p: any) => parseFloat(p.base_price || 0))));
  }, [products]);

  useEffect(() => {
    if (absoluteMaxPrice > 0) setMaxPrice(absoluteMaxPrice);
  }, [absoluteMaxPrice]);

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = products.filter((p: any) => p.is_active);
    
    if (activeCategoryId !== "all") {
      result = result.filter((p: any) => p.category_id === activeCategoryId);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p: any) => p.name.toLowerCase().includes(q));
    }

    result = result.filter((p: any) => parseFloat(p.base_price) <= maxPrice);

    if (inStockOnly) {
      result = result.filter((p: any) => {
        const stock = p.ProductVariants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
        return stock > 0;
      });
    }

    return result;
  }, [products, activeCategoryId, searchQuery, maxPrice, inStockOnly]);

  const handleTabClick = (newSlug: string) => {
    if (newSlug === "all") {
      navigate('/categories');
    } else {
      navigate(`/categories/${newSlug}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="categories-page py-12">
        <div className="container">
          <div className="categories-page-header mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold">Catalogue</h1>
            <p className="text-muted mt-2">Explorez notre collection de produits premium en Tunisie.</p>
          </div>
          
          <div className="categories-tabs flex flex-wrap gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide">
            <button 
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${!slug || slug === "all" ? "bg-primary text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`} 
              onClick={() => handleTabClick("all")}
            >
              Tous les Produits
            </button>
            {(categories || []).map((c: any) => (
              <button 
                key={c.id} 
                className={`px-6 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${slug === c.slug ? "bg-primary text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`} 
                onClick={() => handleTabClick(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="categories-page-layout grid grid-cols-1 lg:grid-cols-4 gap-12">
            <aside className="filters-sidebar space-y-10 order-2 lg:order-1">
              <div className="filter-section p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal size={18} className="text-primary" />
                  <h4 className="m-0 font-bold">Filtres</h4>
                </div>
                
                <div className="space-y-8">
                  <div className="filter-group">
                    <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-gray-500">Recherche</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                      <input 
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                        placeholder="Rechercher..." 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="filter-group">
                    <div className="flex justify-between mb-3">
                      <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Prix Max</label>
                      <span className="font-bold text-primary">{maxPrice.toLocaleString()} TND</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={absoluteMaxPrice} 
                      step="1"
                      className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      value={maxPrice} 
                      onChange={e => setMaxPrice(parseInt(e.target.value))} 
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted font-medium">
                      <span>0 TND</span>
                      <span>{absoluteMaxPrice.toLocaleString()} TND</span>
                    </div>
                  </div>

                  <div className="filter-group">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={inStockOnly} 
                            onChange={e => setInStockOnly(e.target.checked)} 
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${inStockOnly ? 'bg-primary' : 'bg-gray-300'}`}></div>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${inStockOnly ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">En Stock Uniquement</span>
                     </label>
                  </div>
                </div>
                
                <button 
                  className="w-full mt-8 py-2 text-primary font-bold text-sm bg-primary/5 rounded-xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2 border border-primary/20"
                  onClick={() => {
                    setSearchQuery("");
                    setMaxPrice(absoluteMaxPrice);
                    setInStockOnly(false);
                  }}
                >
                  <X size={14} /> Effacer les Filtres
                </button>
              </div>
            </aside>

            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-muted font-medium">
                   <Package size={18} />
                   <span>{filtered.length} produits trouvés</span>
                </div>
              </div>
              
              {isLoadingProducts || isLoadingCategories ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[4/5] bg-gray-100 rounded-2xl animate-pulse"></div>)}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((p: any) => <ProductCard key={p.id} product={p} categoryName={categoriesMap[p.category_id]} />)}
                  </div>
                  {filtered.length === 0 && (
                    <div className="py-24 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
                         <Search size={32} className="text-muted" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Aucun produit trouvé</h3>
                      <p className="text-muted">Essayez d'ajuster vos filtres ou vos termes de recherche.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoriesPage;
