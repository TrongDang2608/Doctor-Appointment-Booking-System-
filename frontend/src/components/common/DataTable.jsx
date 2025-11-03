import React from 'react';

const DataTable = ({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'No data found',
  onRowClick,
  keyExtractor = (item) => item.id
}) => {
  if (loading) {
    return (
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '8px',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflowX: 'auto',
    }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        minWidth: '600px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{
                  padding: '15px 12px',
                  textAlign: column.align || 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#495057',
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: '1px solid #dee2e6',
                transition: 'background-color 0.2s',
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onMouseEnter={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    padding: '15px 12px',
                    textAlign: column.align || 'left',
                    fontSize: '14px',
                  }}
                >
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

