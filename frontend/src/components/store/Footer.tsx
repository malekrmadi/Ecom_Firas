import React from "react";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";

const Footer: React.FC = () => {
  const { settings } = useStoreSettings();

  return (
    <footer className="store-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="store-logo" style={{ color: "var(--primary)" }}>
              {settings.store_name}
            </span>
            <p>Votre boutique de confiance en Tunisie. Produits de qualité, livraison rapide, paiement à la livraison.</p>
            {/* Social Links */}
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          <div className="footer-col">
            <h4>Boutique</h4>
            <a href="/categories/smartphones">Smartphones</a>
            <a href="/categories/laptops">Ordinateurs</a>
            <a href="/categories/accessories">Accessoires</a>
            <a href="/categories/shoes">Chaussures</a>
            <a href="/categories/clothing">Vêtements</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Contactez-nous</a>
            <a href="#">FAQ</a>
            <a href="#">Livraison</a>
            <a href="#">Retours</a>
          </div>
          <div className="footer-col">
            <h4>Entreprise</h4>
            <a href="#">À Propos</a>
            <a href="#">Confidentialité</a>
            <a href="#">Conditions</a>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} {settings.store_name}. Tous droits réservés. Fait en Tunisie 🇹🇳
        </div>
      </div>
    </footer>
  );
};

export default Footer;
