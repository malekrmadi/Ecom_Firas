import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const CategoriesPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
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

    if (minPrice) {
      result = result.filter((p: any) => parseFloat(p.base_price) >= parseFloat(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p: any) => parseFloat(p.base_price) <= parseFloat(maxPrice));
    }

    if (inStockOnly) {
      result = result.filter((p: any) => {
        const stock = p.ProductVariants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
        return stock > 0;
      });
    }

    return result;
  }, [products, activeCategoryId, searchQuery, minPrice, maxPrice, inStockOnly]);

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
      <div className="categories-page">
        <div className="container">
          <div className="categories-page-header">
            <h1>Our Products</h1>
          </div>
          <div className="categories-tabs">
            <button className={`category-tab ${!slug || slug === "all" ? "active" : ""}`} onClick={() => handleTabClick("all")}>All</button>
            {(categories || []).map((c: any) => (
              <button key={c.id} className={`category-tab ${slug === c.slug ? "active" : ""}`} onClick={() => handleTabClick(c.slug)}>{c.name}</button>
            ))}
          </div>
          <div className="categories-page-layout">
            <aside className="filters-sidebar">
              <div className="filter-section">
                <h4>Search</h4>
                <input className="form-input" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div className="filter-section">
                <h4>Price Range (TND)</h4>
                <div className="price-range">
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                  <span>—</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                </div>
              </div>
              {/* Removed Size and Color filters as backend doesn't implement them natively */}
              <div className="filter-section">
                <h4>Availability</h4>
                <div className="filter-options">
                  <label className="filter-option"><input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> In Stock Only</label>
                </div>
              </div>
            </aside>
            <div>
              <p style={{ marginBottom: "16px", color: "var(--fg-muted)", fontSize: "0.875rem" }}>
                Showing {filtered.length} products
              </p>
              
              {isLoadingProducts || isLoadingCategories ? (
                <div style={{ textAlign: "center", padding: "64px 0", color: "var(--fg-muted)" }}>
                  <p>Loading products...</p>
                </div>
              ) : (
                <>
                  <div className="products-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                    {filtered.map((p: any) => <ProductCard key={p.id} product={p} categoryName={categoriesMap[p.category_id]} />)}
                  </div>
                  {filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "64px 0", color: "var(--fg-muted)" }}>
                      <p>No products found.</p>
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
