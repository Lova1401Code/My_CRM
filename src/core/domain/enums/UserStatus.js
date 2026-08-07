// User account status enum.
export const UserStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
});

export const USER_STATUS_VALUES = Object.values(UserStatus);

export function isUserStatus(value) {
  return USER_STATUS_VALUES.includes(value);
}

export const USER_STATUS_LABELS = {
  [UserStatus.ACTIVE]: 'Actif',
  [UserStatus.DISABLED]: 'Désactivé',
};

export const USER_STATUS_STYLES = {
  [UserStatus.ACTIVE]: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  [UserStatus.DISABLED]: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};