import { Info } from 'lucide-react';
import { useState } from 'react';
import { CONFIDENCE_LIMITS } from '@/lib/constants/settings';

const { min, max, step } = CONFIDENCE_LIMITS;

export function ConfidenceSlider({ value, onChange }) {
    const [draftText, setDraftText] = useState(null);

    function handleSliderChange(event) {
        setDraftText(null);
        onChange(Number(Number(event.target.value).toFixed(2)));
    }

    function handleTextChange(event) {
        const raw = event.target.value;
        setDraftText(raw);

        const parsed = Number(raw);
        if (raw.trim() !== '' && Number.isFinite(parsed) && parsed >= min && parsed <= max) {
            onChange(Number(parsed.toFixed(2)));
        }
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="flex shrink-0 items-center gap-2 text-sm font-bold text-ink sm:w-52">
                Confidence Threshold
                <span title="Detections below this confidence are treated as uncertain. Applied when real detection is added.">
                    <Info className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                </span>
            </span>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleSliderChange}
                aria-label="Confidence threshold"
                className="h-2 min-w-0 flex-1 cursor-pointer accent-brand"
            />
            <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={draftText ?? value.toFixed(2)}
                onChange={handleTextChange}
                onBlur={() => setDraftText(null)}
                aria-label="Confidence threshold value"
                className="field-input w-24 text-center font-semibold"
            />
        </div>
    );
}