import React, { useState } from 'react';

export default function AdBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div style={{
      backgroundColor: '#1a3a5c',
      borderRadius: '12px',
      padding: '12px 16px',
      margin: '12px 16px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      <div style={{
        fontSize: '11px',
        color: '#aad4f5',
        lineHeight: 1.4,
        flex: 1
      }}>
        Compare prices without leaving any E-Commerce App
      </div>
      <button style={{
        backgroundColor: '#f97316',
        color: '#fff',
        borderRadius: '20px',
        fontSize: '10px',
        padding: '6px 12px',
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}>
        Watch Now
      </button>
      <button 
        onClick={() => setVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          color: '#aad4f5',
          fontSize: '16px',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ✕
      </button>
    </div>
  );
}