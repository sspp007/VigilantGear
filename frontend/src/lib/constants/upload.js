export const ACCEPTED_VIDEO_EXTENSIONS = ['mp4', 'avi', 'mov', 'mkv'];
export const MAX_VIDEO_SIZE_MB = 500;
export const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;
export const VIDEO_INPUT_ACCEPT = ACCEPTED_VIDEO_EXTENSIONS.map((extension) => `.${extension}`).join(',');