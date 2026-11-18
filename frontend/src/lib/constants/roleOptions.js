import { ROLE_LABELS } from '@/lib/constants/roles';

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));