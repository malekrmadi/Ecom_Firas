import React from "react";
import { customers } from "@/data/mock";
import AdminLayout from "@/components/admin/AdminLayout";

const CustomersPage: React.FC = () => (
  <AdminLayout>
    <div className="admin-page-header">
      <h1>Customers</h1>
    </div>
    <div className="table-wrapper">
      <div className="table-toolbar">
        <div className="table-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search customers..." />
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Returns</th></tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td style={{ fontWeight: 500 }}>{c.name}</td>
              <td>{c.phone}</td>
              <td className="tabular">{c.orders}</td>
              <td className="tabular">{c.totalSpent.toLocaleString()} TND</td>
              <td className="tabular">{c.returns}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminLayout>
);

export default CustomersPage;
