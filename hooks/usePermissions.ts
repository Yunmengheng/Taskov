import { UserRole, RolePermissions } from '@/types/user';
import { hasPermission, ROLE_PERMISSIONS } from '@/lib/permissions';
import { useAuth } from '@/contexts/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = (user?.role as UserRole) || UserRole.VIEWER;

  return {
    userRole,
    permissions: ROLE_PERMISSIONS[userRole],
    hasPermission: (permission: keyof RolePermissions) => hasPermission(userRole, permission),
    isAdmin: userRole === UserRole.ADMIN,
    isUser: userRole === UserRole.USER,
    isViewer: userRole === UserRole.VIEWER,
  };
};