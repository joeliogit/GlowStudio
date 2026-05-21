import { useAuth } from './useAuth';

export function useRole() {
  const { user, isClient, isReceptionist, isAdmin, isStaff, hasRole } = useAuth();

  return {
    role: user?.role || null,
    isClient,
    isReceptionist,
    isAdmin,
    isStaff,
    hasRole,
  };
}
