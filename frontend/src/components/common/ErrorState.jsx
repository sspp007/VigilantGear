import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';

export function ErrorState({ title = 'Something went wrong', message, onRetry, className }) {
    return (
        <EmptyState
            icon={AlertTriangle}
            title={title}
            description={message ?? 'We could not load this data. Please try again.'}
            className={className}
            action={
                onRetry && (
                    <Button variant="secondary" size="sm" onClick={onRetry}>
                        Try again
                    </Button>
                )
            }
        />
    );
}