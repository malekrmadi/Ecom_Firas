import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Trash2, Plus, Settings2 } from "lucide-react";

interface AttributeValue {
  id: number;
  value: string;
  attribute_id: number;
}

interface Attribute {
  id: number;
  name: string;
  AttributeValues: AttributeValue[];
}

const AttributesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newValueMap, setNewValueMap] = useState<Record<number, string>>({});

  // Fetch all attributes with their values
  const { data: attributes, isLoading } = useQuery<Attribute[]>({
    queryKey: ["attributes"],
    queryFn: () => api.get("/attributes").then(res => res.data),
  });

  // Mutations for Attributes
  const createAttributeMutation = useMutation({
    mutationFn: (name: string) => api.post("/attributes", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      setNewAttributeName("");
    },
  });

  const deleteAttributeMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/attributes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });

  // Mutations for Attribute Values
  const createValueMutation = useMutation({
    mutationFn: (data: { attribute_id: number; value: string }) => 
      api.post("/attribute-values", data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      setNewValueMap(prev => ({ ...prev, [variables.attribute_id]: "" }));
    },
  });

  const deleteValueMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/attribute-values/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });

  const handleAddAttribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttributeName.trim()) return;
    createAttributeMutation.mutate(newAttributeName);
  };

  const handleAddValue = (attributeId: number) => {
    const val = newValueMap[attributeId];
    if (!val || !val.trim()) return;
    createValueMutation.mutate({ attribute_id: attributeId, value: val.trim() });
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Attributs Globaux</h1>
        <p className="text-muted">Gérez les attributs (ex: Taille, Couleur) et leurs valeurs pour les variantes de produits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Attribute Form */}
        <div className="chart-card">
          <h3>Ajouter un Attribut</h3>
          <form onSubmit={handleAddAttribute} className="mt-4 space-y-4">
            <div className="form-group">
              <label>Nom de l'attribut (ex: Couleur)</label>
              <input 
                className="form-input" 
                value={newAttributeName} 
                onChange={e => setNewAttributeName(e.target.value)}
                placeholder="Nom..."
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={createAttributeMutation.isPending}
            >
              <Plus size={16} className="mr-2" />
              {createAttributeMutation.isPending ? "Création..." : "Créer l'Attribut"}
            </button>
          </form>
        </div>

        {/* Attributes List */}
        <div className="md:col-span-2">
          {isLoading ? (
            <div className="text-center p-8">Chargement des attributs...</div>
          ) : (
            <div className="space-y-6">
              {(attributes || []).map(attr => (
                <div key={attr.id} className="chart-card">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Settings2 size={18} className="text-primary" />
                      <h3 className="m-0">{attr.name}</h3>
                    </div>
                    <button 
                      className="btn btn-sm btn-danger btn-ghost"
                      onClick={() => {
                        if (window.confirm(`Supprimer l'attribut "${attr.name}" et toutes ses valeurs ?`)) {
                          deleteAttributeMutation.mutate(attr.id);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {attr.AttributeValues?.map(val => (
                      <div key={val.id} className="badge badge-secondary flex items-center gap-2 pr-1">
                        {val.value}
                        <button 
                          onClick={() => deleteValueMutation.mutate(val.id)}
                          className="hover:text-red-500 rounded-full"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))}
                    {(!attr.AttributeValues || attr.AttributeValues.length === 0) && (
                      <span className="text-muted text-sm italic">Aucune valeur définie</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input 
                      className="form-input form-input-sm" 
                      placeholder="Ajouter une valeur (ex: Rouge)"
                      value={newValueMap[attr.id] || ""}
                      onChange={e => setNewValueMap(prev => ({ ...prev, [attr.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleAddValue(attr.id)}
                    />
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleAddValue(attr.id)}
                      disabled={createValueMutation.isPending}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              ))}
              {attributes?.length === 0 && (
                <div className="chart-card text-center p-12 text-muted">
                  Aucun attribut trouvé. Commencez par en créer un comme "Taille" ou "Couleur".
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AttributesPage;
