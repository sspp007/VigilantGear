import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDismissibleLayer } from '@/hooks/useDismissibleLayer';
import {
    loadNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from '@/lib/api/notificationService';
import { cn } from '@/lib/utils/cn';
import { formatDateTime } from '@/lib/utils/format';

export function NotificationMenu() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(loadNotifications);
    const containerRef = useDismissibleLayer(isOpen, () => setIsOpen(false));
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    function toggleMenu() {
        if (!isOpen) setNotifications(loadNotifications());
        setIsOpen(!isOpen);
    }

    function openNotification(notification) {
        setNotifications(markNotificationRead(notification.id));
        setIsOpen(false);
        navigate(notification.to);
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={toggleMenu}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
                <Bell className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-canvas" />
                )}
            </button>

            {isOpen && (
                <div className="card absolute right-0 top-full z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden">
                    <div className="flex items-center justify-between border-b border-line px-4 py-3">
                        <h2 className="text-sm font-bold text-ink">Notifications</h2>
                        <button
                            type="button"
                            disabled={unreadCount === 0}
                            onClick={() => setNotifications(markAllNotificationsRead())}
                            className="text-xs font-semibold text-brand transition hover:text-brand-dark disabled:cursor-not-allowed disabled:text-slate-400"
                        >
                            Mark all as read
                        </button>
                    </div>
                    <ul className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                            <li key={notification.id} className="border-b border-line last:border-b-0">
                                <button
                                    type="button"
                                    onClick={() => openNotification(notification)}
                                    className={cn(
                                        'flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50',
                                        !notification.read && 'bg-surface-warning/40',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                                            notification.read ? 'bg-transparent' : 'bg-brand',
                                        )}
                                        aria-hidden="true"
                                    />
                                    <span className="min-w-0">
                                        <span className="block text-sm font-semibold text-ink">{notification.title}</span>
                                        <span className="block truncate text-xs text-ink-muted">{notification.description}</span>
                                        <span className="block text-xs text-slate-400">{formatDateTime(notification.createdAt)}</span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}