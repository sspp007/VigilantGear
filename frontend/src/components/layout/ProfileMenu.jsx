import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';
import { useDismissibleLayer } from '@/hooks/useDismissibleLayer';
import { ROLE_LABELS } from '@/lib/constants/roles';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';

const MENU_ITEM_CLASS =
    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink transition hover:bg-slate-100';

export function ProfileMenu({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useDismissibleLayer(isOpen, () => setIsOpen(false));

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="Account menu"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                    <User className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="hidden max-w-32 truncate text-base font-bold text-ink sm:inline">{user.fullName}</span>
                <ChevronDown
                    className={cn('h-4 w-4 text-ink transition-transform', isOpen && 'rotate-180')}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div className="card absolute right-0 top-full z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] p-2">
                    <div className="px-3 py-2">
                        <p className="truncate text-sm font-bold text-ink">{user.fullName}</p>
                        <p className="truncate text-xs text-ink-muted">{user.email}</p>
                        <Badge className="mt-2 bg-orange-100 text-brand-dark">{ROLE_LABELS[user.role]}</Badge>
                    </div>
                    <div className="my-1 border-t border-line" />
                    <Link to={ROUTES.settings} onClick={() => setIsOpen(false)} className={MENU_ITEM_CLASS}>
                        <Settings className="h-4 w-4" aria-hidden="true" />
                        Settings
                    </Link>
                    <button type="button" onClick={onLogout} className={MENU_ITEM_CLASS}>
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}