import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { getPlaceholderImage } from "@/lib/api";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";
import { Trash2, AlertCircle } from "lucide-react";

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const { getImageUrl } = useStoreSettings();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-page">
          <div className="container">
            <div className="cart-empty">
              <h2>Votre panier est vide</h2>
              <p>Parcourez nos produits et ajoutez des articles à votre panier.</p>
              <Link to="/categories" className="btn btn-primary" style={{ marginTop: "16px", display: "inline-flex" }}>Commencer vos Achats</Link>
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
          <div className="flex items-center gap-4 mb-8">
            <h1>Panier d'Achat</h1>
            <span className="badge badge-secondary">{items.length} articles uniques</span>
          </div>
          <div className="cart-layout">
            <div className="cart-items">
              {items.map(item => {
                const itemPrice = parseFloat(item.variant?.price || item.product?.base_price || 0);
                return (
                <div key={item.variant.id} className="cart-item">
                  <div className="cart-item-img">
                    <img 
                      src={item.product.image_url ? getImageUrl(item.product.image_url) : getPlaceholderImage(item.product.id)} 
                      alt={item.product.name} 
                    />
                  </div>
                  <div className="cart-item-info">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="cart-item-name font-bold">{item.product.name}</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {Object.entries(item.attributes).map(([key, value]) => (
                            <span key={key} className="badge badge-secondary badge-xs">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="cart-item-price font-semibold tabular">{itemPrice.toLocaleString()} TND</div>
                    </div>
                    
                    <div className="cart-item-actions mt-4 flex items-center justify-between">
                      <div className="quantity-selector">
                        <button onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="btn btn-icon btn-ghost text-red-500 hover:bg-red-50" onClick={() => removeItem(item.variant.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
            <div className="cart-summary bg-gray-50 p-6 rounded-2xl sticky top-24 h-fit border border-gray-100 shadow-sm">
              <h3 className="mb-6">Résumé de la Commande</h3>
              <div className="space-y-4">
                <div className="cart-summary-row flex justify-between">
                  <span className="text-muted">Sous-total</span>
                  <span className="tabular font-medium">{totalPrice.toLocaleString()} TND</span>
                </div>
                <div className="cart-summary-row flex justify-between">
                  <span className="text-muted">Frais de Livraison</span>
                  <span className="font-medium text-gray-700">7.000 TND</span>
                </div>
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="cart-summary-row total flex justify-between text-xl font-bold">
                  <span>Total Brut</span>
                  <span className="tabular text-primary">{(totalPrice + 7).toLocaleString()} TND</span>
                </div>
              </div>
              <Link to="/checkout" className="block mt-8">
                <button className="btn btn-primary btn-lg w-full">
                  Passer à la Caisse
                </button>
              </Link>
              <div className="mt-6 flex items-center gap-2 justify-center text-xs text-muted">
                <AlertCircle size={14} className="text-blue-500" />
                <span>Paiement : Espèces à la Livraison</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
