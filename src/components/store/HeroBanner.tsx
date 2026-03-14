import React from "react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner: React.FC = () => (
  <section className="hero">
    <img src={heroBanner} alt="" className="hero-img" />
    <div className="container">
      <div className="hero-content">
        <span className="hero-badge">🚚 Free delivery on orders over 200 TND</span>
        <h1>Discover the Best Deals in Tunisia</h1>
        <p>Shop the latest smartphones, laptops, accessories and more. Cash on delivery available everywhere.</p>
        <div className="hero-actions">
          <Link to="/categories"><button className="btn-hero">Shop Now</button></Link>
          <Link to="/categories"><button className="btn-hero-outline">Browse Categories</button></Link>
        </div>
      </div>
    </div>
  </section>
);

export default HeroBanner;
