import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { governorates } from "@/data/mock";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", governorate: "", city: "", notes: "" });

  const delivery = totalPrice >= 200 ? 0 : 7;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    navigate("/order-confirmation");
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <div className="container">
          <h1>Checkout</h1>
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h2>Shipping Information</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-input" placeholder="Nom et Prénom" required value={form.name} onChange={e => update("name", e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input className="form-input" type="tel" placeholder="22 123 456" required value={form.phone} onChange={e => update("phone", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Governorate</label>
                  <select className="form-input" required value={form.governorate} onChange={e => update("governorate", e.target.value)}>
                    <option value="">Select governorate</option>
                    {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>City</label>
                <input className="form-input" placeholder="City" required value={form.city} onChange={e => update("city", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Full Address</label>
                <textarea className="form-input" placeholder="Street, Building, Apartment..." required value={form.address} onChange={e => update("address", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea className="form-input" placeholder="Any special delivery instructions..." value={form.notes} onChange={e => update("notes", e.target.value)} />
              </div>
              <div className="payment-notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <div><strong>Cash on Delivery</strong><br /><span style={{ fontSize: "0.8125rem" }}>Paiement à la livraison</span></div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "24px" }}>
                Confirm Order ({(totalPrice + delivery).toLocaleString()} TND)
              </button>
            </form>
            <div className="cart-summary">
              <h3>Order Summary</h3>
              {items.map(item => (
                <div key={item.product.id} className="cart-summary-row">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="tabular">{(item.product.price * item.quantity).toLocaleString()} TND</span>
                </div>
              ))}
              <div className="cart-summary-row">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `${delivery} TND`}</span>
              </div>
              <div className="cart-summary-row total">
                <span>Total</span>
                <span className="tabular">{(totalPrice + delivery).toLocaleString()} TND</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
