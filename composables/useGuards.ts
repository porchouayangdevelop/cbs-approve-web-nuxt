import {useUserStore} from "~/store/userStore";

interface RoutePermissions {
  [route: string]: string[];
}

interface RouteAccess {
  roles?: string[]
  permissions?: string[]
  requireAll?: boolean // If true, user must have ALL permissions, not just any
}

interface MissingAccess {
  roles: string[]
  permissions: string[]
}

export const useGuards = () => {
  const {user, isAuthenticated} = useAuth();

  const checkAuth = (): boolean => {
    return isAuthenticated.value && !!user.value;
  }


  const hasRole = (role: string | string[]): boolean => {
    if (!user.value) return false;

    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.value?.role);
  }

  const hasPermission = (permission: string | string []): boolean => {
    if (!user.value || !user.value.permissions) return false;

    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.some(perm => user.value?.permissions.includes(perm));
  }

  const hasAnyPermission = (permission: string[]): boolean => {
    if (!user.value || !user.value.permissions) return false;

    return permission.some(perm => user.value?.permissions.includes(perm));
  }

  const hasAllPermission = (permission: string[]): boolean => {
    if (!user.value || !user.value.permissions) return false;

    return permission.every(perm => user.value?.permissions.includes(perm));
  }

  const canAccess = (route: string) => {

    if (!checkAuth()) return false;

    const routePermissions: Record<string, RouteAccess> = {
      '/admin': {
        roles: ['admin'],
        permissions: ['admin:access']
      },
      '/admin/users': {
        roles: ['Admin'],
        permissions: ['admin:access', 'users:manage']
      },
      '/admin/settings': {
        roles: ['Admin'],
        permissions: ['admin:access', 'settings:manage']
      },

      // User management routes
      '/users': {
        roles: ['Admin', 'Manager'],
        permissions: ['users:read']
      },
      '/users/create': {
        roles: ['Admin', 'Manager'],
        permissions: ['users:create']
      },
      '/users/edit': {
        roles: ['Admin', 'Manager'],
        permissions: ['users:edit']
      },


      // Approval routes
      '/checkers': {
        roles: ['Admin', 'Checker'],
        permissions: ['checker:access']
      },
      '/checkers/requests': {
        roles: ['Admin', 'Checker'],
        permissions: ['checker:access', 'requests:review']
      },

      // General routes
      '/dashboard': {
        roles: ['Admin', 'Checker', 'User'],
        permissions: ['dashboard:read']
      },
      '/profile': {
        roles: ['Admin', 'Checker', 'User'],
        permissions: ['profile:read']
      }
    }

    const access = routePermissions[route];
    if (!access) {
      return true; // If route not defined, allow access for authenticated users
    }

    // Check role-based access
    if (access.roles && !hasRole(access.roles)) {
      return false; // User does not have required role
    }

    // Check permission-based access
    if (access.permissions && !hasAnyPermission(access.permissions)) {
      return false
    }

    return true; // User has required role or permission
  }

  const canPerform = (action: string, resource?: string): boolean => {
    if (!checkAuth()) return false;
    const permissions = resource ? `${action}:${resource}` : action;
    return hasPermission(permissions);
  }

  const getAccessibleRoutes = (): string[] => {
    if (!checkAuth()) return [];

    const allRoutes: string[] = [
      '/admin',
      '/admin/users',
      '/admin/settings',
      '/users',
      '/users/create',
      '/users/edit',
      '/checkers',
      '/checkers/requests',
      '/dashboard',
      '/profile'
    ]

    return allRoutes.filter(route => canAccess(route));
  }

  const getMissingPermission = (routePath: string): MissingAccess => {
    const routePermissions: Record<string, RouteAccess> = {
      '/admin': {roles: ['admin'], permissions: ['admin:access']},
      '/admin/users': {roles: ['admin'], permissions: ['admin:access', 'users:manage']},
      '/admin/settings': {roles: ['Admin'], permissions: ['admin:access', 'settings:manage']},
      '/users': {roles: ['admin', 'Manager'], permissions: ['users:read']},
      '/users/create': {roles: ['admin', 'Manager'], permissions: ['users:create']},
      '/users/edit': {roles: ['admin', 'Manager'], permissions: ['users:edit']},
      '/checkers': {roles: ['admin', 'Checker'], permissions: ['checker:access']},
      '/checkers/requests': {roles: ['admin', 'Checker'], permissions: ['checker:access', 'requests:review']},
      '/dashboard': {roles: ['admin', 'Checker', 'User'], permissions: ['dashboard:read']},
      '/profile': {roles: ['admin', 'Checker', 'User'], permissions: ['profile:read']}
    }

    const access = routePermissions[routePath];
    if (!access) return {roles: [], permissions: []}; // No specific access defined for this route

    const missingRoles = access.roles ? access.roles.filter(role => !hasRole(role)) : [];

    const missingPermissions = access.permissions ? access.permissions.filter(permission => !hasPermission(permission)) : [];
    return {
      roles: missingRoles,
      permissions: missingPermissions
    }

  }

  const redirectToAllowPage = async () => {
    if (!checkAuth()) {
      return navigateTo('/auth/login')
    }

    const role = user.value?.role || '';

    switch (role) {
      case 'admin':
        return navigateTo('/admin');
      case 'Checker':
        return navigateTo('/checkers');
      case 'User':
        return navigateTo('/users');
      default:
        return navigateTo('/dashboard');
    }
  }

  const handledUnauthorized = async (routePath: string) => {
    console.warn(`Unauthorized access to ${routePath}. Redirecting...`);
    // Log the attempt (in real app, send to analytics/security system)
    // await $fetch('/api/security/log-unauthorized-access', {
    //   method: 'POST',
    //   body: {
    //     route,
    //     userId: user.value?.id,
    //     timestamp: new Date().toISOString(),
    //     userAgent: navigator.userAgent
    //   }
    // })

    return navigateTo({
      path: '/auth/unauthorized',
      query: {
        routePath,
        reason: `Insufficient permissions to access ${routePath}.`
      }
    })
  }

  return {
    checkAuth,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermission,
    canAccess,
    canPerform,
    getAccessibleRoutes,
    getMissingPermission,
    redirectToAllowPage,
    handledUnauthorized
  }

}
