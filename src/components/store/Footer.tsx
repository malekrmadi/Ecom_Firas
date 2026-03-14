import React from "react";

const Footer: React.FC = () => (
  <footer className="store-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="store-logo">KART</span>
          <p>Your trusted online store in Tunisia. Quality products, fast delivery, cash on delivery.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <a href="/categories/smartphones">Smartphones</a>
          <a href="/categories/laptops">Laptops</a>
          <a href="/categories/accessories">Accessories</a>
          <a href="/categories/shoes">Shoes</a>
          <a href="/categories/clothing">Clothing</a>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Contact Us</a>
          <a href="#">FAQ</a>
          <a href="#">Shipping Info</a>
          <a href="#">Returns</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
      <div className="footer-bottom">
        © 2024 KART. All rights reserved. Made in Tunisia 🇹🇳
      </div>
    </div>
  </footer>
);

export default Footer;
