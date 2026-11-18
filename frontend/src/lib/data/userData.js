import { USER_ROLES } from '@/lib/constants/roles';
import { USER_STATUS } from '@/lib/constants/userStatus';

export const DEMO_ACCOUNTS = Object.freeze({
    admin: { email: 'admin@vigilantgear.com', password: 'Admin@123' },
    manager: { email: 'manager@vigilantgear.com', password: 'Manager@123' },
});

export const SEED_USERS = [
    {
        id: 'user-admin',
        fullName: 'Admin',
        email: DEMO_ACCOUNTS.admin.email,
        password: DEMO_ACCOUNTS.admin.password,
        organization: 'VigilantGear Construction Ltd.',
        role: USER_ROLES.ADMIN,
        status: USER_STATUS.ACTIVE,
        createdAt: '2025-01-02T09:00:00',
    },
    {
        id: 'user-manager',
        fullName: 'Priya Sharma',
        email: DEMO_ACCOUNTS.manager.email,
        password: DEMO_ACCOUNTS.manager.password,
        organization: 'VigilantGear Construction Ltd.',
        role: USER_ROLES.SAFETY_MANAGER,
        status: USER_STATUS.ACTIVE,
        createdAt: '2025-01-05T11:30:00',
    },
    {
        id: 'user-manager-2',
        fullName: 'Rahul Verma',
        email: 'rahul.verma@vigilantgear.com',
        password: 'Manager@123',
        organization: 'VigilantGear Construction Ltd.',
        role: USER_ROLES.SAFETY_MANAGER,
        status: USER_STATUS.DISABLED,
        createdAt: '2025-01-09T14:15:00',
    },
];