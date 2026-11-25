import axios from 'axios';
import { getSnapshot } from '@/lib/constants/images';
import { getPpeLabel, PPE_TYPES } from '@/lib/constants/ppe';
import { PPE_STATE } from '@/lib/constants/ppeState';
import { DETECTION_STATUS, STATUS_META } from '@/lib/constants/status';
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

export const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL ?? 'http://127.0.0.1:8000';
export const AI_SERVICE_TOKEN = import.meta.env.VITE_AI_SERVICE_TOKEN ?? 'shared_secret_token_123';

let latestRealResult = null;

const EXPORT_COLUMNS = [
    { header: 'Person ID', accessor: (row) => row.personId },
    { header: 'Status', accessor: (row) => STATUS_META[row.status].label },
    ...PPE_TYPES.map((type) => ({ header: type.label, accessor: (row) => row.ppe[type.id] })),
    { header: 'Missing PPE', accessor: (row) => row.missingPpe.map(getPpeLabel).join('; ') },
    { header: 'Confidence', accessor: (row) => formatConfidence(row.confidence) },
    { header: 'Timestamp', accessor: (row) => formatDateTime(row.timestamp) },
];

const LABEL_MAP = {
    Hardhat: { ppeId: 'helmet', state: PPE_STATE.DETECTED },
    'NO-Hardhat': { ppeId: 'helmet', state: PPE_STATE.MISSING },
    'Safety Vest': { ppeId: 'safety_vest', state: PPE_STATE.DETECTED },
    'NO-Safety Vest': { ppeId: 'safety_vest', state: PPE_STATE.MISSING },
    Goggles: { ppeId: 'goggles', state: PPE_STATE.DETECTED },
    'NO-Goggles': { ppeId: 'goggles', state: PPE_STATE.MISSING },
    Gloves: { ppeId: 'gloves', state: PPE_STATE.DETECTED },
    'NO-Gloves': { ppeId: 'gloves', state: PPE_STATE.MISSING },
};

export function mapDetectionsToUi(rawDetections, videoMeta = null) {
    const rows = [];
    const annotations = [];
    let compliant = 0;
    let violations = 0;
    let uncertain = 0;

    rawDetections.forEach((det, idx) => {
        const mapped = LABEL_MAP[det.label];
        const isViolation = det.label.startsWith('NO-') || det.label === 'Fall-Detected';
        const status = isViolation
            ? DETECTION_STATUS.VIOLATION
            : mapped
              ? DETECTION_STATUS.COMPLIANT
              : DETECTION_STATUS.UNCERTAIN;

        if (status === DETECTION_STATUS.COMPLIANT) compliant += 1;
        else if (status === DETECTION_STATUS.VIOLATION) violations += 1;
        else uncertain += 1;

        const ppe = {
            helmet: PPE_STATE.UNCERTAIN,
            safety_vest: PPE_STATE.UNCERTAIN,
            goggles: PPE_STATE.UNCERTAIN,
            gloves: PPE_STATE.UNCERTAIN,
        };
        if (mapped) {
            ppe[mapped.ppeId] = mapped.state;
        }

        const missingPpe = PPE_TYPES.filter((t) => ppe[t.id] === PPE_STATE.MISSING).map((t) => t.id);

        rows.push({
            id: `DET-AI-${idx + 1}`,
            personId: `P-${String(idx + 1).padStart(3, '0')}`,
            snapshot: getSnapshot(idx),
            ppe,
            status,
            missingPpe,
            confidence: det.confidence,
            timestamp: det.timestamp || new Date().toISOString(),
        });

        if (det.box_pct) {
            annotations.push({
                id: `box-ai-${idx + 1}`,
                personLabel: `Detection #${idx + 1}`,
                status,
                label: isViolation ? `Violation (${det.label})` : det.label,
                confidence: det.confidence,
                snapshot: getSnapshot(idx),
                box: det.box_pct,
            });
        }
    });

    const total = rows.length || 1;
    return {
        video: videoMeta ?? { ...RESULT_VIDEO },
        summary: {
            total: rows.length,
            compliant,
            violations,
            uncertain,
            complianceRate: calculateRate(compliant, total),
        },
        annotations: annotations.length ? annotations : RESULT_ANNOTATIONS,
        rows: rows.length ? rows : DETECTION_ROWS,
    };
}

export function setLatestRealResult(result) {
    latestRealResult = result;
}

export async function analyzeImageBlob(imageBlob, fileName = 'frame.jpg') {
    const formData = new FormData();
    formData.append('file', imageBlob, fileName);

    const { data } = await axios.post(`${AI_BASE_URL}/predict/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-service-token': AI_SERVICE_TOKEN,
        },
        timeout: 20000,
    });

    const mapped = mapDetectionsToUi(data.detections || []);
    setLatestRealResult(mapped);
    return mapped.annotations;
}

export async function fetchDetectionResults() {
    if (latestRealResult) {
        return latestRealResult;
    }

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

export async function fetchLiveDetections(frameBlob = null) {
    if (frameBlob) {
        try {
            return await analyzeImageBlob(frameBlob, 'live_frame.jpg');
        } catch (err) {
            console.warn('AI inference fallback to demo data:', err.message);
        }
    }

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