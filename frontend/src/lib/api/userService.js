import { loadUsers, saveUsers, toPublicUser } from '@/lib/api/userRepository';
import { USER_ROLES } from '@/lib/constants/roles';
import { USER_STATUS } from '@/lib/constants/userStatus';
import { wait } from '@/lib/utils/delay';

const TEMPORARY_PASSWORD = 'Welcome@123';
const ACCESS_FIELDS = ['role', 'status'];

function requireAdmin(users, actorId) {
  const actor = users.find((candidate) => candidate.id === actorId);
  if (!actor || actor.role !== USER_ROLES.ADMIN) {
    throw new Error('Only administrators can manage users.');
  }
  return actor;
}

function requireOtherUser(users, actorId, userId) {
  if (actorId === userId) {
    throw new Error('You cannot change your own account here.');
  }
  const target = users.find((candidate) => candidate.id === userId);
  if (!target) {
    throw new Error('User not found.');
  }
  return target;
}

function pickAccessFields(changes) {
  return Object.fromEntries(
    ACCESS_FIELDS.filter((field) => changes[field] !== undefined).map((field) => [field, changes[field]]),
  );
}

export async function fetchUsers() {
  await wait();
  return loadUsers().map(toPublicUser);
}

export async function updateUserAccess({ actorId, userId, changes }) {
  await wait(200);
  const users = loadUsers();
  requireAdmin(users, actorId);
  requireOtherUser(users, actorId, userId);

  const updated = users.map((user) => (user.id === userId ? { ...user, ...pickAccessFields(changes) } : user));
  saveUsers(updated);
  return updated.map(toPublicUser);
}

export async function createUser({ actorId, fullName, email, role }) {
  await wait(200);
  const users = loadUsers();
  const actor = requireAdmin(users, actorId);
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((candidate) => candidate.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: `user-${Date.now()}`,
    fullName: fullName.trim(),
    email: normalizedEmail,
    organization: actor.organization,
    password: TEMPORARY_PASSWORD,
    role,
    status: USER_STATUS.ACTIVE,
    createdAt: new Date().toISOString(),
  };

  const updated = [...users, user];
  saveUsers(updated);
  return updated.map(toPublicUser);
}

export async function removeUser({ actorId, userId }) {
  await wait(200);
  const users = loadUsers();
  requireAdmin(users, actorId);
  requireOtherUser(users, actorId, userId);

  const updated = users.filter((user) => user.id !== userId);
  saveUsers(updated);
  return updated.map(toPublicUser);
}