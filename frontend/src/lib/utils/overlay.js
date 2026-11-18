import { STATUS_META } from '@/lib/constants/status';
import { formatConfidence } from '@/lib/utils/format';

const DEFAULT_ASPECT_RATIO = 16 / 9;

export function drawDetections(context, width, height, detections) {
    const fontSize = Math.max(12, Math.round(width * 0.022));
    const padding = fontSize * 0.5;
    const labelHeight = fontSize + padding * 1.6;

    context.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
    context.textBaseline = 'middle';
    context.lineWidth = Math.max(2, width * 0.003);

    for (const detection of detections) {
        const color = STATUS_META[detection.status].color;
        const x = (detection.box.left / 100) * width;
        const y = (detection.box.top / 100) * height;
        const boxWidth = (detection.box.width / 100) * width;
        const boxHeight = (detection.box.height / 100) * height;
        const text =
            detection.confidence === undefined
                ? detection.label
                : `${detection.label} (${formatConfidence(detection.confidence)})`;
        const labelWidth = context.measureText(text).width + padding * 2;
        const labelY = Math.max(0, y - labelHeight);

        context.strokeStyle = color;
        context.strokeRect(x, y, boxWidth, boxHeight);
        context.fillStyle = color;
        context.fillRect(x, labelY, labelWidth, labelHeight);
        context.fillStyle = '#FFFFFF';
        context.fillText(text, x + padding, labelY + labelHeight / 2);
    }
}

export function captureVideoFrame({ video, detections, aspectRatio = DEFAULT_ASPECT_RATIO }) {
    const { videoWidth, videoHeight } = video;
    if (!videoWidth || !videoHeight) {
        return Promise.reject(new Error('The camera frame is not ready yet.'));
    }

    const isWiderThanStage = videoWidth / videoHeight > aspectRatio;
    const cropWidth = isWiderThanStage ? videoHeight * aspectRatio : videoWidth;
    const cropHeight = isWiderThanStage ? videoHeight : videoWidth / aspectRatio;
    const sourceX = (videoWidth - cropWidth) / 2;
    const sourceY = (videoHeight - cropHeight) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(cropWidth);
    canvas.height = Math.round(cropHeight);

    const context = canvas.getContext('2d');
    context.drawImage(video, sourceX, sourceY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
    drawDetections(context, canvas.width, canvas.height, detections);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Unable to capture the frame.'))),
            'image/png',
        );
    });
}