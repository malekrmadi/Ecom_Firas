import React from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { salesData, salesByProduct, ordersByGovernorate } from "@/data/mock";
import AdminLayout from "@/components/admin/AdminLayout";

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

const monthlySales = [
  { month: "Jul", orders: 42, revenue: 4200 },
  { month: "Aug", orders: 58, revenue: 5800 },
  { month: "Sep", orders: 49, revenue: 4900 },
  { month: "Oct", orders: 72, revenue: 7200 },
  { month: "Nov", orders: 84, revenue: 8400 },
  { month: "Dec", orders: 112, revenue: 11200 },
  { month: "Jan", orders: 98, revenue: 9800 },
];

const StatisticsPage: React.FC = () => (
  <AdminLayout>
    <div className="admin-page-header">
      <h1>Statistics</h1>
    </div>

    <div className="chart-grid">
      <div className="chart-card">
        <h3>Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue (TND)" />
            <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card">
        <h3>Orders by Governorate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={ordersByGovernorate} cx="50%" cy="50%" outerRadius={110} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
              {ordersByGovernorate.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="chart-card" style={{ marginBottom: "32px" }}>
      <h3>Sales by Product</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesByProduct}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="name" fontSize={11} tickLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} name="Revenue (TND)" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="chart-grid">
      <div className="chart-card">
        <h3>Sales Over Time</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="sales" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card">
        <h3>Key Metrics</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "16px" }}>
          {[
            { label: "Conversion Rate", value: "3.2%", change: "+0.5%" },
            { label: "Avg. Order Value", value: "228 TND", change: "+12%" },
            { label: "Return Rate", value: "4.1%", change: "-0.8%" },
            { label: "Repeat Customers", value: "38%", change: "+5%" },
          ].map(m => (
            <div key={m.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--fg-muted)", fontSize: "0.875rem" }}>{m.label}</span>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{m.value}</span>
                <span style={{ fontSize: "0.8125rem", color: m.change.includes("+") ? "var(--success)" : "var(--danger)" }}>{m.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default StatisticsPage;
