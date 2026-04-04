import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const CustomersPage: React.FC = () => {
  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => api.get("/customers").then(res => res.data),
  });

  return (
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
            {(customers || []).map((c: any) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.full_name}</td>
                <td>{c.phone}</td>
                <td className="tabular">{c.total_orders || 0}</td>
                <td className="tabular">{parseFloat(c.total_spent || 0).toLocaleString()} TND</td>
                <td className="tabular">{c.total_returns || 0}</td>
              </tr>
            ))}
            {!customers?.length && !isLoading && (
              <tr><td colSpan={5} style={{textAlign: "center", padding: "1rem"}}>No customers found</td></tr>
            )}
            {isLoading && (
              <tr><td colSpan={5} style={{textAlign: "center", padding: "1rem"}}>Loading...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default CustomersPage;
