import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../lib/store';

interface AdminRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'superadmin';
}

/**
 * Role-based route protection component.
 * Redirects unauthorized users to dashboard with access denied message.
 */
export const AdminRoute = ({ children, requiredRole = 'admin' }: AdminRouteProps) => {
    const { isAuthenticated, currentUser, addToast } = useStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
    const isSuperAdmin = currentUser?.role === 'superadmin';

    const hasAccess = requiredRole === 'superadmin' ? isSuperAdmin : isAdmin;

    if (!hasAccess) {
        // Show toast and redirect to dashboard
        addToast({ type: 'error', message: 'Access Denied: You do not have permission to view this page.' });
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
