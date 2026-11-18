import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { SafeImage } from '@/components/common/SafeImage';
import { CategoryBadge } from '@/components/common/StatusBadge';
import { ROUTES } from '@/lib/constants/routes';
import { formatDateTime } from '@/lib/utils/format';

export function RecentViolations({ records }) {
    return (
        <Card
            title="Recent Violations"
            action={
                <Link
                    to={ROUTES.violationHistory}
                    className="inline-flex items-center gap-1 text-sm font-bold text-brand transition hover:text-brand-dark"
                >
                    View All
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            }
        >
            {records.length === 0 ? (
                <EmptyState title="No recent violations" description="Nothing was recorded in this period." />
            ) : (
                <ul className="divide-y divide-line">
                    {records.map((record) => (
                        <li key={record.id}>
                            <Link
                                to={`${ROUTES.violationHistory}?q=${encodeURIComponent(record.personId)}`}
                                className="flex items-center gap-3 rounded-xl py-3 transition hover:bg-slate-50"
                            >
                                <SafeImage
                                    src={record.snapshot}
                                    alt={`Snapshot of ${record.personId}`}
                                    className="h-16 w-20 shrink-0 rounded-lg"
                                />
                                <div className="min-w-0 flex-1">
                                    <CategoryBadge categoryId={record.category} />
                                    <p className="mt-1 text-sm font-medium text-ink-muted">{formatDateTime(record.detectedAt)}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 shrink-0 text-ink" aria-hidden="true" />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}