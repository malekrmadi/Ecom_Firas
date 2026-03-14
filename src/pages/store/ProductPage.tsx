import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "@/data/mock";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === Number(id));
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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
    addItem(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stockStatus = product.stock === 0
    ? { text: "Out of stock", cls: "stock-out" }
    : product.stock <= 5
    ? { text: `Only ${product.stock} items left`, cls: "stock-low" }
    : { text: "In stock", cls: "stock-available" };

  return (
    <>
      <Navbar />
      <div className="product-page">
        <div className="container">
          <div className="product-page-layout">
            <div className="product-gallery">
              <div className="product-gallery-main">
                <img src={product.images[selectedImage]} alt={product.name} />
              </div>
              {product.images.length > 1 && (
                <div className="product-gallery-thumbs">
                  {product.images.map((img, i) => (
                    <div key={i} className={`product-gallery-thumb ${i === selectedImage ? "active" : ""}`} onClick={() => setSelectedImage(i)}>
                      <img src={img} alt="" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="product-details">
              <span className="product-category-label">{product.category}</span>
              <h1>{product.name}</h1>
              <div className="product-price-large">
                <span className="current">{product.price.toLocaleString()} TND</span>
                {product.oldPrice && <span className="old">{product.oldPrice.toLocaleString()} TND</span>}
              </div>
              <p className="product-description">{product.description}</p>
              <div className={`product-stock-indicator ${stockStatus.cls}`}>{stockStatus.text}</div>

              {product.variants.sizes && product.variants.sizes.length > 0 && (
                <div className="variant-section">
                  <h4>Size</h4>
                  <div className="variant-options">
                    {product.variants.sizes.map(s => (
                      <button key={s} className={`variant-option ${selectedSize === s ? "selected" : ""}`} onClick={() => setSelectedSize(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {product.variants.colors && product.variants.colors.length > 0 && (
                <div className="variant-section">
                  <h4>Color</h4>
                  <div className="variant-options">
                    {product.variants.colors.map(c => (
                      <button key={c} className={`variant-option ${selectedColor === c ? "selected" : ""}`} onClick={() => setSelectedColor(c)}>{c}</button>
                    ))}
                  </div>
                </div>
              )}

              {product.stock > 0 && (
                <div className="add-to-cart-section">
                  <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
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
