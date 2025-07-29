
import type { PermissionAction, Permission, PermissionResource, UserPermissions, RouteAccess } from '~/types/permission.client'
export const usePermissionSystem = () => {
  const { user, isAuthenticated } = useAuth();
  const { decodeToken, isTokenExpired } = useJWTDecoder();
  const { currentUserRole, getUserProfile } = useCheckAuth();

  const permissionMatrix = computed((): Record<string, Permission[]> => {
    return {
      'admin': [
        'admin:access',
        'users:create', 'users:read', 'users:edit', 'users:delete', 'users:manage',
        'settings:manage', 'settings:read', 'settings:edit',
        'approval:access', 'approval:approve', 'approval:reject', 'approval:delegate', 'approval:manage',
        'dashboard:read',
        'profile:read', 'profile:edit', 'profile:manage',
        'reports:read', 'reports:create', 'reports:manage',
        'system:manage',
        'audit:read',
        'roles:manage',
        'permissions:manage',
        'workflows:manage',
        'notifications:manage',
        'content:manage',
        'analytics:read',
        'checkers:manage'
      ] as Permission[],
      'checker': [
        'checker:access',
        'approval:access', 'approval:approve',
        'approval:reject', 'approval:delegate',
        'requests:review', 'requests:read', 'requests:manage',
        'dashboard:read',
        'profile:read',
        'profile:edit',
        'workflows:review', 'workflows:manage', 'stats:review',
        'reports:review',
        'notifications:review',
        'history:review',
        'schedule:review', 'schedule:manage', 'settings:review',
        'settings:manage'
      ] as Permission[],
      'user': [
        'users:read', 'users:create', 'dashboard:read',
        'profile:read', 'profile:edit', 'requests:create',
        'requests:read', 'requests:edit', 'requests:delete',
        'templates:read',
        'notifications:read',
        'history:read',
        'stats:read',
        'bulk:manage'
      ] as Permission[],
    }
  });

  const routePermissions = computed((): Record<string, RouteAccess> => {
    return {
      // Admin Routes
      '/admin': { roles: ['admin'], permissions: ['admin:access'] },
      '/admin/users': { roles: ['admin'], permissions: ['admin:access', 'users:manage'] },
      '/admin/users/create': { roles: ['admin'], permissions: ['admin:access', 'users:create'] },
      '/admin/users/[id]': { roles: ['admin'], permissions: ['admin:access', 'users:edit'] },
      '/admin/settings': { roles: ['admin'], permissions: ['admin:access', 'settings:manage'] },
      '/admin/analytics': { roles: ['admin'], permissions: ['admin:access', 'analytics:read'] },
      '/admin/reports': { roles: ['admin'], permissions: ['admin:access', 'reports:manage'] },
      '/admin/roles': { roles: ['admin'], permissions: ['admin:access', 'roles:manage'] },
      '/admin/permissions': { roles: ['admin'], permissions: ['admin:access', 'permissions:manage'] },
      '/admin/checkers': { roles: ['admin'], permissions: ['admin:access', 'checkers:manage'] },
      '/admin/system': { roles: ['admin'], permissions: ['admin:access', 'system:manage'] },
      '/admin/audit-logs': { roles: ['admin'], permissions: ['admin:access', 'audit:read'] },

      // Checker Routes
      '/checkers': { roles: ['admin', 'checker'], permissions: ['checker:access'] },
      '/checkers/requests': { roles: ['admin', 'checker'], permissions: ['checker:access', 'requests:review'] },
      '/checkers/requests/pending': { roles: ['admin', 'checker'], permissions: ['checker:access', 'requests:review'] },
      '/checkers/requests/review': { roles: ['admin', 'checker'], permissions: ['checker:access', 'requests:review'] },
      '/checkers/requests/approved': { roles: ['admin', 'checker'], permissions: ['checker:access', 'requests:read'] },
      '/checkers/requests/rejected': { roles: ['admin', 'checker'], permissions: ['checker:access', 'requests:read'] },
      '/checkers/stats': { roles: ['admin', 'checker'], permissions: ['checker:access', 'stats:review'] },
      '/checkers/workflows': { roles: ['admin', 'checker'], permissions: ['checker:access', 'workflows:review'] },
      '/checkers/delegation': { roles: ['admin', 'checker'], permissions: ['checker:access', 'delegation:review'] },
      '/checkers/schedule': { roles: ['admin', 'checker'], permissions: ['checker:access', 'schedule:review'] },
      '/checkers/settings': { roles: ['admin', 'checker'], permissions: ['checker:access', 'settings:review'] },
      '/checkers/notifications': { roles: ['admin', 'checker'], permissions: ['checker:access', 'notifications:review'] },
      '/checkers/history': { roles: ['admin', 'checker'], permissions: ['checker:access', 'history:review'] },
      '/checkers/reports': { roles: ['admin', 'checker'], permissions: ['checker:access', 'reports:review'] },

      // User Routes
      '/users': { roles: ['admin', 'checker', 'user'], permissions: ['users:read'] },
      '/users/requests': { roles: ['admin', 'checker', 'user'], permissions: ['users:read', 'requests:read'] },
      '/users/requests/create': { roles: ['admin', 'checker', 'user'], permissions: ['requests:create'] },
      '/users/requests/draft': { roles: ['admin', 'checker', 'user'], permissions: ['requests:read'] },
      '/users/requests/pending': { roles: ['admin', 'checker', 'user'], permissions: ['requests:read'] },
      '/users/requests/approved': { roles: ['admin', 'checker', 'user'], permissions: ['requests:read'] },
      '/users/requests/rejected': { roles: ['admin', 'checker', 'user'], permissions: ['requests:read'] },
      '/users/templates': { roles: ['admin', 'checker', 'user'], permissions: ['templates:read'] },
      '/users/profile': { roles: ['admin', 'checker', 'user'], permissions: ['profile:read'] },
      '/users/settings': { roles: ['admin', 'checker', 'user'], permissions: ['profile:edit'] },

      // Common Routes
      '/dashboard': { roles: ['admin', 'checker', 'user'], permissions: ['dashboard:read'] },
      '/profile': { roles: ['admin', 'checker', 'user'], permissions: ['profile:read'] }

    }
  });

  const getCurrentRole = (): string | null => {
    if (user.value?.role) {
      return user.value?.role?.toLocaleLowerCase();
    }

    const token = useCookie("access_token").value;
    if (!token || isTokenExpired(token)) {
      return null;
    }
    return currentUserRole()?.toLocaleLowerCase() || null;
  }

  const getUserPermissions = computed((): Permission[] => {
    const role = getCurrentRole();
    if (!role) return [];

    const rolePermissions = permissionMatrix.value[role] || [];

    const token = useCookie("access_token").value;
    if (token && isTokenExpired(token)) {
      const decode = decodeToken(token);
      const tokenPermissions = decode?.realm_access?.roles || [];

      const additionalPermissions: Permission[] = tokenPermissions.filter(role => role !== 'default-roles-apb_teller')
        .map(role => `${role}:access` as Permission);

      return [...new Set([...rolePermissions, ...additionalPermissions])];
    }

    return rolePermissions;

  });

  const hasRole = (roles: string | string[]): boolean => {
    const userRole = getCurrentRole();
    if (!userRole) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.some(role => role.toLocaleLowerCase() === userRole);
  }

  const hasPermission = (permission: Permission | Permission[]): boolean => {
    const userPermissions = getUserPermissions.value;
    const permissionArray = Array.isArray(permission) ? permission : [permission];
    return permissionArray.some(permission => userPermissions.includes(permission));
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    const userPermissions = getUserPermissions.value
    return permissions.every(permission =>
      userPermissions.includes(permission)
    )
  }

  /**
   * Check if user can perform action on resource
   */
  const canPerform = (action: PermissionAction, resource: PermissionResource): boolean => {
    const permission: Permission = `${resource}:${action}`
    return hasPermission(permission)
  }

  /**
   * Check if user is authenticated
   */
  const checkAuth = (): boolean => {
    return isAuthenticated.value && !!user.value
  }

  /**
   * Check if user can access specific route
   */
  const canAccessRoute = (routePath: string): boolean => {
    if (!checkAuth()) return false

    const access = routePermissions.value[routePath]
    if (!access) return true // If no specific access defined, allow for authenticated users

    // Check role-based access
    if (access.roles && !hasRole(access.roles)) {
      return false
    }

    // Check permission-based access
    if (access.permissions) {
      if (access.requireAll) {
        return hasAllPermissions(access.permissions)
      } else {
        return hasPermission(access.permissions)
      }
    }

    return true
  }

  /**
  * Get default route for user's role
  */
  const getDefaultRoute = (): string => {
    const role = getCurrentRole()

    const defaultRoutes: Record<string, string> = {
      'admin': '/admin',
      'checker': '/checkers',
      'user': '/users'
    }

    return defaultRoutes[role || ''] || '/auth/login'
  }

  /**
   * Get permissions by category/resource
   */
  const getPermissionsByResource = (resource: PermissionResource): Permission[] => {
    const userPermissions = getUserPermissions.value
    return userPermissions.filter(permission =>
      permission.startsWith(`${resource}:`)
    )
  }


  /**
  * Get available actions for a resource
  */
  const getAvailableActions = (resource: PermissionResource): PermissionAction[] => {
    const resourcePermissions = getPermissionsByResource(resource)
    return resourcePermissions.map(permission =>
      permission.split(':')[1] as PermissionAction
    )
  }

  /**
  * Get missing permissions for route access
  */
  const getMissingPermissions = (routePath: string): { roles: string[], permissions: Permission[] } => {
    const access = routePermissions.value[routePath]
    if (!access) return { roles: [], permissions: [] }

    const missingRoles = access.roles ? access.roles.filter(role => !hasRole(role)) : []
    const missingPermissions = access.permissions ? access.permissions.filter(permission => !hasPermission(permission)) : []

    return { roles: missingRoles, permissions: missingPermissions }
  }

  /**
 * Get user permission summary for debugging
 */
  const getPermissionSummary = () => {
    return {
      role: getCurrentRole(),
      permissions: getUserPermissions.value,
      permissionCount: getUserPermissions.value.length,
      isAuthenticated: checkAuth()
    }
  }

  /**
     * Navigate to appropriate default route based on role
     */
  const navigateToDefaultRoute = async () => {
    const route = getDefaultRoute()
    await navigateTo(route)
  }


  return {
    // Core state
    permissionMatrix: readonly(permissionMatrix),
    routePermissions: readonly(routePermissions),
    getUserPermissions: readonly(getUserPermissions),

    // Authentication
    checkAuth,
    getCurrentRole,

    // Role checking  
    hasRole,

    // Permission checking
    hasPermission,
    hasAllPermissions,
    canPerform,

    // Route access
    canAccessRoute,
    getDefaultRoute,
    getMissingPermissions,

    // Utilities
    getPermissionsByResource,
    getAvailableActions,
    getPermissionSummary,
    navigateToDefaultRoute
  }
}
