export const governorates = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"
];

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  categorySlug: string;
  stock: number;
  status: "active" | "draft";
  images: string[];
  description: string;
  variants: { sizes?: string[]; colors?: string[] };
  featured?: boolean;
  popular?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  count: number;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  total: number;
  status: "Pending" | "Confirmed" | "Out for delivery" | "Delivered" | "Refused" | "Returned";
  date: string;
  notes: string;
  items: { productId: number; name: string; price: number; quantity: number; variant?: string }[];
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  orders: number;
  totalSpent: number;
  returns: number;
}

export interface DeliveryAgent {
  id: number;
  name: string;
  zone: string;
  activeOrders: number;
  phone: string;
}

export const categories: Category[] = [
  { id: 1, name: "Smartphones", slug: "smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", count: 24 },
  { id: 2, name: "Laptops", slug: "laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80", count: 18 },
  { id: 3, name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", count: 42 },
  { id: 4, name: "Shoes", slug: "shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", count: 31 },
  { id: 5, name: "Clothing", slug: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", count: 56 },
  { id: 6, name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80", count: 37 },
];

export const products: Product[] = [
  {
    id: 1, name: "iPhone 15 Pro", price: 4200, oldPrice: 4500, category: "Smartphones", categorySlug: "smartphones",
    stock: 4, status: "active", featured: true, popular: true,
    images: [
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    ],
    description: "The latest iPhone with A17 Pro chip, Titanium design, and an advanced camera system. Experience the future of mobile technology.",
    variants: { sizes: [], colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"] },
  },
  {
    id: 2, name: "MacBook Air M2", price: 3800, category: "Laptops", categorySlug: "laptops",
    stock: 7, status: "active", featured: true,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
    ],
    description: "Supercharged by M2 chip. Up to 18 hours of battery life. A stunningly thin design.",
    variants: { colors: ["Silver", "Starlight", "Space Gray", "Midnight"] },
  },
  {
    id: 3, name: "Sony WH-1000XM5", price: 850, oldPrice: 950, category: "Accessories", categorySlug: "accessories",
    stock: 12, status: "active", popular: true,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    ],
    description: "Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling.",
    variants: { colors: ["Black", "Silver"] },
  },
  {
    id: 4, name: "Nike Air Max 90", price: 380, category: "Shoes", categorySlug: "shoes",
    stock: 20, status: "active", popular: true,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    description: "The Nike Air Max 90 stays true to its OG roots with the iconic Waffle outsole and visible Air cushioning.",
    variants: { sizes: ["38", "39", "40", "41", "42", "43", "44"], colors: ["Red", "White", "Black"] },
  },
  {
    id: 5, name: "Cotton Premium T-Shirt", price: 75, category: "Clothing", categorySlug: "clothing",
    stock: 50, status: "active",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    ],
    description: "Premium 100% organic cotton t-shirt. Comfortable fit for everyday wear.",
    variants: { sizes: ["S", "M", "L", "XL"], colors: ["White", "Black", "Navy", "Gray"] },
  },
  {
    id: 6, name: "Smart Watch Pro", price: 520, oldPrice: 600, category: "Electronics", categorySlug: "electronics",
    stock: 8, status: "active", featured: true,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    ],
    description: "Advanced health monitoring, GPS tracking, and smart notifications on your wrist.",
    variants: { colors: ["Black", "Silver", "Rose Gold"] },
  },
  {
    id: 7, name: "Leather Backpack", price: 190, category: "Accessories", categorySlug: "accessories",
    stock: 15, status: "active",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    ],
    description: "Handcrafted genuine leather backpack with laptop compartment. Perfect for work and travel.",
    variants: { colors: ["Brown", "Black", "Tan"] },
  },
  {
    id: 8, name: "Ray-Ban Aviator", price: 450, category: "Accessories", categorySlug: "accessories",
    stock: 0, status: "active", popular: true,
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    ],
    description: "Classic aviator sunglasses with polarized lenses and gold metal frame.",
    variants: { colors: ["Gold/Green", "Gold/Brown", "Silver/Blue"] },
  },
  {
    id: 9, name: "Samsung Galaxy Tab S9", price: 2200, category: "Electronics", categorySlug: "electronics",
    stock: 6, status: "active", featured: true,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    ],
    description: "11-inch Dynamic AMOLED 2X display. S Pen included. Water resistant design.",
    variants: { colors: ["Graphite", "Beige"] },
  },
  {
    id: 10, name: "Canon EOS R50", price: 2800, category: "Electronics", categorySlug: "electronics",
    stock: 3, status: "active",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    ],
    description: "Compact mirrorless camera with 24.2MP sensor and 4K video recording.",
    variants: { colors: ["Black", "White"] },
  },
  {
    id: 11, name: "Adidas Ultraboost", price: 420, oldPrice: 480, category: "Shoes", categorySlug: "shoes",
    stock: 18, status: "active",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    ],
    description: "Experience ultimate comfort with Boost cushioning technology.",
    variants: { sizes: ["39", "40", "41", "42", "43", "44"], colors: ["Black", "White"] },
  },
  {
    id: 12, name: "HP Pavilion 15", price: 2100, category: "Laptops", categorySlug: "laptops",
    stock: 9, status: "draft",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    ],
    description: "15.6-inch Full HD laptop with Intel Core i7 and 16GB RAM.",
    variants: { colors: ["Silver", "Blue"] },
  },
];

export const orders: Order[] = [
  {
    id: "ORD-1548", customer: "Amine Ben Salem", phone: "55 123 456", governorate: "Tunis", city: "La Marsa",
    address: "Rue de Marseille, Apt 12", total: 4200, status: "Pending", date: "2024-01-15", notes: "Livraison après 17h",
    items: [{ productId: 1, name: "iPhone 15 Pro", price: 4200, quantity: 1, variant: "Natural Titanium" }],
  },
  {
    id: "ORD-1547", customer: "Fatma Trabelsi", phone: "22 987 654", governorate: "Sousse", city: "Sousse Ville",
    address: "Avenue Habib Bourguiba 45", total: 850, status: "Confirmed", date: "2024-01-14", notes: "",
    items: [{ productId: 3, name: "Sony WH-1000XM5", price: 850, quantity: 1, variant: "Black" }],
  },
  {
    id: "ORD-1546", customer: "Mohamed Gharbi", phone: "98 456 789", governorate: "Sfax", city: "Sfax Ville",
    address: "Rue Ali Belhouane 8", total: 760, status: "Out for delivery", date: "2024-01-13", notes: "Fragile",
    items: [
      { productId: 4, name: "Nike Air Max 90", price: 380, quantity: 1, variant: "42 / Red" },
      { productId: 4, name: "Nike Air Max 90", price: 380, quantity: 1, variant: "40 / White" },
    ],
  },
  {
    id: "ORD-1545", customer: "Nour Ayari", phone: "50 321 654", governorate: "Ariana", city: "Ariana Ville",
    address: "Cité Ennasr 2, Bloc 3", total: 3800, status: "Delivered", date: "2024-01-12", notes: "",
    items: [{ productId: 2, name: "MacBook Air M2", price: 3800, quantity: 1, variant: "Space Gray" }],
  },
  {
    id: "ORD-1544", customer: "Youssef Hammami", phone: "23 654 987", governorate: "Bizerte", city: "Bizerte",
    address: "Avenue de la République", total: 520, status: "Refused", date: "2024-01-11", notes: "Client absent",
    items: [{ productId: 6, name: "Smart Watch Pro", price: 520, quantity: 1, variant: "Black" }],
  },
  {
    id: "ORD-1543", customer: "Sarra Mejri", phone: "29 147 258", governorate: "Nabeul", city: "Hammamet",
    address: "Zone Touristique", total: 150, status: "Delivered", date: "2024-01-10", notes: "",
    items: [{ productId: 5, name: "Cotton Premium T-Shirt", price: 75, quantity: 2, variant: "M / White" }],
  },
  {
    id: "ORD-1542", customer: "Karim Bouazizi", phone: "55 963 741", governorate: "Kairouan", city: "Kairouan",
    address: "Rue Ibn Khaldoun", total: 2200, status: "Pending", date: "2024-01-09", notes: "Appeler avant livraison",
    items: [{ productId: 9, name: "Samsung Galaxy Tab S9", price: 2200, quantity: 1, variant: "Graphite" }],
  },
  {
    id: "ORD-1541", customer: "Ines Chaabane", phone: "92 852 963", governorate: "Gabès", city: "Gabès",
    address: "Avenue Farhat Hached", total: 190, status: "Returned", date: "2024-01-08", notes: "Produit endommagé",
    items: [{ productId: 7, name: "Leather Backpack", price: 190, quantity: 1, variant: "Brown" }],
  },
];

export const customers: Customer[] = [
  { id: 1, name: "Amine Ben Salem", phone: "55 123 456", orders: 5, totalSpent: 8900, returns: 0 },
  { id: 2, name: "Fatma Trabelsi", phone: "22 987 654", orders: 3, totalSpent: 2400, returns: 1 },
  { id: 3, name: "Mohamed Gharbi", phone: "98 456 789", orders: 8, totalSpent: 12500, returns: 0 },
  { id: 4, name: "Nour Ayari", phone: "50 321 654", orders: 2, totalSpent: 4200, returns: 0 },
  { id: 5, name: "Youssef Hammami", phone: "23 654 987", orders: 6, totalSpent: 3800, returns: 2 },
  { id: 6, name: "Sarra Mejri", phone: "29 147 258", orders: 4, totalSpent: 1950, returns: 0 },
  { id: 7, name: "Karim Bouazizi", phone: "55 963 741", orders: 1, totalSpent: 2200, returns: 0 },
  { id: 8, name: "Ines Chaabane", phone: "92 852 963", orders: 7, totalSpent: 5600, returns: 3 },
];

export const deliveryAgents: DeliveryAgent[] = [
  { id: 1, name: "Livraison Nord", zone: "Tunis, Ariana, Ben Arous, Manouba, Bizerte", activeOrders: 5, phone: "71 000 001" },
  { id: 2, name: "Livraison Centre", zone: "Sousse, Monastir, Mahdia, Kairouan, Sfax", activeOrders: 3, phone: "71 000 002" },
  { id: 3, name: "Livraison Sud", zone: "Gabès, Médenine, Tataouine, Gafsa, Tozeur, Kébili", activeOrders: 2, phone: "71 000 003" },
];

export const salesData = [
  { month: "Jul", sales: 4200 }, { month: "Aug", sales: 5800 }, { month: "Sep", sales: 4900 },
  { month: "Oct", sales: 7200 }, { month: "Nov", sales: 8400 }, { month: "Dec", sales: 11200 },
  { month: "Jan", sales: 9800 },
];

export const salesByProduct = [
  { name: "iPhone 15 Pro", sales: 42000 }, { name: "MacBook Air", sales: 38000 },
  { name: "Sony WH-1000XM5", sales: 17000 }, { name: "Nike Air Max", sales: 11400 },
  { name: "Smart Watch", sales: 10400 },
];

export const ordersByGovernorate = [
  { name: "Tunis", value: 35 }, { name: "Sousse", value: 20 }, { name: "Sfax", value: 18 },
  { name: "Ariana", value: 12 }, { name: "Bizerte", value: 8 }, { name: "Other", value: 7 },
];
