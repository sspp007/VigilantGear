import { Badge } from '@/components/common/Badge';
import { JOB_STATUS_META } from '@/lib/constants/jobStatus';
import { getViolationCategory } from '@/lib/constants/ppe';
import { REVIEW_STATUS_META, STATUS_META } from '@/lib/constants/status';

export function StatusBadge({ status, label }) {
    const meta = STATUS_META[status];
    return <Badge className={meta.badge}>{label ?? meta.label}</Badge>;
}

export function CategoryBadge({ categoryId, label }) {
    const category = getViolationCategory(categoryId);
    return <Badge className={category.badge}>{label ?? category.label}</Badge>;
}

export function ReviewStatusBadge({ status }) {
    const meta = REVIEW_STATUS_META[status];
    return <Badge className={meta.badge}>{meta.label}</Badge>;
}

export function JobStatusBadge({ status }) {
    const meta = JOB_STATUS_META[status];
    return <Badge className={meta.badge}>{meta.label}</Badge>;
}