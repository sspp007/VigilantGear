import { Check, CircleHelp, Users, X } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { StatRow } from '@/components/common/StatRow';
import { DETECTION_STATUS } from '@/lib/constants/status';
import { countByStatus } from '@/lib/utils/stats';

export function LiveCounters({ detections }) {
    const counts = countByStatus(detections);

    return (
        <Card title="Live Counters">
            <div className="space-y-2">
                <StatRow icon={Users} tone="info" label="People Detected" value={detections.length} />
                <StatRow icon={Check} tone="success" label="Compliant" value={counts[DETECTION_STATUS.COMPLIANT]} />
                <StatRow icon={X} tone="danger" label="Violations" value={counts[DETECTION_STATUS.VIOLATION]} />
                <StatRow icon={CircleHelp} tone="warning" label="Uncertain" value={counts[DETECTION_STATUS.UNCERTAIN]} />
            </div>
        </Card>
    );
}