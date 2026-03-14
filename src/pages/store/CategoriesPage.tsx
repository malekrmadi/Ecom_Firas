import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { products, categories } from "@/data/mock";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";

const CategoriesPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [activeCategory, setActiveCategory] = useState(slug || "all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = products.filter(p => p.status === "active");
    if (activeCategory !== "all") {
      result = result.filter(p => p.categorySlug === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }
    return result;
  }, [activeCategory, searchQuery]);

  return (
    <>
      <Navbar />
      <div className="categories-page">
        <div className="container">
          <div className="categories-page-header">
            <h1>All Products</h1>
          </div>
          <div className="categories-tabs">
            <button className={`category-tab ${activeCategory === "all" ? "active" : ""}`} onClick={() => setActiveCategory("all")}>All</button>
            {categories.map(c => (
              <button key={c.id} className={`category-tab ${activeCategory === c.slug ? "active" : ""}`} onClick={() => setActiveCategory(c.slug)}>{c.name}</button>
            ))}
          </div>
          <div className="categories-page-layout">
            <aside className="filters-sidebar">
              <div className="filter-section">
                <h4>Search</h4>
                <input className="form-input" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range">
                  <input type="number" placeholder="Min" />
                  <span>—</span>
                  <input type="number" placeholder="Max" />
                </div>
              </div>
              <div className="filter-section">
                <h4>Size</h4>
                <div className="filter-options">
                  {["S", "M", "L", "XL"].map(s => (
                    <label key={s} className="filter-option"><input type="checkbox" /> {s}</label>
                  ))}
                </div>
              </div>
              <div className="filter-section">
                <h4>Color</h4>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["#000", "#fff", "#ef4444", "#3b82f6", "#a855f7"].map(c => (
                    <div key={c} className="filter-color-swatch" style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div className="filter-section">
                <h4>Availability</h4>
                <div className="filter-options">
                  <label className="filter-option"><input type="checkbox" defaultChecked /> In Stock</label>
                  <label className="filter-option"><input type="checkbox" /> Out of Stock</label>
                </div>
              </div>
            </aside>
            <div>
              <p style={{ marginBottom: "16px", color: "var(--fg-muted)", fontSize: "0.875rem" }}>
                Showing {filtered.length} products
              </p>
              <div className="products-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "64px 0", color: "var(--fg-muted)" }}>
                  <p>No products found.</p>
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

export default CategoriesPage;
