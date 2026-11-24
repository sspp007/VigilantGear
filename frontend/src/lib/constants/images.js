// No source footage is bundled with this demo. SafeImage renders its local,
// context-specific SVG visual whenever these optional image slots are empty.
export const IMAGES = Object.freeze({
    heroWorker: null,
    loginWorker: null,
    signupWorker: null,
    constructionSite: null,
    liveFrame: null,
});

export const SNAPSHOT_IMAGES = Array(6).fill(null);

export const JOB_THUMBNAILS = Array(3).fill(null);

export function getSnapshot(index) {
    return SNAPSHOT_IMAGES[index % SNAPSHOT_IMAGES.length];
}
