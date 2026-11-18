import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils/cn';
import { toCsv } from '@/lib/utils/csv';
import { validateVideoFile } from '@/lib/utils/file';
import { calculateRate, formatBytes, formatDateTime } from '@/lib/utils/format';
import { signupSchema } from '@/lib/validators/authSchemas';

describe('cn', () => {
    it('joins strings, arrays and truthy object keys', () => {
        expect(cn('a', false, ['b', { c: true, d: false }])).toBe('a b c');
    });
});

describe('toCsv', () => {
    it('escapes commas and quotes', () => {
        const columns = [
            { header: 'Name', accessor: (row) => row.name },
            { header: 'Note', accessor: (row) => row.note },
        ];
        const csv = toCsv(columns, [{ name: 'A, B', note: 'say "hi"' }]);
        expect(csv).toBe('Name,Note\r\n"A, B","say ""hi"""');
    });
});

describe('format helpers', () => {
    it('calculates compliance rates from the reference totals', () => {
        expect(calculateRate(2964, 3842)).toBe(77.1);
        expect(calculateRate(318, 412)).toBe(77.2);
        expect(calculateRate(1, 0)).toBe(0);
    });

    it('formats byte sizes', () => {
        expect(formatBytes(856 * 1024)).toBe('856 KB');
        expect(formatBytes(Math.round(1.2 * 1024 * 1024))).toBe('1.2 MB');
    });

    it('formats date and time like the reference screens', () => {
        expect(formatDateTime('2025-01-26T10:24:00')).toBe('Jan 26, 10:24 AM');
        expect(formatDateTime('2025-01-26T09:58:00')).toBe('Jan 26, 09:58 AM');
    });
});

describe('validateVideoFile', () => {
    it('accepts a supported video', () => {
        const file = new File(['data'], 'clip.mp4', { type: 'video/mp4' });
        expect(validateVideoFile(file)).toBeNull();
    });

    it('rejects unsupported formats', () => {
        const file = new File(['data'], 'notes.pdf', { type: 'application/pdf' });
        expect(validateVideoFile(file)).toMatch(/Unsupported format/);
    });

    it('rejects files over 500 MB', () => {
        const file = new File(['data'], 'big.mov', { type: 'video/quicktime' });
        Object.defineProperty(file, 'size', { value: 501 * 1024 * 1024 });
        expect(validateVideoFile(file)).toMatch(/too large/);
    });
});

describe('signupSchema', () => {
    const validValues = {
        fullName: 'Asha Rao',
        email: 'asha@acme.com',
        organization: 'Acme Constructions',
        password: 'Safety123',
        confirmPassword: 'Safety123',
        acceptTerms: true,
    };

    it('accepts valid values', () => {
        expect(signupSchema.safeParse(validValues).success).toBe(true);
    });

    it('flags mismatched passwords on confirmPassword', () => {
        const result = signupSchema.safeParse({ ...validValues, confirmPassword: 'Different123' });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toEqual(['confirmPassword']);
    });
});