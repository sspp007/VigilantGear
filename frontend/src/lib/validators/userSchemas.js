import { z } from 'zod';
import { USER_ROLES } from '@/lib/constants/roles';

export const newUserSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, 'Full name must be at least 2 characters')
        .max(80, 'Full name must be 80 characters or fewer'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    role: z.enum(Object.values(USER_ROLES)),
});