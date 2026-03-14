import React from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { salesData, salesByProduct, ordersByGovernorate, orders } from "@/data/mock";
import AdminLayout from "@/components/admin/AdminLayout";

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

const stats = [
  { label: "Orders Today", value: "24", change: "+12%", positive: true },
  { label: "Monthly Orders", value: "186", change: "+8%", positive: true },
  { label: "Total Revenue", value: "42,450 TND", change: "+15%", positive: true },
  { label: "Products Sold", value: "312", change: "+5%", positive: true },
];

const DashboardPage: React.FC = () => (
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
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card">
        <h3>Orders by Region</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={ordersByGovernorate} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
              {ordersByGovernorate.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="chart-card" style={{ marginBottom: "32px" }}>
      <h3>Top Products by Revenue</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={salesByProduct}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="name" fontSize={11} tickLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
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
          {orders.slice(0, 5).map(o => (
            <tr key={o.id}>
              <td style={{ fontWeight: 600 }}>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.governorate}</td>
              <td className="tabular">{o.total.toLocaleString()} TND</td>
              <td><span className={`badge badge-${o.status.toLowerCase().replace(/ /g, "-")}`}>{o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminLayout>
);

export default DashboardPage;
