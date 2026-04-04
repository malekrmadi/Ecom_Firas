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
    ? { text: "Rupture de stock", cls: "out" }
    : stock <= 5
    ? { text: `Plus que ${stock} restant(s)`, cls: "low" }
    : null;

  return (
    <div className="product-card group">
      <Link to={`/product/${product.id}`} className="product-card-img">
        <img src={getPlaceholderImage(product.id)} alt={product.name} loading="lazy" />
        {product.discount > 0 && <span className="product-card-discount">-{product.discount}%</span>}
      </Link>
      <div className="product-card-info">
        <div className="flex justify-between items-start mb-2">
           <span className="product-card-category">{categoryName || "Général"}</span>
           {stockLabel && <span className={`product-card-stock ${stockLabel.cls} text-[10px] uppercase font-bold`}>{stockLabel.text}</span>}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card-name group-hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <div className="product-card-price">
          <span className="current">{parseFloat(product.base_price || 0).toLocaleString()} <small className="text-[10px] font-bold">TND</small></span>
          {product.oldPrice && <span className="old">{product.oldPrice} TND</span>}
        </div>
        <div className="mt-auto pt-4">
           <Link to={`/product/${product.id}`} className="block">
             <button className="product-card-btn font-bold">Voir Produit</button>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
