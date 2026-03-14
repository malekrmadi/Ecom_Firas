import React from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/data/mock";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const stockLabel = product.stock === 0
    ? { text: "Out of stock", cls: "out" }
    : product.stock <= 5
    ? { text: `Only ${product.stock} left`, cls: "low" }
    : null;

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-img">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        {discount && <span className="product-card-discount">-{discount}%</span>}
      </Link>
      <div className="product-card-info">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <div className="product-card-price">
          <span className="current">{product.price.toLocaleString()} TND</span>
          {product.oldPrice && <span className="old">{product.oldPrice.toLocaleString()} TND</span>}
        </div>
        {stockLabel && <p className={`product-card-stock ${stockLabel.cls}`}>{stockLabel.text}</p>}
        <Link to={`/product/${product.id}`}>
          <button className="product-card-btn">View Product</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
