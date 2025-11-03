import React from 'react';
import { Link } from 'react-router-dom';

const ActionButton = ({ to, children, color = '#3498db', onClick, disabled = false }) => {
  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: disabled ? '#95a5a6' : color,
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    display: 'inline-block',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      to={to}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
};

export default ActionButton;

