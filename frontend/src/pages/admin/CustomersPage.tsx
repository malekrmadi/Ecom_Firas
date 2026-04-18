import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User, Phone, ShoppingBag, TrendingUp, RotateCcw, Search } from "lucide-react";

const CustomersPage: React.FC = () => {
  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => api.get("/customers").then(res => res.data),
  });

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <User className="text-primary" size={28} />
          <h1>Base de Données Clients</h1>
        </div>
        <p className="text-muted">Suivez l'historique de vos clients, leur fidélité et leur valeur totale.</p>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} />
            <input placeholder="Rechercher par nom ou téléphone..." />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact</th>
              <th>Commandes</th>
              <th>Total Dépensé</th>
              <th>Retours</th>
            </tr>
          </thead>
          <tbody>
            {(customers || []).map((c: any) => (
              <tr key={c.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {c.full_name?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{c.full_name}</span>
                      <span className="text-xs text-muted">{c.city}, {c.governorate}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-muted" />
                    {c.phone}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-blue-500" />
                    <span className="tabular">{c.total_orders || 0}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="tabular font-semibold">{parseFloat(c.total_spent || 0).toLocaleString()} TND</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <RotateCcw size={14} className="text-red-500" />
                    <span className="tabular">{c.total_returns || 0}</span>
                  </div>
                </td>
              </tr>
            ))}
            {!customers?.length && !isLoading && (
              <tr><td colSpan={5} className="text-center p-12 text-muted">Aucun client trouvé pour le moment.</td></tr>
            )}
            {isLoading && (
              <tr><td colSpan={5} className="text-center p-12">Analyse des données clients...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default CustomersPage;
