import React from "react";
import { Link } from "react-router-dom";
import { orders } from "@/data/mock";
import AdminLayout from "@/components/admin/AdminLayout";

const statusClass = (s: string) => `badge-${s.toLowerCase().replace(/ /g, "-")}`;

const OrdersPage: React.FC = () => (
  <AdminLayout>
    <div className="admin-page-header">
      <h1>Orders</h1>
    </div>
    <div className="table-wrapper">
      <div className="table-toolbar">
        <div className="table-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search orders..." />
        </div>
        <div className="table-actions">
          {["All", "Pending", "Confirmed", "Delivered"].map(f => (
            <button key={f} className={`btn btn-sm ${f === "All" ? "btn-primary" : "btn-secondary"}`}>{f}</button>
          ))}
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Order ID</th><th>Customer</th><th>Phone</th><th>Governorate</th><th>Total</th><th>Date</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td style={{ fontWeight: 600 }}>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.phone}</td>
              <td>{o.governorate}</td>
              <td className="tabular">{o.total.toLocaleString()} TND</td>
              <td>{o.date}</td>
              <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
              <td><Link to={`/admin/orders/${o.id}`} className="btn btn-sm btn-secondary">View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminLayout>
);

export default OrdersPage;
