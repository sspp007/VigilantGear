import { z } from 'zod';

const emailField = z
    .string()
    .trim()
    .min(1, 'Work email is required')
    .email('Enter a valid email address');

const passwordField = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number');

export const loginSchema = z.object({
    email: emailField,
    password: z.string().min(1, 'Password is required'),
    remember: z.boolean(),
});

export const signupSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(2, 'Full name must be at least 2 characters')
            .max(80, 'Full name must be 80 characters or fewer'),
        email: emailField,
        organization: z.string().trim().min(2, 'Organization name is required'),
        password: passwordField,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        acceptTerms: z.boolean().refine((value) => value === true, {
            message: 'You must accept the terms to continue',
        }),
    })
    .refine((values) => values.password === values.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });