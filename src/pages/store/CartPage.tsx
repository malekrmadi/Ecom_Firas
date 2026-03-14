import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-page">
          <div className="container">
            <div className="cart-empty">
              <h2>Your cart is empty</h2>
              <p>Browse our products and add items to your cart.</p>
              <Link to="/categories" className="btn btn-primary" style={{ marginTop: "16px", display: "inline-flex" }}>Start Shopping</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <div className="container">
          <h1>Shopping Cart ({items.length} items)</h1>
          <div className="cart-layout">
            <div className="cart-items">
              {items.map(item => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item-img">
                    <img src={item.product.images[0]} alt={item.product.name} />
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.product.name}</div>
                    {(item.selectedSize || item.selectedColor) && (
                      <div className="cart-item-variant">
                        {[item.selectedSize, item.selectedColor].filter(Boolean).join(" / ")}
                      </div>
                    )}
                    <div className="cart-item-price">{item.product.price.toLocaleString()} TND</div>
                    <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeItem(item.product.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span className="tabular">{totalPrice.toLocaleString()} TND</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery</span>
                <span>{totalPrice >= 200 ? "Free" : "7 TND"}</span>
              </div>
              <div className="cart-summary-row total">
                <span>Total</span>
                <span className="tabular">{(totalPrice + (totalPrice >= 200 ? 0 : 7)).toLocaleString()} TND</span>
              </div>
              <Link to="/checkout">
                <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "16px" }}>
                  Proceed to Checkout
                </button>
              </Link>
              <p style={{ fontSize: "0.8125rem", color: "var(--fg-muted)", textAlign: "center", marginTop: "12px" }}>
                💰 Payment: Cash on Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
