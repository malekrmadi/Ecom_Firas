import React from "react";
import { Link } from "react-router-dom";
import { getPlaceholderImage } from "@/lib/api";

interface Props {
  product: any;
  categoryName?: string;
}

const ProductCard: React.FC<Props> = ({ product, categoryName }) => {
  const stock = product.ProductVariants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
  
  const stockLabel = stock === 0
    ? { text: "Out of stock", cls: "out" }
    : stock <= 5
    ? { text: `Only ${stock} left`, cls: "low" }
    : null;

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-img">
        <img src={getPlaceholderImage(product.id)} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-card-info">
        <span className="product-card-category">{categoryName || "Category"}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <div className="product-card-price">
          <span className="current">{parseFloat(product.base_price || 0).toLocaleString()} TND</span>
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
