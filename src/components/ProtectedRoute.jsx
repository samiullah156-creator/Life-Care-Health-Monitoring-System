import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-life-blue border-t-transparent" />
      </div>
    );
  }

  const isAdminRoute = allowedRoles && allowedRoles.includes('admin');
  if (!user) {
    return <Navigate to={isAdminRoute ? '/admin-auth' : '/login'} state={{ from: location }} replace />;
  }

  const effectiveRole = role ?? 'user';
  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    if (effectiveRole === 'admin') return <Navigate to="/admin" replace />;
    if (effectiveRole === 'doctor') return <Navigate to="/doctor" replace />;
    if (isAdminRoute) return <Navigate to="/admin-auth" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
}
