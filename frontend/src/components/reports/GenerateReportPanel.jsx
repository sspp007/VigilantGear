import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { RadioGroup } from '@/components/common/RadioGroup';
import { Select } from '@/components/common/Select';
import { generateReport } from '@/lib/api/reportService';
import {
    getReportTypeLabel,
    REPORT_FORMAT_OPTIONS,
    REPORT_FORMATS,
    REPORT_GROUP_OPTIONS,
    REPORT_GROUPS,
    REPORT_TYPE_OPTIONS,
    REPORT_TYPES,
} from '@/lib/constants/reports';

export function GenerateReportPanel({ range, onGenerated }) {
    const [type, setType] = useState(REPORT_TYPES.COMPLIANCE);
    const [groupBy, setGroupBy] = useState(REPORT_GROUPS.OVERALL);
    const [format, setFormat] = useState(REPORT_FORMATS.PDF);
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleGenerate() {
        setIsGenerating(true);
        try {
            const report = await generateReport({ type, groupBy, format, range });
            toast.success(`${getReportTypeLabel(report.type)} generated. Download it from Recent Reports.`);
            onGenerated(report);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Card title="Generate Report">
            <div className="space-y-4">
                <Select label="Report Type" options={REPORT_TYPE_OPTIONS} value={type} onChange={setType} />
                <Select label="Group By" options={REPORT_GROUP_OPTIONS} value={groupBy} onChange={setGroupBy} />
                <RadioGroup
                    legend="Format"
                    name="report-format"
                    options={REPORT_FORMAT_OPTIONS}
                    value={format}
                    onChange={setFormat}
                />
                <Button icon={Download} fullWidth isLoading={isGenerating} onClick={handleGenerate}>
                    Generate Report
                </Button>
                <p className="text-xs text-ink-muted">
                    Demo mode: PDF and Excel reports are simulated. Their downloads contain the same data as a CSV file.
                </p>
            </div>
        </Card>
    );
}