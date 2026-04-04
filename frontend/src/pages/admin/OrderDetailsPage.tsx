import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const statuses = ["pending", "confirmed", "shipped", "delivered", "rejected", "returned"];

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.get(`/orders/${id}`).then(res => res.data),
    enabled: !!id,
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    }
  }, [order?.status]);

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => api.put(`/orders/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      alert("Status updated");
    },
    onError: (err) => {
      alert("Error updating status");
      console.error(err);
    }
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateStatusMutation.mutate(newStatus);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <p>Loading order...</p>
      </AdminLayout>
    );
  }

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
        <h1>Order #{order.id}</h1>
        <Link to="/admin/orders" className="btn btn-secondary">← Back to Orders</Link>
      </div>

      <div className="order-details-grid">
        <div className="detail-card">
          <h3>Customer Information</h3>
          <div className="detail-row"><span className="label">Name</span><span>{order.Customer?.full_name}</span></div>
          <div className="detail-row"><span className="label">Phone</span><span>{order.Customer?.phone}</span></div>
          <div className="detail-row"><span className="label">Governorate</span><span>{order.governorate}</span></div>
          <div className="detail-row"><span className="label">City</span><span>{order.city}</span></div>
          <div className="detail-row"><span className="label">Address</span><span>{order.shipping_address}</span></div>
          {order.notes && <div className="detail-row"><span className="label">Notes</span><span>{order.notes}</span></div>}
        </div>
        <div className="detail-card">
          <h3>Order Status</h3>
          <div className="detail-row"><span className="label">Date</span><span>{new Date(order.created_at).toLocaleString()}</span></div>
          <div className="detail-row"><span className="label">Current Status</span><span className={`badge badge-${order.status?.toLowerCase().replace(/ /g, "-") || 'pending'}`}>{order.status}</span></div>
          <div style={{ marginTop: "16px" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "6px" }}>Change Status</label>
            <select className="status-select" value={status} onChange={handleStatusChange} disabled={updateStatusMutation.isPending}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {/* Removed Assign Delivery logic as it's not supported by backend schema */}
        </div>
      </div>

      <div className="table-wrapper" style={{ marginTop: "24px" }}>
        <div className="table-toolbar"><h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Order Items</h3></div>
        <table className="data-table">
          <thead><tr><th>Item ID</th><th>Unit Price</th><th>Qty</th><th>Total</th></tr></thead>
          <tbody>
            {(order.OrderItems || []).map((item: any, i: number) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>Item #{item.id} (Prod/Var: {item.variant_id})</td>
                <td className="tabular">{parseFloat(item.unit_price || 0).toLocaleString()} TND</td>
                <td className="tabular">{item.quantity}</td>
                <td className="tabular" style={{ fontWeight: 600 }}>{(parseFloat(item.total_price || 0)).toLocaleString()} TND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="detail-card" style={{ marginTop: "24px", maxWidth: "360px" }}>
        <div className="detail-row total" style={{ fontWeight: 700, fontSize: "1.125rem" }}>
          <span>Total</span>
          <span>{parseFloat(order.total_price || order.total_amount || 0).toLocaleString()} TND</span>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetailsPage;
