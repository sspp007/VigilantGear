import { getPpeLabel, PPE_TYPES } from '@/lib/constants/ppe';
import { PPE_STATE } from '@/lib/constants/ppeState';
import { STATUS_META } from '@/lib/constants/status';
import {
    DETECTION_ROWS,
    DETECTION_SUMMARY,
    LIVE_DEMO_DETECTIONS,
    RESULT_ANNOTATIONS,
    RESULT_VIDEO,
} from '@/lib/data/detectionData';
import { downloadCsv } from '@/lib/utils/csv';
import { wait } from '@/lib/utils/delay';
import { calculateRate, formatConfidence, formatDateTime } from '@/lib/utils/format';

const EXPORT_COLUMNS = [
    { header: 'Person ID', accessor: (row) => row.personId },
    { header: 'Status', accessor: (row) => STATUS_META[row.status].label },
    ...PPE_TYPES.map((type) => ({ header: type.label, accessor: (row) => row.ppe[type.id] })),
    { header: 'Missing PPE', accessor: (row) => row.missingPpe.map(getPpeLabel).join('; ') },
    { header: 'Confidence', accessor: (row) => formatConfidence(row.confidence) },
    { header: 'Timestamp', accessor: (row) => formatDateTime(row.timestamp) },
];

export async function fetchDetectionResults() {
    await wait();

    return {
        video: { ...RESULT_VIDEO },
        summary: {
            ...DETECTION_SUMMARY,
            complianceRate: calculateRate(DETECTION_SUMMARY.compliant, DETECTION_SUMMARY.total),
        },
        annotations: RESULT_ANNOTATIONS,
        rows: DETECTION_ROWS,
    };
}

export async function fetchLiveDetections() {
    await wait(150);
    return LIVE_DEMO_DETECTIONS.map((detection) => ({ ...detection, box: { ...detection.box } }));
}

export function filterDetections(rows, { query = '', ppe = 'all', status = 'all' }) {
    const needle = query.trim().toLowerCase();

    return rows.filter((row) => {
        if (status !== 'all' && row.status !== status) return false;
        if (ppe !== 'all' && row.ppe[ppe] === PPE_STATE.DETECTED) return false;
        return !needle || row.personId.toLowerCase().includes(needle);
    });
}

export function exportDetectionsCsv(rows, fileName = 'detection_results.csv') {
    downloadCsv(fileName, EXPORT_COLUMNS, rows);
}