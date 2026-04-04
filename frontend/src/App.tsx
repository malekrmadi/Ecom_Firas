import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";

import HomePage from "@/pages/store/HomePage";
import CategoriesPage from "@/pages/store/CategoriesPage";
import ProductPage from "@/pages/store/ProductPage";
import CartPage from "@/pages/store/CartPage";
import CheckoutPage from "@/pages/store/CheckoutPage";
import OrderConfirmationPage from "@/pages/store/OrderConfirmationPage";

import DashboardPage from "@/pages/admin/DashboardPage";
import ProductsPage from "@/pages/admin/ProductsPage";
import AddProductPage from "@/pages/admin/AddProductPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AddCategoryPage from "@/pages/admin/AddCategoryPage";
import EditCategoryPage from "@/pages/admin/EditCategoryPage";
import OrdersPage from "@/pages/admin/OrdersPage";
import OrderDetailsPage from "@/pages/admin/OrderDetailsPage";
import CustomersPage from "@/pages/admin/CustomersPage";
import AttributesPage from "@/pages/admin/AttributesPage";
import ReturnsPage from "@/pages/admin/ReturnsPage";

import NotFound from "@/pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Store */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<CategoriesPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

          {/* Admin */}
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/products/new" element={<AddProductPage />} />
          <Route path="/admin/products/:id" element={<EditProductPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/categories/new" element={<AddCategoryPage />} />
          <Route path="/admin/categories/:id" element={<EditCategoryPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/orders/:id" element={<OrderDetailsPage />} />

          <Route path="/admin/returns" element={<ReturnsPage />} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          <Route path="/admin/attributes" element={<AttributesPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
