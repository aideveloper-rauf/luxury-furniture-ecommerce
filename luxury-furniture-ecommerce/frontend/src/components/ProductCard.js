import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './ProductCard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const finalPrice = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100) 
    : 0;

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        {hasDiscount && (
          <span className="discount-badge">-{discountPercentage}%</span>
        )}
        
        {product.is_featured && (
          <span className="featured-badge">Featured</span>
        )}

        <Link to={`/products/${product.id}`}>
          <img 
            src={product.image_url || '/placeholder-furniture.jpg'} 
            alt={product.name}
            className="product-image"
          />
        </Link>

        <div className={`quick-actions ${isHovered ? 'active' : ''}`}>
          <button className="action-btn" title="Add to Cart">
            Add to Cart
          </button>
          <button className="action-btn" title="Quick View">
            Quick View
          </button>
          <button className="action-btn" title="Add to Wishlist">
            ♥
          </button>
        </div>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category_name}</p>
        <Link to={`/products/${product.id}`} className="product-name">
          {product.name}
        </Link>
        
        <div className="product-rating">
          <FaStar className="star" />
          <span>4.8</span>
          <span className="reviews">(24 reviews)</span>
        </div>

        <div className="product-price">
          {hasDiscount ? (
            <>
              <span className="sale-price">${finalPrice.toFixed(2)}</span>
              <span className="original-price">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="regular-price">${finalPrice.toFixed(2)}</span>
          )}
        </div>

        <p className="product-material">{product.material}</p>
      </div>
    </div>
  );
};

export default ProductCard;
