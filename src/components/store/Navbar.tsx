import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import "@/styles/variables.css";
import "@/styles/store.css";

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <nav className="store-navbar">
      <div className="container">
        <Link to="/" className="store-logo">KART</Link>
        <ul className="store-nav-links">
          <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link></li>
          <li><Link to="/categories" className={location.pathname.startsWith("/categories") ? "active" : ""}>Categories</Link></li>
        </ul>
        <div className="store-search">
          <svg className="store-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search products..." />
        </div>
        <Link to="/cart" className="nav-cart-btn" style={{ display: "inline-flex", alignItems: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </Link>
        <button className="mobile-menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
