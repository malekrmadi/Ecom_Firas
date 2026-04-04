import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { useQuery } from "@tanstack/react-query";
import { api, getPlaceholderImage } from "@/lib/api";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Fetch single product
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`).then(res => res.data),
    enabled: !!id,
  });

  // Fetch category for name
  const { data: category } = useQuery({
    queryKey: ["category", product?.category_id],
    queryFn: () => api.get(`/categories`).then(res => res.data.find((c: any) => c.id === product.category_id)),
    enabled: !!product?.category_id,
  });

  const stock = useMemo(() => {
    return product?.ProductVariants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
  }, [product]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: "64px 0", textAlign: "center" }}>
          <p>Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: "64px 0", textAlign: "center" }}>
          <h1>Product not found</h1>
          <Link to="/categories" className="btn btn-primary" style={{ marginTop: "16px", display: "inline-flex" }}>Browse Products</Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    // Determine a default variant id to add
    const variantId = product.ProductVariants?.[0]?.id || product.id;
    // Map to the shape expected by CartContext if it's strictly typed based on mock, 
    // or we may need to amend CartContext if the user allows us. 
    // We'll pass the backend product, and we'll fix CartContext later if needed.
    const cartProduct = {
      id: product.id,
      variant_id: variantId,
      name: product.name,
      price: parseFloat(product.base_price || 0),
      images: [getPlaceholderImage(product.id)], // Add mock array since context might map it
    };
    addItem(cartProduct, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stockStatus = stock === 0
    ? { text: "Out of stock", cls: "stock-out" }
    : stock <= 5
    ? { text: `Only ${stock} items left`, cls: "stock-low" }
    : { text: "In stock", cls: "stock-available" };

  return (
    <>
      <Navbar />
      <div className="product-page">
        <div className="container">
          <div className="product-page-layout">
            <div className="product-gallery">
              <div className="product-gallery-main">
                <img src={getPlaceholderImage(product.id)} alt={product.name} />
              </div>
            </div>
            <div className="product-details">
              <span className="product-category-label">{category ? category.name : "Category"}</span>
              <h1>{product.name}</h1>
              <div className="product-price-large">
                <span className="current">{parseFloat(product.base_price || 0).toLocaleString()} TND</span>
              </div>
              <p className="product-description">{product.description}</p>
              <div className={`product-stock-indicator ${stockStatus.cls}`}>{stockStatus.text}</div>

              {stock > 0 && (
                <div className="add-to-cart-section" style={{ marginTop: "32px" }}>
                  <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(stock, quantity + 1))}>+</button>
                  </div>
                  <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ flex: 1 }}>
                    {added ? "✓ Added to Cart" : "Add to Cart"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
