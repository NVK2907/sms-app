import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log('🔐 ProtectedRoute: Checking access');
  console.log('🔐 ProtectedRoute: Loading:', loading);
  console.log('🔐 ProtectedRoute: Is authenticated:', isAuthenticated);
  console.log('🔐 ProtectedRoute: User:', user);
  console.log('🔐 ProtectedRoute: Required role:', requiredRole);
  console.log('🔐 ProtectedRoute: Current location:', location.pathname);

  if (loading) {
    console.log('🔐 ProtectedRoute: Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔐 ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.roles?.[0]?.roleName?.toLowerCase() !== requiredRole.toLowerCase()) {
    console.log('🔐 ProtectedRoute: Role mismatch, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('🔐 ProtectedRoute: Access granted, rendering children');
  return children;
};

export default ProtectedRoute;
