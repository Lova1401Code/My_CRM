// User entity factory. Enforces domain invariants.
import { Role } from '../enums/Role.js';
import { UserStatus } from '../enums/UserStatus.js';

export function createUser({
  id,
  firstname,
  lastname,
  email,
  phone = '',
  role = Role.COMMERCIAL,
  status = UserStatus.ACTIVE,
  password = null,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  return Object.freeze({
    id,
    firstname,
    lastname,
    email,
    phone,
    role,
    status,
    password,
    createdAt,
    updatedAt,
  });
}

// Public projection: never expose password to the outside world.
export function toPublicUser(user) {
  const { password, ...rest } = user;
  return rest;
}