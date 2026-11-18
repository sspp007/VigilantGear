import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { requestPasswordReset } from '@/lib/api/authService';
import { loginSchema } from '@/lib/validators/authSchemas';

const forgotPasswordSchema = loginSchema.pick({ email: true });
const FORM_ID = 'forgot-password-form';

export function ForgotPasswordModal({ isOpen, onClose }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } });

    useEffect(() => {
        if (!isOpen) reset();
    }, [isOpen, reset]);

    async function onSubmit() {
        await requestPasswordReset();
        toast.info('Demo mode: no email was sent. Use the demo accounts on the sign-in page.');
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Reset your password"
            description="Enter your work email. In this demo no reset email is actually sent."
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form={FORM_ID} isLoading={isSubmitting}>
                        Send reset link
                    </Button>
                </>
            }
        >
            <form id={FORM_ID} noValidate onSubmit={handleSubmit(onSubmit)}>
                <Input
                    icon={Mail}
                    type="email"
                    placeholder="Work Email"
                    aria-label="Work Email"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                />
            </form>
        </Modal>
    );
}