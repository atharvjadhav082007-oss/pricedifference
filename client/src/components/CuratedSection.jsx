import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api';

export default function CuratedSection() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts({ sort: 'discount', limit: 10 })
      .then(res => setProducts(res.products || []))
      .catch(console.error);
  }, []);

  if (products.length === 0) return null;

  return (
    <section>
      <h2 style={{ 
        fontSize: '16px', 
        color: '#fff', 
        fontWeight: 500, 
        padding: '16px 16px 10px',
        margin: 0
      }}>
        Curated for you
      </h2>
      <div 
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          padding: '0 16px 12px'
        }}
      >
        {products.map(product => {
          const discount = Math.round(((product.mrp - product.currentPrice) / product.mrp) * 100);
          
          return (
            <div 
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              style={{
                backgroundColor: '#161b27',
                border: '1px solid #2a2f3e',
                borderRadius: '10px',
                minWidth: '130px',
                padding: '10px',
                flexShrink: 0,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '9px', color: '#888' }}>
                {product.platform}
              </span>
              <span style={{ 
                fontSize: '11px', 
                color: '#e8e8e8',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.3
              }}>
                {product.name}
              </span>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>
                  ₹{product.currentPrice?.toLocaleString('en-IN')}
                </span>
                {discount > 0 && (
                  <span style={{ fontSize: '10px', color: '#f97316' }}>
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}