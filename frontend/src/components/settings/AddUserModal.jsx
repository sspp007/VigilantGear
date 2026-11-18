import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Select } from '@/components/common/Select';
import { TEMPORARY_PASSWORD } from '@/lib/api/userService';
import { ROLE_OPTIONS } from '@/lib/constants/roleOptions';
import { USER_ROLES } from '@/lib/constants/roles';
import { newUserSchema } from '@/lib/validators/userSchemas';

const FORM_ID = 'add-user-form';

export function AddUserModal({ isOpen, onClose, onSubmit }) {
    const [formError, setFormError] = useState(null);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(newUserSchema),
        defaultValues: { fullName: '', email: '', role: USER_ROLES.SAFETY_MANAGER },
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setFormError(null);
        }
    }, [isOpen, reset]);

    async function submit(values) {
        setFormError(null);
        try {
            await onSubmit(values);
            onClose();
        } catch (error) {
            setFormError(error.message);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add User"
            description={`New users get the demo temporary password ${TEMPORARY_PASSWORD}.`}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form={FORM_ID} isLoading={isSubmitting}>
                        Add User
                    </Button>
                </>
            }
        >
            <form id={FORM_ID} noValidate onSubmit={handleSubmit(submit)} className="space-y-4">
                {formError && (
                    <p role="alert" className="rounded-xl bg-surface-danger px-4 py-3 text-sm font-medium text-red-700">
                        {formError}
                    </p>
                )}
                <Input
                    label="Full Name"
                    required
                    icon={User}
                    autoComplete="off"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                />
                <Input
                    label="Email"
                    required
                    icon={Mail}
                    type="email"
                    autoComplete="off"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Select
                    label="Role"
                    options={ROLE_OPTIONS}
                    value={watch('role')}
                    onChange={(role) => setValue('role', role)}
                />
            </form>
        </Modal>
    );
}