import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants/routes';

export function GuestRoute() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        return <Navigate to={location.state?.from?.pathname ?? ROUTES.dashboard} replace />;
    }

    return <Outlet />;
}