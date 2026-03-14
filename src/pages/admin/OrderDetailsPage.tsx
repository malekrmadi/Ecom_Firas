import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orders, deliveryAgents } from "@/data/mock";
import AdminLayout from "@/components/admin/AdminLayout";

const statuses = ["Pending", "Confirmed", "Out for delivery", "Delivered", "Refused", "Returned"];

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const order = orders.find(o => o.id === id);
  const [status, setStatus] = useState(order?.status || "Pending");

  if (!order) {
    return (
      <AdminLayout>
        <p>Order not found.</p>
        <Link to="/admin/orders" className="btn btn-secondary">← Back</Link>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Order {order.id}</h1>
        <Link to="/admin/orders" className="btn btn-secondary">← Back to Orders</Link>
      </div>

      <div className="order-details-grid">
        <div className="detail-card">
          <h3>Customer Information</h3>
          <div className="detail-row"><span className="label">Name</span><span>{order.customer}</span></div>
          <div className="detail-row"><span className="label">Phone</span><span>{order.phone}</span></div>
          <div className="detail-row"><span className="label">Governorate</span><span>{order.governorate}</span></div>
          <div className="detail-row"><span className="label">City</span><span>{order.city}</span></div>
          <div className="detail-row"><span className="label">Address</span><span>{order.address}</span></div>
          {order.notes && <div className="detail-row"><span className="label">Notes</span><span>{order.notes}</span></div>}
        </div>
        <div className="detail-card">
          <h3>Order Status</h3>
          <div className="detail-row"><span className="label">Date</span><span>{order.date}</span></div>
          <div className="detail-row"><span className="label">Current Status</span><span className={`badge badge-${status.toLowerCase().replace(/ /g, "-")}`}>{status}</span></div>
          <div style={{ marginTop: "16px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "6px" }}>Change Status</label>
            <select className="status-select" value={status} onChange={e => setStatus(e.target.value as typeof status)}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginTop: "16px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "6px" }}>Assign Delivery</label>
            <select className="status-select">
              <option value="">Select agent</option>
              {deliveryAgents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar"><h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Order Items</h3></div>
        <table className="data-table">
          <thead><tr><th>Product</th><th>Variant</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td>{item.variant || "—"}</td>
                <td className="tabular">{item.price.toLocaleString()} TND</td>
                <td className="tabular">{item.quantity}</td>
                <td className="tabular" style={{ fontWeight: 600 }}>{(item.price * item.quantity).toLocaleString()} TND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="detail-card" style={{ marginTop: "24px", maxWidth: "360px" }}>
        <div className="detail-row total" style={{ fontWeight: 700, fontSize: "1.125rem" }}>
          <span>Total</span>
          <span>{order.total.toLocaleString()} TND</span>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetailsPage;
