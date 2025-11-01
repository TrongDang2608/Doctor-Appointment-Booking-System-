import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Persistent logging to prevent console clearing
  const logPersistent = (message, data) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry, data || '');
    // Also log to window for persistence
    if (!window.debugLogs) window.debugLogs = [];
    window.debugLogs.push({ timestamp, message, data });
  };

  useEffect(() => {
    logPersistent('ProtectedRoute render', { 
      loading, 
      isAuthenticated, 
      userRole: user?.role, 
      requiredRole 
    });
  }, [loading, isAuthenticated, user?.role, requiredRole]);

  if (loading) {
    logPersistent('ProtectedRoute: Loading state');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    logPersistent('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    logPersistent('ProtectedRoute: Role mismatch - redirecting to unauthorized', { 
      userRole: user?.role, 
      requiredRole 
    });
    return <Navigate to="/unauthorized" replace />;
  }

  logPersistent('ProtectedRoute: Access granted', { 
    userRole: user?.role, 
    requiredRole 
  });
  return children;
};

export default ProtectedRoute;

