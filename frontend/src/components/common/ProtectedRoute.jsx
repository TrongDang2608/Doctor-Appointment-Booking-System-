import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

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

  // Check authentication for the specific role from localStorage
  // This allows multiple roles to be logged in simultaneously
  const roleSpecificUser = requiredRole ? authService.getCurrentUser(requiredRole) : null;
  const roleSpecificToken = requiredRole ? authService.getToken(requiredRole) : null;
  const isRoleAuthenticated = roleSpecificUser && roleSpecificToken;

  if (!isRoleAuthenticated) {
    logPersistent('ProtectedRoute: Not authenticated for required role, redirecting to login', { 
      requiredRole,
      hasRoleUser: !!roleSpecificUser,
      hasRoleToken: !!roleSpecificToken
    });
    return <Navigate to="/login" replace />;
  }

  // Verify role matches (double check)
  if (requiredRole && roleSpecificUser?.role !== requiredRole) {
    logPersistent('ProtectedRoute: Role mismatch - redirecting to unauthorized', { 
      userRole: roleSpecificUser?.role, 
      requiredRole 
    });
    return <Navigate to="/unauthorized" replace />;
  }

  logPersistent('ProtectedRoute: Access granted', { 
    userRole: roleSpecificUser?.role, 
    requiredRole 
  });
  return children;
};

export default ProtectedRoute;

