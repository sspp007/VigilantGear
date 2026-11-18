import { FolderOpen, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ACCEPTED_VIDEO_EXTENSIONS, MAX_VIDEO_SIZE_MB, VIDEO_INPUT_ACCEPT } from '@/lib/constants/upload';
import { cn } from '@/lib/utils/cn';
import { validateVideoFile } from '@/lib/utils/file';

const SUPPORTED_FORMATS = ACCEPTED_VIDEO_EXTENSIONS.map((extension) => extension.toUpperCase()).join(', ');

export function VideoUploadZone({ onFileSelected, disabled = false }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);

    function handleFile(file) {
        const validationError = validateVideoFile(file);
        setError(validationError);
        if (!validationError) onFileSelected(file);
    }

    function handleChange(event) {
        const [file] = event.target.files;
        event.target.value = '';
        if (file) handleFile(file);
    }

    function handleDrop(event) {
        event.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        const [file] = event.dataTransfer.files;
        if (file) handleFile(file);
    }

    return (
        <div>
            <label
                onDragOver={(event) => {
                    event.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    'flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition focus-within:ring-2 focus-within:ring-brand/40',
                    isDragging ? 'border-brand bg-orange-50' : 'border-blue-500 bg-surface-info/40 hover:bg-surface-info',
                    disabled && 'cursor-not-allowed opacity-60',
                )}
            >
                <input
                    type="file"
                    accept={VIDEO_INPUT_ACCEPT}
                    disabled={disabled}
                    onChange={handleChange}
                    className="sr-only"
                />
                <UploadCloud className="h-16 w-16 text-blue-600" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-lg font-bold text-ink">Drag &amp; drop a video here or click to upload</span>
                <span className="text-sm text-ink-muted">
                    {`Supported Formats: ${SUPPORTED_FORMATS}`}
                    <br />
                    {`Max File Size: ${MAX_VIDEO_SIZE_MB} MB`}
                </span>
                <Button as="span" icon={FolderOpen} size="lg">
                    Choose File
                </Button>
            </label>

            {error && (
                <p role="alert" className="mt-3 rounded-xl bg-surface-danger px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}