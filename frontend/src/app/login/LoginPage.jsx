import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart3, Cpu, Mail, ShieldCheck, Video, Webcam } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { Input } from '@/components/common/Input';
import { LogoMark } from '@/components/common/Logo';
import { AuthShell } from '@/components/forms/AuthShell';
import { ForgotPasswordModal } from '@/components/forms/ForgotPasswordModal';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { GoogleIcon, MicrosoftIcon } from '@/components/forms/ProviderIcons';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getRememberedEmail } from '@/lib/api/authService';
import { ROUTES } from '@/lib/constants/routes';
import { loginSchema } from '@/lib/validators/authSchemas';

const FEATURES = [
    { icon: Webcam, label: 'Real-Time Detection', tile: 'bg-green-500' },
    { icon: Video, label: 'Video Analysis', tile: 'bg-indigo-600' },
    { icon: BarChart3, label: 'Compliance Insights', tile: 'bg-brand' },
    { icon: ShieldCheck, label: 'Violation Tracking', tile: 'bg-pink-500' },
];

export function LoginPage() {
    useDocumentTitle('Sign In');
    const { login, loginWithProvider } = useAuth();
    const [rememberedEmail] = useState(getRememberedEmail);
    const [formError, setFormError] = useState(null);
    const [pendingProvider, setPendingProvider] = useState(null);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: rememberedEmail, password: '', remember: Boolean(rememberedEmail) },
    });

    async function onSubmit(values) {
        setFormError(null);
        try {
            await login(values);
            toast.success('Welcome back!');
        } catch (error) {
            setFormError(error.message);
        }
    }

    async function handleProvider(providerName) {
        setFormError(null);
        setPendingProvider(providerName);
        try {
            await loginWithProvider(providerName);
            toast.info(`Simulated ${providerName} sign-in as the demo Safety Manager.`);
        } catch (error) {
            setFormError(error.message);
            setPendingProvider(null);
        }
    }

    return (
        <AuthShell
            badgeIcon={Cpu}
            badgeLabel="AI-Powered PPE Monitoring"
            headingLead="Welcome to"
            leadOnOwnLine
            description="Monitor PPE compliance, detect violations and create a safer work environment with the power of AI."
            features={FEATURES}
        >
            <div className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                    <LogoMark className="h-10 w-10" />
                </span>
                <h2 className="mt-4 text-3xl font-extrabold text-ink">
                    Sign In to Vigilant<span className="text-brand">Gear</span>
                </h2>
                <p className="mt-1 text-ink-muted">Access your PPE monitoring dashboard</p>
            </div>

            <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                {formError && (
                    <p role="alert" className="rounded-xl bg-surface-danger px-4 py-3 text-sm font-medium text-red-700">
                        {formError}
                    </p>
                )}

                <Input
                    icon={Mail}
                    type="email"
                    placeholder="Work Email"
                    aria-label="Work Email"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <PasswordInput
                    placeholder="Password"
                    aria-label="Password"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...register('password')}
                />

                <div className="flex items-center justify-between gap-3">
                    <Checkbox label="Remember me" {...register('remember')} />
                    <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        className="text-sm font-bold text-brand transition hover:text-brand-dark"
                    >
                        Forgot Password?
                    </button>
                </div>

                <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                    Sign In
                </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-sm text-ink-muted">
                <span className="h-px flex-1 bg-line" />
                or continue with
                <span className="h-px flex-1 bg-line" />
            </div>

            <div className="space-y-3">
                <Button
                    variant="secondary"
                    fullWidth
                    isLoading={pendingProvider === 'Google'}
                    disabled={Boolean(pendingProvider)}
                    onClick={() => handleProvider('Google')}
                >
                    <GoogleIcon className="h-5 w-5" />
                    Continue with Google
                </Button>
                <Button
                    variant="secondary"
                    fullWidth
                    isLoading={pendingProvider === 'Microsoft'}
                    disabled={Boolean(pendingProvider)}
                    onClick={() => handleProvider('Microsoft')}
                >
                    <MicrosoftIcon className="h-5 w-5" />
                    Continue with Microsoft
                </Button>
            </div>

            <p className="mt-6 text-center text-sm font-medium text-ink">
                Don&rsquo;t have an account?{' '}
                <Link to={ROUTES.signup} className="font-bold text-brand transition hover:text-brand-dark">
                    Create Account
                </Link>
            </p>

            <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />
        </AuthShell>
    );
}
