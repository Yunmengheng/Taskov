import { UserRole, RolePermissions } from '@/types/user';

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  [UserRole.ADMIN]: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canViewAll: true,
    canManageUsers: true,
  },
  [UserRole.USER]: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canViewAll: false,
    canManageUsers: false,
  },
  [UserRole.VIEWER]: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canViewAll: false,
    canManageUsers: false,
  },
};

export const hasPermission = (userRole: UserRole, permission: keyof RolePermissions): boolean => {
  return ROLE_PERMISSIONS[userRole][permission];
};

export const canUserAccessTask = (userRole: UserRole, taskUserId: string, currentUserId: string): boolean => {
  if (userRole === UserRole.ADMIN) return true;
  return taskUserId === currentUserId;
};