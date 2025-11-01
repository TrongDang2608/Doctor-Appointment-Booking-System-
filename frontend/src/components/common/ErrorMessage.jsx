const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '4px',
      color: '#c33',
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#c33',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0 10px'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

