export const DETECTION_SOURCE = Object.freeze({
    WEBCAM: 'webcam',
    VIDEO: 'video',
});

export const SOURCE_OPTIONS = [
    { value: 'all', label: 'All Sources' },
    { value: DETECTION_SOURCE.WEBCAM, label: 'Webcam (Live)' },
    { value: DETECTION_SOURCE.VIDEO, label: 'Video Upload' },
];

export function formatSource(type, name) {
    return type === DETECTION_SOURCE.WEBCAM ? 'Webcam (Live)' : `Video (${name})`;
}