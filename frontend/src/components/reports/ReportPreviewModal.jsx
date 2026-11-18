import { Download } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { Modal } from '@/components/common/Modal';
import { buildReportTable } from '@/lib/api/reportService';
import { getReportTypeLabel, REPORT_FORMATS } from '@/lib/constants/reports';
import { formatDateRange } from '@/lib/utils/format';

export function ReportPreviewModal({ report, onClose, onDownload }) {
    const table = report ? buildReportTable(report) : null;
    const columns = table
        ? table.columns.map((column) => ({
            key: column.header,
            header: column.header,
            cell: (row) => column.accessor(row),
        }))
        : [];

    return (
        <Modal
            isOpen={Boolean(report)}
            onClose={onClose}
            title={report ? getReportTypeLabel(report.type) : ''}
            description={report ? formatDateRange(report.start, report.end) : undefined}
            size="lg"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button icon={Download} onClick={() => onDownload(report)}>
                        Download CSV
                    </Button>
                </>
            }
        >
            {report && (
                <>
                    {report.format !== REPORT_FORMATS.CSV && (
                        <p className="mb-3 text-xs text-ink-muted">
                            Demo mode: this preview shows the report data. The download is a CSV file with the same content.
                        </p>
                    )}
                    <DataTable
                        columns={columns}
                        rows={table.rows}
                        getRowKey={(row) => row.id ?? row.label}
                        caption="Report preview"
                        minWidth="min-w-[520px]"
                    />
                </>
            )}
        </Modal>
    );
}