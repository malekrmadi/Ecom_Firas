import { api } from "./api";

export interface AttributeValue {
  id: number;
  value: string;
  attribute_id: number;
}

export interface Attribute {
  id: number;
  name: string;
  AttributeValues?: AttributeValue[];
}

export interface ProductVariant {
  id?: number;
  sku: string;
  price: number;
  stock: number;
  image_url?: string;
  AttributeValues?: AttributeValue[];
}

export interface Product {
  id?: number;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  category_id: number;
  is_active: boolean;
  ProductVariants?: ProductVariant[];
}

export const AttributeService = {
  getAll: () => api.get("/attributes").then(res => res.data),
  create: (name: string) => api.post("/attributes", { name }).then(res => res.data),
  delete: (id: number) => api.delete(`/attributes/${id}`),
  addValue: (attribute_id: number, value: string) => api.post("/attribute-values", { attribute_id, value }).then(res => res.data),
  deleteValue: (id: number) => api.delete(`/attribute-values/${id}`),
};

export const ProductService = {
  getAll: () => api.get("/products").then(res => res.data),
  getById: (id: number | string) => api.get(`/products/${id}`).then(res => res.data),
  create: (data: Partial<Product>) => api.post("/products", data).then(res => res.data),
  update: (id: number | string, data: Partial<Product>) => api.put(`/products/${id}`, data).then(res => res.data),
  delete: (id: number | string) => api.delete(`/products/${id}`),
  
  // Variants
  getVariants: (id: number | string) => api.get(`/products/${id}/variants`).then(res => res.data),
  createVariant: (productId: number | string, data: Partial<ProductVariant>) => 
    api.post(`/products/${productId}/variants`, data).then(res => res.data),
  updateVariant: (variantId: number | string, data: Partial<ProductVariant>) => 
    api.put(`/variants/${variantId}`, data).then(res => res.data),
  deleteVariant: (variantId: number | string) => 
    api.delete(`/variants/${variantId}`),
    
  // Variant Attributes
  addVariantAttribute: (variantId: number | string, attributeValueId: number) => 
    api.post(`/variants/${variantId}/attributes`, { attribute_value_id: attributeValueId }).then(res => res.data),
};

export const OrderService = {
  getAll: () => api.get("/orders").then(res => res.data),
  getById: (id: number | string) => api.get(`/orders/${id}`).then(res => res.data),
  updateStatus: (id: number | string, status: string) => api.put(`/orders/${id}/status`, { status }).then(res => res.data),
  createReturn: (orderId: number, customerId: number, reason: string) => 
    api.post("/returns", { order_id: orderId, customer_id: customerId, reason }).then(res => res.data),
};

export const CategoryService = {
  getAll: () => api.get("/categories").then(res => res.data),
  create: (data: any) => api.post("/categories", data).then(res => res.data),
  update: (id: number | string, data: any) => api.put(`/categories/${id}`, data).then(res => res.data),
  delete: (id: number | string) => api.delete(`/categories/${id}`),
};

export const StatsService = {
  getDashboard: () => Promise.all([
    api.get("/stats/revenue"),
    api.get("/stats/sales-over-time"),
    api.get("/stats/top-products"),
    api.get("/stats/orders-by-governorate"),
    api.get("/stats/returns-rate")
  ]).then(responses => ({
    revenue: responses[0].data.revenue,
    salesOverTime: responses[1].data,
    topProducts: responses[2].data,
    ordersByGov: responses[3].data,
    returnsRate: responses[4].data.returns_rate
  })),
};
