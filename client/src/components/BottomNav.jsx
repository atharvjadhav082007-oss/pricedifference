import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <div 
      className="bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '60px',
        backgroundColor: '#161b27',
        borderTop: '1px solid #2a2f3e',
        zIndex: 100,
        justifyContent: 'space-around',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}
    >
      <NavItem to="/" icon="ti ti-home" label="Home" />
      <NavItem to="/deals" icon="ti ti-discount-2" label="Deals" />
      <NavItem to="/search" icon="ti ti-search" label="Search" />
      <NavItem to="/alerts" icon="ti ti-bell" label="Price Alert" />
      <NavItem to="/profile" icon="ti ti-user" label="Profile" />
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: '3px',
        fontSize: '9px',
        textDecoration: 'none',
        color: isActive ? '#fff' : '#555'
      })}
    >
      <i className={icon} style={{ fontSize: '20px' }}></i>
      <span>{label}</span>
    </NavLink>
  );
}