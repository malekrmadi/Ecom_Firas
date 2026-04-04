import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/lib/services";
import { Package, Truck, CheckCircle, XCircle, RotateCcw, User, MapPin, Calendar, CreditCard } from "lucide-react";

const statuses = ["pending", "confirmed", "shipped", "delivered", "rejected", "returned"];

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => OrderService.getById(id!),
    enabled: !!id,
  });

  const [status, setStatus] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [showReturnform, setShowReturnForm] = useState(false);

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    }
  }, [order?.status]);

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => OrderService.updateStatus(id!, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      alert("Status updated");
    },
  });

  const recordReturnMutation = useMutation({
    mutationFn: () => OrderService.createReturn(order.id, order.customer_id, returnReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      alert("Return recorded and stock updated.");
      setShowReturnForm(false);
    },
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateStatusMutation.mutate(newStatus);
  };

  if (isLoading) return <AdminLayout><p>Loading order...</p></AdminLayout>;
  if (!order) return <AdminLayout><p>Order not found.</p><Link to="/admin/orders" className="btn btn-secondary">← Back</Link></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <Package className="text-primary" size={28} />
          <h1>Order #{order.id}</h1>
        </div>
        <div className="flex gap-2">
          {order.status === "delivered" && (
            <button className="btn btn-secondary" onClick={() => setShowReturnForm(!showReturnform)}>
              <RotateCcw size={16} className="mr-2" />
              Record Return
            </button>
          )}
          <Link to="/admin/orders" className="btn btn-secondary">← Back to Orders</Link>
        </div>
      </div>

      {showReturnform && (
        <div className="chart-card mb-6 border-2 border-red-100">
          <h3 className="text-red-700 flex items-center gap-2">
            <RotateCcw size={18} />
            Record Customer Return
          </h3>
          <p className="text-sm text-muted mb-4">This will mark the order as 'returned' and automatically re-increment the stock for all items.</p>
          <div className="form-group">
            <label>Reason for return</label>
            <textarea 
              className="form-input" 
              placeholder="Ex: Damaged item, Wrong size..."
              value={returnReason}
              onChange={e => setReturnReason(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button 
              className="btn btn-danger" 
              onClick={() => recordReturnMutation.mutate()}
              disabled={recordReturnMutation.isPending || !returnReason}
            >
              Confirm Return
            </button>
            <button className="btn btn-ghost" onClick={() => setShowReturnForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="order-details-grid">
        <div className="detail-card">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-primary" />
            <h3 className="m-0">Customer Info</h3>
          </div>
          <div className="detail-row"><span className="label">Name</span><span>{order.Customer?.full_name || order.customer_name}</span></div>
          <div className="detail-row"><span className="label">Phone</span><span>{order.Customer?.phone || order.customer_phone}</span></div>
          <div className="detail-row"><span className="label">Location</span><span className="flex items-center gap-1"><MapPin size={14}/> {order.governorate}, {order.city}</span></div>
          <div className="detail-row"><span className="label">Address</span><span>{order.address || order.shipping_address}</span></div>
          {order.note && <div className="detail-row"><span className="label">Note</span><span className="italic">"{order.note}"</span></div>}
        </div>

        <div className="detail-card">
          <div className="flex items-center gap-2 mb-4">
             <Truck size={18} className="text-primary" />
             <h3 className="m-0">Status & Timing</h3>
          </div>
          <div className="detail-row"><span className="label">Order Date</span><span className="flex items-center gap-1"><Calendar size={14}/> {new Date(order.created_at).toLocaleString()}</span></div>
          <div className="detail-row"><span className="label">Current State</span><span className={`badge badge-${order.status?.toLowerCase().replace(/ /g, "-") || 'pending'}`}>{order.status}</span></div>
          <div style={{ marginTop: "16px" }}>
            <label className="block mb-2 text-sm font-medium">Update Progression</label>
            <select className="status-select w-full" value={status} onChange={handleStatusChange} disabled={updateStatusMutation.isPending}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrapper mt-8">
        <div className="table-toolbar">
          <h3 className="m-0 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            Order Items
          </h3>
        </div>
        <table className="data-table">
          <thead><tr><th>Item ID</th><th>Unit Price</th><th>Qty</th><th>Total</th></tr></thead>
          <tbody>
            {(order.OrderItems || []).map((item: any, i: number) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>Item #{item.id} (Prod/Var: {item.variant_id})</td>
                <td className="tabular">{parseFloat(item.unit_price || 0).toLocaleString()} TND</td>
                <td className="tabular">x {item.quantity}</td>
                <td className="tabular" style={{ fontWeight: 600 }}>{(parseFloat(item.total_price || 0)).toLocaleString()} TND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="detail-card mt-6 ml-auto max-w-sm border-t-4 border-primary">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={18} className="text-primary" />
          <h3 className="m-0">Financial Summary</h3>
        </div>
        <div className="detail-row total text-xl font-bold">
          <span>Amount Paid</span>
          <span className="text-primary">{parseFloat(order.total_price || order.total_amount || 0).toLocaleString()} TND</span>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetailsPage;
