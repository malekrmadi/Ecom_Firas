import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import HeroBanner from "@/components/store/HeroBanner";
import ProductCard from "@/components/store/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { api, getPlaceholderImage } from "@/lib/api";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";

const HomePage: React.FC = () => {
  const { getImageUrl } = useStoreSettings();
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

  // On ne garde que les produits populaires, on supprime les produits vedettes
  const popularProducts = (products || []).slice(0, 8);

  return (
    <>
      <Navbar />
      <HeroBanner />

      <section className="store-section">
        <div className="container">
          <div className="section-header">
            <div className="section-header-info">
              <h2>Produits Populaires</h2>
              <p>Découvrez nos meilleures ventes du moment.</p>
            </div>
            <Link to="/categories" className="text-accent font-bold">Voir Tout →</Link>
          </div>
          <div className="products-grid">
            {isLoadingProducts ? <p>Chargement...</p> : popularProducts.map((p: any) => <ProductCard key={p.id} product={p} categoryName={categoriesMap[p.category_id]} />)}
          </div>
        </div>
      </section>

      <section className="store-section" style={{ background: "var(--bg-subtle)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-header-info">
              <h2>Acheter par Catégorie</h2>
              <p>Explorez notre sélection par type de produit.</p>
            </div>
            <Link to="/categories" className="text-accent font-bold">Voir Tout →</Link>
          </div>
          <div className="categories-grid">
            {isLoadingCategories ? <p>Loading categories...</p> : (categories || []).map((cat: any) => (
              <Link to={`/categories/${cat.slug}`} key={cat.id} className="category-card">
                <img 
                  src={cat.image_url ? getImageUrl(cat.image_url) : getPlaceholderImage(`cat_${cat.id}`)} 
                  alt={cat.name} 
                  loading="lazy" 
                />
                <div className="category-card-overlay">
                  <h3>{cat.name}</h3>
                  <span>Voir les Produits</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </>
  );
};

export default HomePage;
