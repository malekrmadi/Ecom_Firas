import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StoreSettingsService, StoreSettings } from "@/lib/services";
import { Save, Upload, Image as ImageIcon, X, Check, Globe, Palette, Layout, Facebook, Instagram } from "lucide-react";
import { toast } from "sonner";

const StoreSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery<StoreSettings>({
    queryKey: ["store-settings"],
    queryFn: StoreSettingsService.get
  });

  const [formData, setFormData] = useState<Partial<StoreSettings>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
      if (settings.logo_url) setLogoPreview(settings.logo_url.startsWith('http') ? settings.logo_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${settings.logo_url}`);
      if (settings.banner_image_url) setBannerPreview(settings.banner_image_url.startsWith('http') ? settings.banner_image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${settings.banner_image_url}`);
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La taille du fichier doit être inférieure à 5 Mo");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          setLogoFile(file);
          setLogoPreview(reader.result as string);
        } else {
          setBannerFile(file);
          setBannerPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => StoreSettingsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
      toast.success("Paramètres mis à jour avec succès !");
    },
    onError: (err: any) => {
      toast.error(err.message || "Échec de la mise à jour des paramètres");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, value.toString());
      }
    });

    if (logoFile) data.append('logo', logoFile);
    if (bannerFile) data.append('banner', bannerFile);

    updateMutation.mutate(data);
  };

  if (isLoading) return <AdminLayout><div className="p-8 text-center">Chargement des paramètres...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Globe size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Paramètres de la Boutique</h1>
            <p className="text-sm text-muted">Personnalisez l'apparence et les réseaux sociaux de votre boutique</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={updateMutation.isPending}
          className="btn btn-primary flex items-center gap-2"
        >
          {updateMutation.isPending ? "Enregistrement..." : <><Save size={18} /> Enregistrer les modifications</>}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Branding Section */}
          <section className="chart-card">
            <div className="flex items-center gap-2 mb-6">
              <Layout size={20} className="text-primary" />
              <h2 className="text-lg font-bold m-0">Identité Visuelle</h2>
            </div>
            
            <div className="form-group mb-6">
              <label>Nom de la Boutique</label>
              <input 
                name="store_name"
                className="form-input" 
                value={formData.store_name || ""} 
                onChange={handleInputChange}
                placeholder="Ex: Ma Boutique Inc."
              />
            </div>

            <div className="form-group">
              <label>Logo de la Boutique</label>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden group">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="text-gray-300" size={32} />
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => handleFileChange(e, 'logo')}
                    accept="image/*"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                    <Upload size={16} className="text-white" />
                  </div>
                </div>
                <div className="flex-1 text-xs text-muted space-y-1">
                  <p className="font-bold text-gray-500 uppercase tracking-wider">Formats PNG ou SVG</p>
                  <p>Taille recommandée : 200x50px</p>
                  <p>Taille max : 5Mo</p>
                </div>
              </div>
            </div>
          </section>

          {/* Palette Section */}
          <section className="chart-card">
            <div className="flex items-center gap-2 mb-6">
              <Palette size={20} className="text-primary" />
              <h2 className="text-lg font-bold m-0">Palette de Couleurs</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-bold">Couleur Primaire</p>
                  <p className="text-[10px] text-muted uppercase">Boutons et états actifs</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-500 uppercase">{formData.primary_color}</span>
                  <input 
                    type="color" 
                    name="primary_color"
                    value={formData.primary_color || "#4f46e5"} 
                    onChange={handleInputChange}
                    className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-bold">Couleur Secondaire</p>
                  <p className="text-[10px] text-muted uppercase">Badges et contrastes</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-500 uppercase">{formData.secondary_color}</span>
                  <input 
                    type="color" 
                    name="secondary_color"
                    value={formData.secondary_color || "#f59e0b"} 
                    onChange={handleInputChange}
                    className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-bold">Couleur d'Accent</p>
                  <p className="text-[10px] text-muted uppercase">Succès et indicateurs</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-500 uppercase">{formData.accent_color}</span>
                  <input 
                    type="color" 
                    name="accent_color"
                    value={formData.accent_color || "#10b981"} 
                    onChange={handleInputChange}
                    className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Hero Section */}
        <section className="chart-card">
          <div className="flex items-center gap-2 mb-6">
            <ImageIcon size={20} className="text-primary" />
            <h2 className="text-lg font-bold m-0">Section Héro (Bannière)</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="form-group">
                <label>Titre Principal</label>
                <input 
                  name="hero_title"
                  className="form-input" 
                  value={formData.hero_title || ""} 
                  onChange={handleInputChange}
                  placeholder="Le titre principal sur votre accueil"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <textarea 
                  name="hero_subtitle"
                  className="form-input" 
                  value={formData.hero_subtitle || ""} 
                  onChange={handleInputChange}
                  placeholder="Texte secondaire sous le titre"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Image de la Bannière</label>
              <div 
                className="relative w-full h-44 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden group"
              >
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-xs font-bold text-gray-400">Cliquez pour uploader</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => handleFileChange(e, 'banner')}
                  accept="image/*"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Upload size={18} /> Modifier la Bannière
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-muted mt-3 uppercase tracking-wider text-center">Ratio suggéré: 21:9 (ex: 1920x800px)</p>
            </div>
          </div>
        </section>

        {/* Social Section */}
        <section className="chart-card">
          <div className="flex items-center gap-2 mb-6">
            <Facebook size={20} className="text-primary" />
            <h2 className="text-lg font-bold m-0">Réseaux Sociaux</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="flex items-center gap-2">
                <Facebook size={14} className="text-blue-600" /> Facebook Page URL
              </label>
              <input 
                name="facebook_url"
                className="form-input" 
                value={formData.facebook_url || ""} 
                onChange={handleInputChange}
                placeholder="https://facebook.com/your-store"
              />
            </div>
            <div className="form-group">
              <label className="flex items-center gap-2">
                <Instagram size={14} className="text-pink-600" /> Instagram Handle URL
              </label>
              <input 
                name="instagram_url"
                className="form-input" 
                value={formData.instagram_url || ""} 
                onChange={handleInputChange}
                placeholder="https://instagram.com/your-store"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSubmit} 
            disabled={updateMutation.isPending}
            className="btn btn-primary px-12 py-4 h-auto font-bold shadow-xl shadow-primary/25 text-lg"
          >
            {updateMutation.isPending ? "Traitement..." : "Enregistrer tous les paramètres"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default StoreSettingsPage;
