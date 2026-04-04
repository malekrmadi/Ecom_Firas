import React from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { StatsService, OrderService } from "@/lib/services";
import { TrendingUp, ShoppingBag, RotateCcw, MapPin, Package } from "lucide-react";

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({ 
    queryKey: ["dashboard_stats"], 
    queryFn: StatsService.getDashboard 
  });

  const { data: orders, isLoading: loadingOrders } = useQuery({ 
    queryKey: ["recent_orders"], 
    queryFn: OrderService.getAll 
  });

  const kpis = [
    { label: "Total Revenue", value: stats?.revenue ? `${parseFloat(stats.revenue).toLocaleString()} TND` : "0 TND", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: orders ? orders.length : "0", icon: ShoppingBag, color: "text-green-600", bg: "bg-green-50" },
    { label: "Returns Rate", value: stats?.returnsRate ? `${parseFloat(stats.returnsRate).toFixed(1)}%` : "0%", icon: RotateCcw, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <Package className="text-primary" size={28} />
          <h1>Store Performance</h1>
        </div>
      </div>

      <div className="stats-grid">
        {kpis.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="stat-card-label">{s.label}</span>
                <span className="stat-card-value">{s.value}</span>
              </div>
              <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                <s.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-grid mt-8">
        <div className="chart-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary" />
            <h3 className="m-0">Sales Over Time</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats?.salesOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" fontSize={11} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total_revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-primary" />
            <h3 className="m-0">Orders by Region</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stats?.ordersByGov || []} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="count" nameKey="governorate" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={10}>
                {(stats?.ordersByGov || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} className="text-primary" />
          <h3 className="m-0">Top Performing Products</h3>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stats?.topProducts || []} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" fontSize={11} tickLine={false} width={100} />
            <Tooltip />
            <Bar dataKey="total_quantity" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-wrapper mt-8">
        <div className="table-toolbar">
          <h3 className="m-0 text-md font-bold">Recent Orders</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Governorate</th><th>Total</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).slice(0, 8).map((o: any) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>#{o.id}</td>
                <td>{o.Customer ? `${o.Customer.full_name}` : (o.customer_name || "Guest")}</td>
                <td>{o.governorate}</td>
                <td className="tabular font-semibold">{parseFloat(o.total_price || 0).toLocaleString()} TND</td>
                <td><span className={`badge badge-${o.status?.toLowerCase().replace(/ /g, "-") || 'pending'}`}>{o.status}</span></td>
              </tr>
            ))}
            {!orders?.length && !isLoading && (
              <tr><td colSpan={5} className="text-center p-12 text-muted">No sales activity yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
