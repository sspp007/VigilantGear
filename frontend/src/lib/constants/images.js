const IMAGE_BASE = '/images';

export const IMAGES = Object.freeze({
    heroWorker: `${IMAGE_BASE}/hero-worker.jpg`,
    loginWorker: `${IMAGE_BASE}/login-worker.jpg`,
    signupWorker: `${IMAGE_BASE}/signup-worker.jpg`,
    constructionSite: `${IMAGE_BASE}/construction-site.jpg`,
    liveFrame: `${IMAGE_BASE}/live-frame.jpg`,
});

export const SNAPSHOT_IMAGES = Array.from(
    { length: 6 },
    (_, index) => `${IMAGE_BASE}/snapshots/snap-${index + 1}.jpg`,
);

export const JOB_THUMBNAILS = Array.from(
    { length: 3 },
    (_, index) => `${IMAGE_BASE}/thumbs/thumb-${index + 1}.jpg`,
);

export function getSnapshot(index) {
    return SNAPSHOT_IMAGES[index % SNAPSHOT_IMAGES.length];
}