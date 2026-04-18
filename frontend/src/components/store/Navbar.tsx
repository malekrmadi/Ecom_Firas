import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import "@/styles/variables.css";
import "@/styles/store.css";

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { settings, getImageUrl } = useStoreSettings();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className="store-navbar">
      <div className="container">
        <Link to="/" className="store-logo">
          {settings.logo_url ? (
            <img
              src={getImageUrl(settings.logo_url)}
              alt={settings.store_name}
              style={{ height: "40px", width: "auto", borderRadius: "4px", objectFit: "contain" }}
            />
          ) : (
            <>{settings.store_name.split(" ")[0]}<span>{settings.store_name.split(" ").slice(1).join(" ") || "STORE"}</span></>
          )}
        </Link>
        <ul className={`store-nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Accueil</Link></li>
          <li><Link to="/categories" className={location.pathname.startsWith("/categories") ? "active" : ""}>Catégories</Link></li>
          <li><Link to="/admin" className={location.pathname.startsWith("/admin") ? "active" : ""}>Panel Admin</Link></li>
        </ul>
        <div className="store-search">
          <svg className="store-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Rechercher des produits..." />
        </div>
        <Link to="/cart" className="nav-cart-btn" style={{ display: "inline-flex", alignItems: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </Link>
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
