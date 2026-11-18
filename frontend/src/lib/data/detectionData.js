import { getSnapshot } from '@/lib/constants/images';
import { PPE_TYPES } from '@/lib/constants/ppe';
import { PPE_STATE } from '@/lib/constants/ppeState';
import { DETECTION_STATUS } from '@/lib/constants/status';

export const DETECTION_SUMMARY = Object.freeze({
    total: 412,
    compliant: 318,
    violations: 68,
    uncertain: 26,
});

export const RESULT_VIDEO = Object.freeze({
    fileName: 'construction_day2.mp4',
    durationSeconds: 96,
    positionSeconds: 24,
});

const STATE_CODES = {
    D: PPE_STATE.DETECTED,
    M: PPE_STATE.MISSING,
    U: PPE_STATE.UNCERTAIN,
};

const DETECTION_SPECS = [
    { code: 'DDDD', confidence: 0.98, time: '10:24' },
    { code: 'MDDM', confidence: 0.97, time: '10:17' },
    { code: 'DDDD', confidence: 0.96, time: '10:09' },
    { code: 'DDUD', confidence: 0.85, time: '10:05' },
    { code: 'DDDD', confidence: 0.95, time: '09:58' },
    { code: 'MDDD', confidence: 0.93, time: '09:52' },
    { code: 'DDDD', confidence: 0.94, time: '09:47' },
    { code: 'DDDD', confidence: 0.92, time: '09:41' },
    { code: 'DUDD', confidence: 0.81, time: '09:38' },
    { code: 'DDDD', confidence: 0.96, time: '09:33' },
    { code: 'DDMD', confidence: 0.9, time: '09:29' },
    { code: 'DDDD', confidence: 0.97, time: '09:24' },
    { code: 'DDDD', confidence: 0.95, time: '09:20' },
    { code: 'DDDD', confidence: 0.91, time: '09:16' },
    { code: 'DMDD', confidence: 0.89, time: '09:12' },
    { code: 'DDDD', confidence: 0.94, time: '09:08' },
    { code: 'DDDU', confidence: 0.82, time: '09:03' },
    { code: 'DDDD', confidence: 0.93, time: '08:58' },
    { code: 'MDDD', confidence: 0.88, time: '08:52' },
    { code: 'DDDD', confidence: 0.96, time: '08:47' },
    { code: 'DDDD', confidence: 0.97, time: '08:41' },
    { code: 'DDDM', confidence: 0.86, time: '08:36' },
    { code: 'DDDD', confidence: 0.95, time: '08:30' },
    { code: 'DDDD', confidence: 0.98, time: '08:25' },
];

function deriveStatus(states) {
    if (states.includes(PPE_STATE.MISSING)) return DETECTION_STATUS.VIOLATION;
    if (states.includes(PPE_STATE.UNCERTAIN)) return DETECTION_STATUS.UNCERTAIN;
    return DETECTION_STATUS.COMPLIANT;
}

function buildDetection(spec, index) {
    const ppe = Object.fromEntries(
        PPE_TYPES.map((type, position) => [type.id, STATE_CODES[spec.code[position]]]),
    );

    return {
        id: `DET-${index + 1}`,
        personId: `P-${String(index + 1).padStart(3, '0')}`,
        snapshot: getSnapshot(index),
        ppe,
        status: deriveStatus(Object.values(ppe)),
        missingPpe: PPE_TYPES.filter((type) => ppe[type.id] === PPE_STATE.MISSING).map((type) => type.id),
        confidence: spec.confidence,
        timestamp: `2025-01-26T${spec.time}:00`,
    };
}

export const DETECTION_ROWS = DETECTION_SPECS.map(buildDetection);

export const RESULT_ANNOTATIONS = [
    {
        id: 'box-1',
        status: DETECTION_STATUS.COMPLIANT,
        label: 'Compliant',
        box: { left: 13, top: 29, width: 18, height: 71 },
    },
    {
        id: 'box-2',
        status: DETECTION_STATUS.VIOLATION,
        label: 'Violation (No Helmet)',
        box: { left: 42, top: 31, width: 20, height: 69 },
    },
    {
        id: 'box-3',
        status: DETECTION_STATUS.UNCERTAIN,
        label: 'Uncertain',
        box: { left: 73.5, top: 32, width: 17, height: 68 },
    },
];

export const LIVE_DEMO_DETECTIONS = [
    {
        id: 'live-1',
        personLabel: 'Person #1',
        status: DETECTION_STATUS.COMPLIANT,
        label: 'Compliant',
        confidence: 0.98,
        snapshot: getSnapshot(0),
        box: { left: 10, top: 31, width: 21, height: 69 },
    },
    {
        id: 'live-2',
        personLabel: 'Person #2',
        status: DETECTION_STATUS.VIOLATION,
        label: 'No Helmet',
        confidence: 0.97,
        snapshot: getSnapshot(1),
        box: { left: 43, top: 30, width: 21, height: 70 },
    },
    {
        id: 'live-3',
        personLabel: 'Person #3',
        status: DETECTION_STATUS.COMPLIANT,
        label: 'Compliant',
        confidence: 0.96,
        snapshot: getSnapshot(2),
        box: { left: 76.5, top: 35, width: 19.5, height: 65 },
    },
];