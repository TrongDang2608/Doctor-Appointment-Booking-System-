import React from 'react';

const SearchInput = ({ value, onChange, placeholder = 'Search...', style = {} }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        maxWidth: '500px',
        padding: '12px 16px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        transition: 'border-color 0.2s',
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#3498db';
        e.target.style.outline = 'none';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#ddd';
      }}
    />
  );
};

export default SearchInput;

