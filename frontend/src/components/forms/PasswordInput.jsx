import { Eye, EyeOff, Lock } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Input } from '@/components/common/Input';

export const PasswordInput = forwardRef(function PasswordInput(props, ref) {
    const [isVisible, setIsVisible] = useState(false);
    const ToggleIcon = isVisible ? EyeOff : Eye;

    return (
        <Input
            ref={ref}
            icon={Lock}
            type={isVisible ? 'text' : 'password'}
            endAdornment={
                <button
                    type="button"
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={isVisible}
                    onClick={() => setIsVisible(!isVisible)}
                    className="rounded-full p-2 text-ink-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                >
                    <ToggleIcon className="h-5 w-5" aria-hidden="true" />
                </button>
            }
            {...props}
        />
    );
});