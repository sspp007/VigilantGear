import { ACCEPTED_VIDEO_EXTENSIONS, MAX_VIDEO_SIZE_BYTES } from '@/lib/constants/upload';
import { formatBytes } from '@/lib/utils/format';

export function getFileExtension(name) {
    const dotIndex = name.lastIndexOf('.');
    return dotIndex === -1 ? '' : name.slice(dotIndex + 1).toLowerCase();
}

export function validateVideoFile(file) {
    if (!file) return 'No file selected.';

    if (!ACCEPTED_VIDEO_EXTENSIONS.includes(getFileExtension(file.name))) {
        const supported = ACCEPTED_VIDEO_EXTENSIONS.map((extension) => extension.toUpperCase()).join(', ');
        return `Unsupported format. Supported formats: ${supported}.`;
    }

    if (file.size === 0) return 'The selected file is empty.';

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
        return `File is too large (${formatBytes(file.size)}). Maximum size is ${formatBytes(MAX_VIDEO_SIZE_BYTES)}.`;
    }

    return null;
}