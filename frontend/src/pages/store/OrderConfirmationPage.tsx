import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <>
      <Navbar />
      <div className="confirmation-page">
        <div className="container">
          <div className="confirmation-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1>Order Confirmed!</h1>
          <p className="order-id">Order {orderId}</p>
          <div className="confirmation-details">
            <h3>Order Summary</h3>
            <div className="confirmation-row">
              <span className="label">Order ID</span>
              <span>{orderId}</span>
            </div>
            <div className="confirmation-row">
              <span className="label">Payment Method</span>
              <span>Cash on Delivery</span>
            </div>
            <div className="confirmation-row">
              <span className="label">Status</span>
              <span className="badge badge-pending">Pending</span>
            </div>
          </div>
          <p style={{ color: "var(--fg-muted)", marginBottom: "24px" }}>
            Thank you for your order! We'll contact you shortly to confirm delivery details.
          </p>
          <Link to="/">
            <button className="btn btn-primary btn-lg">Continue Shopping</button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmationPage;
