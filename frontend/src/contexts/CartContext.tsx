import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export interface CartItem {
  product: any; // The product object
  variant: any; // The specific variant object
  quantity: number;
  attributes: Record<string, string>; // e.g. { "Size": "M", "Color": "Red" }
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, variant: any, quantity: number, attributes: Record<string, string>) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: any, variant: any, quantity = 1, attributes: Record<string, string>) => {
    setItems(prev => {
      const existing = prev.find(i => i.variant.id === variant.id);
      if (existing) {
        return prev.map(i => i.variant.id === variant.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, variant, quantity, attributes }];
    });
  }, []);

  const removeItem = useCallback((variantId: number) => {
    setItems(prev => prev.filter(i => i.variant.id !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.variant.id !== variantId));
    } else {
      setItems(prev => prev.map(i => i.variant.id === variantId ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, i) => {
    const price = parseFloat(i.variant?.price || i.product?.base_price || 0);
    return sum + price * i.quantity;
  }, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
