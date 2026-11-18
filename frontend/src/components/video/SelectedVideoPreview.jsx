import { Play, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { formatBytes } from '@/lib/utils/format';

export function SelectedVideoPreview({ file, onStart, onRemove, isStarting }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewFailed, setPreviewFailed] = useState(false);

    useEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setPreviewFailed(false);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return (
        <div className="mt-4 rounded-2xl border border-line p-3">
            {previewFailed ? (
                <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-100 px-4 text-center text-sm text-ink-muted">
                    Your browser cannot preview this video format, but it can still be analyzed.
                </div>
            ) : (
                <video
                    src={previewUrl ?? undefined}
                    controls
                    preload="metadata"
                    onError={() => setPreviewFailed(true)}
                    aria-label={`Preview of ${file.name}`}
                    className="aspect-video w-full rounded-xl bg-black"
                />
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{file.name}</p>
                    <p className="text-xs text-ink-muted">{formatBytes(file.size)}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" icon={Trash2} onClick={onRemove} disabled={isStarting}>
                        Remove
                    </Button>
                    <Button size="sm" icon={Play} onClick={onStart} isLoading={isStarting}>
                        Start Analysis
                    </Button>
                </div>
            </div>
        </div>
    );
}