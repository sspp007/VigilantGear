import { downloadBlob } from '@/lib/utils/download';

function escapeCell(value) {
    const text = value === null || value === undefined ? '' : String(value);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(columns, rows) {
    const header = columns.map((column) => escapeCell(column.header)).join(',');
    const lines = rows.map((row) => columns.map((column) => escapeCell(column.accessor(row))).join(','));
    return [header, ...lines].join('\r\n');
}

export function downloadCsv(filename, columns, rows) {
    const blob = new Blob([`\uFEFF${toCsv(columns, rows)}`], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(filename, blob);
}