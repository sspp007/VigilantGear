import { LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { NAV_ITEMS } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils/cn';

export function Sidebar({ isOpen, onClose, onLogout }) {
    useEffect(() => {
        if (!isOpen) return undefined;

        function handleKeyDown(event) {
            if (event.key === 'Escape') onClose();
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-navy/60 lg:hidden" aria-hidden="true" onClick={onClose} />
            )}
            <aside
                id="app-sidebar"
                aria-label="Sidebar"
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-72 flex-col rounded-r-3xl bg-navy px-4 py-6 text-white shadow-2xl transition-transform duration-200',
                    'lg:inset-y-4 lg:left-4 lg:z-30 lg:w-64 lg:translate-x-0 lg:rounded-3xl',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="px-2">
                    <Logo variant="light" />
                </div>

                <nav aria-label="Main navigation" className="mt-8 flex-1 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
                                    isActive ? 'bg-brand text-white shadow-soft' : 'text-slate-200 hover:bg-white/10 hover:text-white',
                                )
                            }
                        >
                            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-4 border-t border-white/15 pt-4">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                        <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}