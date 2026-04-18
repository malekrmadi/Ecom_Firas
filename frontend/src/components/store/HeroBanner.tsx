import React from "react";
import { Link } from "react-router-dom";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner: React.FC = () => {
  const { settings, getImageUrl } = useStoreSettings();

  const bannerSrc = settings.banner_image_url
    ? getImageUrl(settings.banner_image_url)
    : heroBanner;

  return (
    <section className="hero">
      <img src={bannerSrc} alt="" className="hero-img" />
      <div className="container">
        <div className="hero-content">
          <span className="hero-badge">🚚 Livraison gratuite dès 200 TND</span>
          <h1>{settings.hero_title}</h1>
          <p>{settings.hero_subtitle}</p>
          <div className="hero-actions">
            <Link to="/categories"><button className="btn-hero">Acheter Maintenant</button></Link>
            <Link to="/categories"><button className="btn-hero-outline">Parcourir les Catégories</button></Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
