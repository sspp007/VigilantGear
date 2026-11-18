import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { IconButton } from '@/components/common/IconButton';
import { NotificationMenu } from '@/components/layout/NotificationMenu';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProfileMenu } from '@/components/layout/ProfileMenu';
import { NAV_ITEMS } from '@/lib/constants/navigation';
import { PAGE_META } from '@/lib/constants/pageMeta';

export function Header({ user, onMenuClick, onLogout }) {
    const { pathname } = useLocation();
    const navItem = NAV_ITEMS.find((item) => item.to === pathname);
    const meta = PAGE_META[pathname];

    return (
        <header className="relative z-20 flex items-center gap-3 px-4 py-4 sm:px-6">
            <IconButton
                icon={Menu}
                label="Open navigation menu"
                variant="plain"
                className="lg:hidden"
                aria-controls="app-sidebar"
                onClick={onMenuClick}
            />
            <PageHeader
                icon={navItem?.icon}
                title={meta?.title ?? 'VigilantGear'}
                subtitle={meta?.subtitle}
                className="flex-1"
            />
            <div className="flex items-center gap-2 sm:gap-4">
                <NotificationMenu />
                <span className="hidden h-8 w-px bg-line sm:block" aria-hidden="true" />
                <ProfileMenu user={user} onLogout={onLogout} />
            </div>
        </header>
    );
}