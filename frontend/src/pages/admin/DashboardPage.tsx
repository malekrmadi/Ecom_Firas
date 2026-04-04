import React from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

const DashboardPage: React.FC = () => {
  const { data: revData } = useQuery({ queryKey: ["revenue"], queryFn: () => api.get("/stats/revenue").then(res => res.data) });
  const { data: salesTime } = useQuery({ queryKey: ["salesTime"], queryFn: () => api.get("/stats/sales-over-time").then(res => res.data) });
  const { data: salesProd } = useQuery({ queryKey: ["salesProd"], queryFn: () => api.get("/stats/top-products").then(res => res.data) });
  const { data: ordersGov } = useQuery({ queryKey: ["ordersGov"], queryFn: () => api.get("/stats/orders-by-governorate").then(res => res.data) });
  const { data: orders, isLoading: loadingOrders } = useQuery({ queryKey: ["recent_orders"], queryFn: () => api.get("/orders").then(res => res.data) });
  const { data: retRate } = useQuery({ queryKey: ["retRate"], queryFn: () => api.get("/stats/returns-rate").then(res => res.data) });

  const stats = [
    { label: "Total Revenue", value: revData?.revenue ? `${parseFloat(revData.revenue).toLocaleString()} TND` : "0 TND", change: "-", positive: true },
    { label: "Returns Rate", value: retRate?.returns_rate ? `${parseFloat(retRate.returns_rate).toFixed(2)}%` : "0%", change: "-", positive: true },
    { label: "Total Orders", value: orders ? orders.length : "0", change: "-", positive: true },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <span className="stat-card-label">{s.label}</span>
            <span className="stat-card-value">{s.value}</span>
            <span className={`stat-card-change ${s.positive ? "pos" : "neg"}`}>{s.change}</span>
          </div>
        ))}
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Sales Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesTime || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total_revenue" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Orders by Region</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={ordersGov || []} cx="50%" cy="50%" outerRadius={100} dataKey="count" nameKey="governorate" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                {(ordersGov || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: "32px" }}>
        <h3>Top Products by Quantity</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={salesProd || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="name" fontSize={11} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="total_quantity" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Recent Orders</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Governorate</th><th>Total</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).slice(0, 5).map((o: any) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>#{o.id}</td>
                <td>{o.Customer ? `${o.Customer.first_name} ${o.Customer.last_name}` : "Unknown"}</td>
                <td>{o.governorate}</td>
                <td className="tabular">{parseFloat(o.total_price || 0).toLocaleString()} TND</td>
                <td><span className={`badge badge-${o.status?.toLowerCase().replace(/ /g, "-") || 'pending'}`}>{o.status}</span></td>
              </tr>
            ))}
            {!orders?.length && !loadingOrders && (
              <tr><td colSpan={5} style={{textAlign: "center", padding: "1rem"}}>No order history</td></tr>
            )}
            {loadingOrders && (
              <tr><td colSpan={5} style={{textAlign: "center", padding: "1rem"}}>Loading...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
