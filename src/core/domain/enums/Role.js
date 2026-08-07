// Role enum — single source of truth for user roles.
export const Role = Object.freeze({
  ADMIN: 'ADMIN',
  COMMERCIAL: 'COMMERCIAL',
});

export const ROLE_VALUES = Object.values(Role);

export function isRole(value) {
  return ROLE_VALUES.includes(value);
}

export const ROLE_LABELS = {
  [Role.ADMIN]: 'Administrateur',
  [Role.COMMERCIAL]: 'Commercial',
};