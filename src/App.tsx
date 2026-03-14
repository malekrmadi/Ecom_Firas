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
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import OrdersPage from "@/pages/admin/OrdersPage";
import OrderDetailsPage from "@/pages/admin/OrderDetailsPage";
import CustomersPage from "@/pages/admin/CustomersPage";
import DeliveriesPage from "@/pages/admin/DeliveriesPage";
import StatisticsPage from "@/pages/admin/StatisticsPage";

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
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          <Route path="/admin/deliveries" element={<DeliveriesPage />} />
          <Route path="/admin/statistics" element={<StatisticsPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
