import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import HeroBanner from "@/components/store/HeroBanner";
import ProductCard from "@/components/store/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { api, getPlaceholderImage } from "@/lib/api";

const HomePage: React.FC = () => {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then(res => res.data),
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
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

  // If backend does not support flag like popular or featured we just fallback to slice of items
  const popularProducts = (products || []).slice(0, 4);
  const featuredProducts = (products || []).slice(4, 8);

  return (
    <>
      <Navbar />
      <HeroBanner />

      <section className="store-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Products</h2>
            <Link to="/categories">View All →</Link>
          </div>
          <div className="products-grid">
            {isLoadingProducts ? <p>Loading...</p> : popularProducts.map((p: any) => <ProductCard key={p.id} product={p} categoryName={categoriesMap[p.category_id]} />)}
          </div>
        </div>
      </section>

      <section className="store-section" style={{ background: "var(--bg-subtle)" }}>
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/categories">View All →</Link>
          </div>
          <div className="categories-grid">
            {isLoadingCategories ? <p>Loading categories...</p> : (categories || []).map((cat: any) => (
              <Link to={`/categories/${cat.slug}`} key={cat.id} className="category-card">
                <img src={getPlaceholderImage(`cat_${cat.id}`)} alt={cat.name} loading="lazy" />
                <div className="category-card-overlay">
                  <h3>{cat.name}</h3>
                  {/* Backend category endpoints do not natively return count without include, so we display "View Products" */}
                  <span>View Products</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="store-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/categories">View All →</Link>
          </div>
          <div className="products-grid">
            {isLoadingProducts ? <p>Loading...</p> : featuredProducts.map((p: any) => <ProductCard key={p.id} product={p} categoryName={categoriesMap[p.category_id]} />)}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
