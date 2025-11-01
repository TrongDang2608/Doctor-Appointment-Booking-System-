import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ErrorMessage from '../components/common/ErrorMessage';
import Loading from '../components/common/Loading';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authResponse = await login(username, password);
      
      // Persistent logging
      const logPersistent = (msg, data) => {
        console.log(msg, data || '');
        if (!window.debugLogs) window.debugLogs = [];
        window.debugLogs.push({ timestamp: new Date().toISOString(), message: msg, data });
      };
      
      logPersistent('✅ Login successful - Response:', authResponse);
      
      // Wait a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get role from response or localStorage
      const role = authResponse?.role || JSON.parse(localStorage.getItem('user') || '{}')?.role;
      logPersistent('🔍 Role determined:', role);
      
      // Verify token and user are saved
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      logPersistent('💾 Storage check:', { 
        hasToken: !!token, 
        hasUser: !!user, 
        userRole: user?.role 
      });
      
      if (!role) {
        logPersistent('❌ No role found!', { authResponse, user });
        setError('Login failed: Role information missing');
        return;
      }
      
      // Redirect based on role
      let redirectPath = '/patient/dashboard';
      if (role === 'ADMIN') {
        redirectPath = '/admin/dashboard';
      } else if (role === 'DOCTOR') {
        redirectPath = '/doctor/dashboard';
      }
      
      logPersistent('🚀 Redirecting to:', redirectPath);
      navigate(redirectPath);
    } catch (err) {
      console.error('❌ Login error:', err);
      if (!window.debugLogs) window.debugLogs = [];
      window.debugLogs.push({ 
        timestamp: new Date().toISOString(), 
        message: 'Login error', 
        error: err 
      });
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Logging in..." />;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
        
        <ErrorMessage message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Username or Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#3498db' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

