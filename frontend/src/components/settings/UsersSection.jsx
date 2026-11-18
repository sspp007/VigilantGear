import { Trash2, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/ErrorState';
import { IconButton } from '@/components/common/IconButton';
import { Select } from '@/components/common/Select';
import { AddUserModal } from '@/components/settings/AddUserModal';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAuth } from '@/hooks/useAuth';
import { createUser, fetchUsers, removeUser, updateUserAccess } from '@/lib/api/userService';
import { ROLE_OPTIONS } from '@/lib/constants/roleOptions';
import { ROLE_LABELS } from '@/lib/constants/roles';
import { USER_STATUS, USER_STATUS_META } from '@/lib/constants/userStatus';
import { formatDate } from '@/lib/utils/format';

const EMPTY_USERS = [];

export function UsersSection() {
    const { user: currentUser, isAdmin } = useAuth();
    const { data, isLoading, error, reload } = useAsyncData(fetchUsers, []);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null);

    async function runAction(action, successMessage) {
        try {
            await action();
            toast.success(successMessage);
            reload();
        } catch (actionError) {
            toast.error(actionError.message);
        }
    }

    function canManage(row) {
        return isAdmin && row.id !== currentUser.id;
    }

    function changeAccess(row, changes, successMessage) {
        return runAction(() => updateUserAccess({ actorId: currentUser.id, userId: row.id, changes }), successMessage);
    }

    async function handleCreate(values) {
        await createUser({ actorId: currentUser.id, ...values });
        toast.success(`${values.fullName} was added.`);
        reload();
    }

    async function handleConfirmRemove() {
        const target = userToRemove;
        setUserToRemove(null);
        await runAction(() => removeUser({ actorId: currentUser.id, userId: target.id }), `${target.fullName} was removed.`);
    }

    const columns = [
        {
            key: 'name',
            header: 'Name',
            cell: (row) => (
                <span className="flex items-center gap-2 font-semibold">
                    {row.fullName}
                    {row.id === currentUser.id && <Badge className="bg-slate-100 text-slate-600">You</Badge>}
                </span>
            ),
        },
        { key: 'email', header: 'Email', cell: (row) => row.email },
        {
            key: 'role',
            header: 'Role',
            cell: (row) =>
                canManage(row) ? (
                    <Select
                        aria-label={`Role for ${row.fullName}`}
                        options={ROLE_OPTIONS}
                        value={row.role}
                        onChange={(role) => changeAccess(row, { role }, `${row.fullName} is now ${ROLE_LABELS[role]}.`)}
                        className="w-44"
                        selectClassName="h-9 text-sm"
                    />
                ) : (
                    <Badge className="bg-orange-100 text-brand-dark">{ROLE_LABELS[row.role]}</Badge>
                ),
        },
        {
            key: 'status',
            header: 'Status',
            cell: (row) => <Badge className={USER_STATUS_META[row.status].badge}>{USER_STATUS_META[row.status].label}</Badge>,
        },
        { key: 'createdAt', header: 'Created', cell: (row) => formatDate(row.createdAt) },
    ];

    if (isAdmin) {
        columns.push({
            key: 'actions',
            header: 'Actions',
            cell: (row) => {
                if (!canManage(row)) return '—';

                const isActive = row.status === USER_STATUS.ACTIVE;
                const nextStatus = isActive ? USER_STATUS.DISABLED : USER_STATUS.ACTIVE;
                const actionLabel = isActive ? 'Disable' : 'Enable';

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            aria-label={`${actionLabel} ${row.fullName}`}
                            onClick={() =>
                                changeAccess(row, { status: nextStatus }, `${row.fullName} was ${isActive ? 'disabled' : 'enabled'}.`)
                            }
                        >
                            {actionLabel}
                        </Button>
                        <IconButton
                            icon={Trash2}
                            label={`Remove ${row.fullName}`}
                            size="sm"
                            onClick={() => setUserToRemove(row)}
                        />
                    </div>
                );
            },
        });
    }

    return (
        <SettingsSection icon={Users} title="Users & Roles" description="Manage who can access VigilantGear">
            {isAdmin ? (
                <div className="flex justify-end">
                    <Button icon={UserPlus} onClick={() => setIsAddOpen(true)}>
                        Add User
                    </Button>
                </div>
            ) : (
                <p className="rounded-xl bg-surface-info px-4 py-3 text-sm font-medium text-blue-900">
                    Only administrators can add users or change roles and account status.
                </p>
            )}

            <Card padded={false}>
                {error ? (
                    <ErrorState message={error.message} onRetry={reload} />
                ) : (
                    <DataTable
                        columns={columns}
                        rows={data ?? EMPTY_USERS}
                        isLoading={isLoading}
                        caption="Users and roles"
                        minWidth="min-w-[760px]"
                    />
                )}
            </Card>

            <AddUserModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={handleCreate} />
            <ConfirmDialog
                isOpen={Boolean(userToRemove)}
                onClose={() => setUserToRemove(null)}
                onConfirm={handleConfirmRemove}
                title={userToRemove ? `Remove ${userToRemove.fullName}?` : ''}
                description="This account will no longer be able to sign in."
                confirmLabel="Remove"
                tone="danger"
            />
        </SettingsSection>
    );
}