import React from "react";
import { deliveryAgents, orders } from "@/data/mock";
import AdminLayout from "@/components/admin/AdminLayout";

const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Confirmed");

const DeliveriesPage: React.FC = () => (
  <AdminLayout>
    <div className="admin-page-header">
      <h1>Delivery Management</h1>
    </div>

    <div className="delivery-grid">
      {deliveryAgents.map(agent => (
        <div className="delivery-card" key={agent.id}>
          <h3>{agent.name}</h3>
          <p className="zone">{agent.zone}</p>
          <div className="delivery-stat"><span className="label">Active Orders</span><span className="value">{agent.activeOrders}</span></div>
          <div className="delivery-stat"><span className="label">Phone</span><span className="value">{agent.phone}</span></div>
        </div>
      ))}
    </div>

    <div className="table-wrapper">
      <div className="table-toolbar">
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Unassigned Orders</h3>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Order ID</th><th>Customer</th><th>Governorate</th><th>Status</th><th>Assign To</th></tr>
        </thead>
        <tbody>
          {pendingOrders.map(o => (
            <tr key={o.id}>
              <td style={{ fontWeight: 600 }}>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.governorate}</td>
              <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
              <td>
                <select className="status-select">
                  <option value="">Select agent</option>
                  {deliveryAgents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AdminLayout>
);

export default DeliveriesPage;
