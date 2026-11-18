import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
    return (
        <div className={cn('flex flex-col items-center justify-center px-4 py-12 text-center', className)}>
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="text-base font-bold text-ink">{title}</h3>
            {description && <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}