import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { governorates } from "@/data/mock";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreditCard, AlertTriangle, Check, X, Loader2 } from "lucide-react";

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", governorate: "", city: "", notes: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const delivery = 7;

  const createOrderMutation = useMutation({
    mutationFn: (data: any) => api.post("/orders", data),
    onSuccess: (res: any) => {
      const orderId = res.data.id;
      clearCart();
      navigate("/order-confirmation", { state: { orderId } });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "An error occurred";
      setErrorMsg(msg);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setErrorMsg("");

    const orderPayload = {
      customer_name: form.fullName,
      customer_phone: form.phone,
      governorate: form.governorate,
      city: form.city,
      address: form.address,
      note: form.notes,
      items: items.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity
      }))
    };
    createOrderMutation.mutate(orderPayload);
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container py-24 text-center">
          <h2>Votre panier est vide</h2>
          <p className="text-muted mt-2">Vous ne pouvez pas passer commande sans articles.</p>
          <Link to="/categories" className="btn btn-primary mt-6">Retour à la boutique</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <div className="container">
          <h1>Finaliser la Commande</h1>
          <div className="checkout-layout">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="font-bold">1</span>
                </div>
                <h2 className="m-0">Informations de Livraison</h2>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom complet*</label>
                  <input className="form-input" placeholder="Ex: Ahmed Ben Ali" required name="fullName" value={form.fullName} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Téléphone*</label>
                  <input className="form-input" placeholder="Ex: 55 123 456" required name="phone" value={form.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse de livraison*</label>
                <textarea className="form-input" placeholder="Votre adresse complète..." required name="address" value={form.address} onChange={handleChange} rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ville*</label>
                  <input className="form-input" placeholder="Ex: Tunis" required name="city" value={form.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Gouvernorat*</label>
                  <input className="form-input" placeholder="Ex: Ariana" required name="governorate" value={form.governorate} onChange={handleChange} />
                </div>
              </div>
              {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">{errorMsg}</div>}
              <div className="payment-notice">
                <CreditCard size={20} />
                <span><strong>Paiement à la livraison :</strong> Vous paierez en espèces lorsque vous recevrez votre commande.</span>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full mt-8" disabled={createOrderMutation.isPending}>
                {createOrderMutation.isPending ? "Traitement..." : "Confirmer la Commande"}
              </button>
            </form>
            <div className="checkout-summary">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="mb-6">Récapitulatif</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
                  {items.map(item => (
                    <div key={item.variant.id} className="flex gap-3 text-sm">
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                        <img src={item.product.image_url ? `http://localhost:3000${item.product.image_url}` : `https://via.placeholder.com/100?text=Product`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold line-clamp-1">{item.product.name}</div>
                        <div className="text-muted text-[10px]">{Object.values(item.attributes).join(' / ')}</div>
                        <div className="text-[11px] font-bold">{item.quantity} x {parseFloat(item.variant.price || item.product.base_price).toLocaleString()} TND</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Sous-total</span>
                    <span className="font-medium">{totalPrice.toLocaleString()} TND</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Frais de livraison</span>
                    <span className="font-medium">7.000 TND</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-100">
                    <span>Total à payer</span>
                    <span className="text-primary">{(totalPrice + 7).toLocaleString()} TND</span>
                  </div>
                </div>
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
