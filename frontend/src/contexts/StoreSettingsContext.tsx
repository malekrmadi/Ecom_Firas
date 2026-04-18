import React, { createContext, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { StoreSettingsService, StoreSettings } from "@/lib/services";
import { API_BASE } from "@/lib/api";

const defaultSettings: StoreSettings = {
  store_name: "KART",
  logo_url: "",
  hero_title: "Discover the Best Deals in Tunisia",
  hero_subtitle:
    "Shop the latest smartphones, laptops, accessories and more. Cash on delivery available everywhere.",
  banner_image_url: "",
  facebook_url: "",
  instagram_url: "",
  primary_color: "#4f46e5",
  secondary_color: "#f59e0b",
  accent_color: "#10b981",
};

interface StoreSettingsContextType {
  settings: StoreSettings;
  isLoading: boolean;
  getImageUrl: (path: string) => string;
}

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  getImageUrl: (p) => p,
});

export const useStoreSettings = () => useContext(StoreSettingsContext);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, isLoading } = useQuery<StoreSettings>({
    queryKey: ["store-settings"],
    queryFn: StoreSettingsService.get,
    staleTime: 1000 * 60 * 5, // cache 5 min
  });

  const settings: StoreSettings = data ?? defaultSettings;

  // Inject CSS variables from store settings into document root
  useEffect(() => {
    if (!data) return;
    const root = document.documentElement;

    root.style.setProperty("--primary", data.primary_color);
    root.style.setProperty("--secondary", data.secondary_color);
    root.style.setProperty("--accent", data.accent_color);

    // Derive hover / light states from the primary color
    root.style.setProperty("--primary-hover", data.primary_color + "dd");
    root.style.setProperty("--primary-light", data.primary_color + "18");
    root.style.setProperty("--accent-hover", data.accent_color + "dd");
  }, [data]);

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, isLoading, getImageUrl }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};
