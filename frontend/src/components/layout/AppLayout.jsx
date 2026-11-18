import { useCallback, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PAGE_META } from '@/lib/constants/pageMeta';
import { ROUTES } from '@/lib/constants/routes';

export function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useDocumentTitle(PAGE_META[pathname]?.title);

    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

    const handleLogout = useCallback(() => {
        logout();
        toast.success('You have been signed out.');
        navigate(ROUTES.login, { replace: true });
    }, [logout, navigate]);

    return (
        <div className="min-h-screen bg-canvas">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onLogout={handleLogout} />
            <div className="lg:pl-72">
                <Header user={user} onMenuClick={() => setIsSidebarOpen(true)} onLogout={handleLogout} />
                <main id="main-content" className="px-4 pb-10 sm:px-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}