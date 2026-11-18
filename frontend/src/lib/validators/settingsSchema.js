import { z } from 'zod';
import { CONFIDENCE_LIMITS } from '@/lib/constants/settings';

export const settingsSchema = z.object({
    general: z.object({
        organizationName: z.string().trim().min(1, 'Organization name is required'),
        siteLocation: z.string().trim().max(120, 'Site / location must be 120 characters or fewer'),
        timeZone: z.string().min(1, 'Time zone is required'),
        contactEmail: z.string().trim().email('Enter a valid email address'),
    }),
    ppe: z
        .object({
            helmet: z.boolean(),
            safety_vest: z.boolean(),
            goggles: z.boolean(),
            gloves: z.boolean(),
        })
        .refine((values) => Object.values(values).some(Boolean), {
            message: 'Enable at least one PPE type to detect',
        }),
    detection: z.object({
        confidenceThreshold: z.number().min(CONFIDENCE_LIMITS.min).max(CONFIDENCE_LIMITS.max),
        frameSamplingInterval: z.number().positive(),
    }),
});

export function getSettingsErrors(settings) {
    const result = settingsSchema.safeParse(settings);
    if (result.success) return {};

    const errors = {};
    for (const issue of result.error.issues) {
        const key = issue.path.join('.');
        if (!(key in errors)) errors[key] = issue.message;
    }
    return errors;
}