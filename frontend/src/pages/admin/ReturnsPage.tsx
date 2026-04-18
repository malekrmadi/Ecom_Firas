import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RotateCcw, Calendar, User, Hash } from "lucide-react";

const ReturnsPage: React.FC = () => {
  const { data: returns, isLoading } = useQuery({
    queryKey: ["returns"],
    queryFn: () => api.get("/returns").then(res => res.data),
  });

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <RotateCcw className="text-primary" size={28} />
          <h1>Articles Retournés</h1>
        </div>
        <p className="text-muted">Historique des retours clients traités et leur impact sur l'inventaire.</p>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Retour</th>
              <th>ID Commande</th>
              <th>Date</th>
              <th>Motif</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {(returns || []).map((r: any) => (
              <tr key={r.id}>
                <td><div className="flex items-center gap-2"><Hash size={14} className="text-muted"/>{r.id}</div></td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-semibold">#{r.order_id}</span>
                    <span className="text-xs text-muted">ID Client : {r.customer_id}</span>
                  </div>
                </td>
                <td className="tabular">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-muted"/>
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="max-w-xs truncate italic" title={r.reason}>
                    "{r.reason}"
                  </div>
                </td>
                <td>
                  <span className="badge badge-returned">Retourné</span>
                </td>
              </tr>
            ))}
            {!returns?.length && !isLoading && (
              <tr><td colSpan={5} className="text-center p-12 text-muted">Aucun retour enregistré pour le moment.</td></tr>
            )}
            {isLoading && (
              <tr><td colSpan={5} className="text-center p-12">Chargement des retours...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ReturnsPage;
