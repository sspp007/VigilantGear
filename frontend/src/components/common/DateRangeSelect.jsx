import { CalendarDays } from 'lucide-react';
import { Select } from '@/components/common/Select';
import { cn } from '@/lib/utils/cn';

export function DateRangeSelect({ ranges, value, onChange, className }) {
    const options = ranges.map((range) => ({ value: range.id, label: range.label }));

    return (
        <Select
            aria-label="Date range"
            icon={CalendarDays}
            options={options}
            value={value}
            onChange={onChange}
            className={cn('w-full sm:w-72', className)}
        />
    );
}