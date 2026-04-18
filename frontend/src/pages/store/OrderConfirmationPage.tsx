import React from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { Check } from "lucide-react";

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <>
      <Navbar />
      <div className="confirmation-page py-24">
        <div className="container text-center max-w-xl">
          <div className="confirmation-icon w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Merci pour votre commande !</h1>
          <p className="text-muted text-lg mb-8">Numéro de commande : <span className="font-bold text-fg-main">#{orderId}</span></p>
          
          <div className="confirmation-details bg-gray-50 p-8 rounded-2xl border border-gray-100 text-left mb-12">
            <h3 className="text-lg font-bold mb-4">Détails de la livraison</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Votre commande a été enregistrée avec succès. Notre équipe vous contactera par téléphone dans les plus brefs délais pour confirmer l'expédition.
            </p>
            <div className="flex justify-between items-center py-3 border-t border-gray-200">
              <span className="text-muted text-sm">Mode de paiement</span>
              <span className="font-bold text-sm">Paiement à la livraison</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/" className="btn btn-primary btn-lg">Retour à l'accueil</Link>
            <Link to="/categories" className="btn btn-secondary btn-lg">Continuer mes achats</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmationPage;
