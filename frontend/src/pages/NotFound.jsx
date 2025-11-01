import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '72px', margin: '0', color: '#3498db' }}>404</h1>
      <h2 style={{ margin: '20px 0' }}>Page Not Found</h2>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        The page you are looking for does not exist.
      </p>
      <Link
        to="/login"
        style={{
          padding: '10px 20px',
          backgroundColor: '#3498db',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        Go to Login
      </Link>
    </div>
  );
};

export default NotFound;

