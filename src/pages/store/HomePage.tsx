import React from "react";
import { Link } from "react-router-dom";
import { products, categories } from "@/data/mock";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import HeroBanner from "@/components/store/HeroBanner";
import ProductCard from "@/components/store/ProductCard";

const HomePage: React.FC = () => {
  const popularProducts = products.filter(p => p.popular);
  const featuredProducts = products.filter(p => p.featured);

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
            {popularProducts.map(p => <ProductCard key={p.id} product={p} />)}
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
            {categories.map(cat => (
              <Link to={`/categories/${cat.slug}`} key={cat.id} className="category-card">
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="category-card-overlay">
                  <h3>{cat.name}</h3>
                  <span>{cat.count} products</span>
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
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
