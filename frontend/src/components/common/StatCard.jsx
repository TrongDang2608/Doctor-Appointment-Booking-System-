import React from 'react';

const StatCard = ({ label, value, color, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderLeft: `4px solid ${color}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', fontWeight: '500' }}>
            {label}
          </p>
          <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: color, fontWeight: '600' }}>
            {value}
          </h2>
        </div>
        <div style={{ fontSize: '40px', marginLeft: '15px' }}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;

