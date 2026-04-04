import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const statusClass = (s: string) => `badge-${s.toLowerCase().replace(/ /g, "-")}`;

const OrdersPage: React.FC = () => {
  const [filter, setFilter] = useState("All");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders").then(res => res.data),
  });

  const filteredOrders = (orders || []).filter((o: any) => {
    if (filter === "All") return true;
    return o.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
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
              <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${f === filter ? "btn-primary" : "btn-secondary"}`}>{f}</button>
            ))}
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Phone</th><th>Governorate</th><th>Total</th><th>Date</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filteredOrders.map((o: any) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>#{o.id}</td>
                <td>{o.Customer ? o.Customer.full_name : "Unknown"}</td>
                <td>{o.Customer ? o.Customer.phone : "-"}</td>
                <td>{o.governorate}</td>
                <td className="tabular">{parseFloat(o.total_price || 0).toLocaleString()} TND</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td><span className={`badge ${statusClass(o.status || 'pending')}`}>{o.status}</span></td>
                <td><Link to={`/admin/orders/${o.id}`} className="btn btn-sm btn-secondary">View</Link></td>
              </tr>
            ))}
            {!filteredOrders?.length && !isLoading && (
              <tr><td colSpan={8} style={{textAlign: "center", padding: "1rem"}}>No orders found</td></tr>
            )}
            {isLoading && (
              <tr><td colSpan={8} style={{textAlign: "center", padding: "1rem"}}>Loading...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
