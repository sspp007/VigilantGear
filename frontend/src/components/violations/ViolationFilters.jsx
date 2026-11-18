import { Download } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { SearchInput } from '@/components/common/SearchInput';
import { Select } from '@/components/common/Select';
import { PPE_FILTER_OPTIONS } from '@/lib/constants/ppe';
import { SOURCE_OPTIONS } from '@/lib/constants/sources';
import { REVIEW_STATUS_OPTIONS } from '@/lib/constants/status';

export function ViolationFilters({ filters, onChange, onExport }) {
    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchInput
                value={filters.query}
                onChange={(value) => onChange('query', value)}
                placeholder="Search by Person ID, Video Name or Location…"
                ariaLabel="Search violations"
                className="lg:flex-1"
            />
            <Select
                aria-label="PPE type"
                options={PPE_FILTER_OPTIONS}
                value={filters.ppe}
                onChange={(value) => onChange('ppe', value)}
                className="lg:w-44"
            />
            <Select
                aria-label="Source"
                options={SOURCE_OPTIONS}
                value={filters.source}
                onChange={(value) => onChange('source', value)}
                className="lg:w-44"
            />
            <Select
                aria-label="Status"
                options={REVIEW_STATUS_OPTIONS}
                value={filters.status}
                onChange={(value) => onChange('status', value)}
                className="lg:w-40"
            />
            <Button icon={Download} onClick={onExport}>
                Export CSV
            </Button>
        </div>
    );
}