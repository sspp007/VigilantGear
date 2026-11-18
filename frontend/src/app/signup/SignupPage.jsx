import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart3, Building2, Camera, Mail, ShieldCheck, User, UserPlus, Video } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { Input } from '@/components/common/Input';
import { AuthShell } from '@/components/forms/AuthShell';
import { LegalModal } from '@/components/forms/LegalModal';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { IMAGES } from '@/lib/constants/images';
import { ROUTES } from '@/lib/constants/routes';
import { signupSchema } from '@/lib/validators/authSchemas';

const FEATURES = [
    { icon: Camera, label: 'Real-time PPE Detection', tile: 'bg-indigo-700' },
    { icon: Video, label: 'Video Analysis & Reports', tile: 'bg-orange-700' },
    { icon: BarChart3, label: 'Compliance Insights', tile: 'bg-green-600' },
    { icon: ShieldCheck, label: 'Violation Tracking', tile: 'bg-pink-500' },
];

const LINK_BUTTON_CLASS = 'font-bold text-brand transition hover:text-brand-dark';

export function SignupPage() {
    useDocumentTitle('Create Account');
    const { signup } = useAuth();
    const [formError, setFormError] = useState(null);
    const [legalDocumentId, setLegalDocumentId] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: '',
            email: '',
            organization: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
    });

    async function onSubmit(values) {
        setFormError(null);
        try {
            await signup(values);
            toast.success('Account created. Welcome to VigilantGear!');
        } catch (error) {
            setFormError(error.message);
        }
    }

    return (
        <AuthShell
            image={IMAGES.signupWorker}
            badgeIcon={UserPlus}
            badgeLabel="Create Your Account"
            headingLead="Join"
            description="Get started with AI-powered PPE compliance monitoring and make your workplace safer."
            features={FEATURES}
        >
            <h2 className="text-3xl font-extrabold text-ink">Create an Account</h2>
            <p className="mt-1 text-sm text-ink-muted">Join VigilantGear and start monitoring PPE compliance.</p>

            <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                {formError && (
                    <p role="alert" className="rounded-xl bg-surface-danger px-4 py-3 text-sm font-medium text-red-700">
                        {formError}
                    </p>
                )}

                <Input
                    label="Full Name"
                    required
                    icon={User}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                />
                <Input
                    label="Work Email"
                    required
                    icon={Mail}
                    type="email"
                    placeholder="Enter your work email"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Input
                    label="Organization Name"
                    required
                    icon={Building2}
                    placeholder="Enter your organization name"
                    autoComplete="organization"
                    error={errors.organization?.message}
                    {...register('organization')}
                />
                <PasswordInput
                    label="Password"
                    required
                    placeholder="Create a password"
                    autoComplete="new-password"
                    error={errors.password?.message}
                    hint="At least 8 characters with an uppercase letter and a number."
                    {...register('password')}
                />
                <PasswordInput
                    label="Confirm Password"
                    required
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                <div>
                    <Checkbox label="I agree to the" error={errors.acceptTerms?.message} {...register('acceptTerms')} />
                    <p className="mt-1 pl-7 text-sm text-ink">
                        <button type="button" className={LINK_BUTTON_CLASS} onClick={() => setLegalDocumentId('terms')}>
                            Terms of Service
                        </button>{' '}
                        and{' '}
                        <button type="button" className={LINK_BUTTON_CLASS} onClick={() => setLegalDocumentId('privacy')}>
                            Privacy Policy
                        </button>
                        .
                    </p>
                </div>

                <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                    Create Account
                </Button>
                <p className="text-center text-xs text-ink-muted">
                    New accounts are created with the Safety Manager role. Admin accounts are created separately.
                </p>
            </form>

            <p className="mt-5 text-center text-sm font-medium text-ink">
                Already have an account?{' '}
                <Link to={ROUTES.login} className={LINK_BUTTON_CLASS}>
                    Sign In
                </Link>
            </p>

            <LegalModal documentId={legalDocumentId} onClose={() => setLegalDocumentId(null)} />
        </AuthShell>
    );
}