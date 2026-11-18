import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ROUTES } from '@/lib/constants/routes';

export function NotFoundPage() {
    useDocumentTitle('Page not found');

    return (
        <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
            <EmptyState
                icon={Compass}
                title="Page not found"
                description="The page you are looking for does not exist or has been moved."
                action={
                    <Button as={Link} to={ROUTES.landing}>
                        Back to home
                    </Button>
                }
            />
        </div>
    );
}