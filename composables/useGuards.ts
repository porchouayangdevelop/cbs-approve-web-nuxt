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
    const userRole = user.value?.role?.toLowerCase();

    const hasRequiredRole = roles.some(r => r.toLowerCase() === userRole);
    if (!hasRequiredRole) {
      console.warn(`User does not have required role(s): ${roles.join(', ')}`);
    }
    return hasRequiredRole;
  }

  const hasPermission = (permission: string | string []): boolean => {
    if (!user.value || !user.value.permissions) return false;

    const permissions = Array.isArray(permission) ? permission : [permission];
    const userPermissions = user.value.permissions.map(p => p.toLowerCase());

    const hasRequiredPermission = permissions.some(perm => userPermissions.includes(perm.toLowerCase()));
    if (!hasRequiredPermission) {
      console.warn(`User does not have required permission(s): ${permissions.join(', ')}`);
    }

    return hasRequiredPermission;
  }


  const canAccess = (route: string) => {

    if (!checkAuth()) return false;

    const routePermissions: Record<string, { roles?: string[], permissions?: string[] }> = {
      // Admin Routes
      '/admin': {roles: ['admin'], permissions: ['admin:access']},
      '/admin/profile': {roles: ['admin'], permissions: ['admin:access', 'profile:manage']},
      '/admin/profile/[id]': {roles: ['admin'], permissions: ['admin:access', 'profile:manage']},
      '/admin/requests/archived': {roles: ['admin'], permissions: ['admin:access', 'requests:manage']},
      '/admin/requests/categories': {roles: ['admin'], permissions: ['admin:access', 'requests:manage']},
      '/admin/access-control': {roles: ['admin'], permissions: ['admin:access', 'request:manage']},
      '/admin/audit-logs': {roles: ['admin'], permissions: ['admin:access', 'audit-logs:manage']},
      '/admin/notifications': {roles: ['admin'], permissions: ['admin:access', 'notifications:manage']},
      '/admin/roles': {roles: ['admin'], permissions: ['admin:access', 'roles:manage']},
      '/admin/permissions': {roles: ['admin'], permissions: ['admin:access', 'permissions:manage']},

      // System Administration
      '/admin/settings': {roles: ['admin'], permissions: ['admin:access', 'settings:manage']},
      '/admin/settings/general': {roles: ['admin'], permissions: ['admin:access', 'settings:manage']},
      '/admin/settings/security': {roles: ['admin'], permissions: ['admin:access', 'settings:manage']},
      '/admin/settings/integrations': {roles: ['admin'], permissions: ['admin:access', 'settings:manage']},
      '/admin/settings/backup': {roles: ['admin'], permissions: ['admin:access', 'settings:manage']},

      //
      '/admin/maintenance/backup': {roles: ['admin'], permissions: ['admin:access', 'maintenance:manage']},
      '/admin/maintenance/cache': {roles: ['admin'], permissions: ['admin:access', 'maintenance:manage']},
      '/admin/maintenance/cleanup': {roles: ['admin'], permissions: ['admin:access', 'maintenance:manage']},
      '/admin/maintenance/logs': {roles: ['admin'], permissions: ['admin:access', 'maintenance:manage']},
      '/admin/maintenance/tasks': {roles: ['admin'], permissions: ['admin:access', 'maintenance:manage']},


      '/admin/system/status': {roles: ['admin'], permissions: ['admin:access', 'system:manage']},
      '/admin/system/config': {roles: ['admin'], permissions: ['admin:access', 'system:manage']},
      '/admin/system/database': {roles: ['admin'], permissions: ['admin:access', 'system:manage']},
      '/admin/system/health': {roles: ['admin'], permissions: ['admin:access', 'system:manage']},
      '/admin/system/security': {roles: ['admin'], permissions: ['admin:access', 'system:manage']},
      '/admin/system/heath': {roles: ['admin'], permissions: ['admin:access', 'system:manage']},


      // Content & Operations
      '/admin/content/pages': {roles: ['admin'], permissions: ['admin:access', 'content:manage']},
      '/admin/content/announcements': {roles: ['admin'], permissions: ['admin:access', 'content:manage']},
      '/admin/content/help': {roles: ['admin'], permissions: ['admin:access', 'content:manage']},
      '/admin/content/files': {roles: ['admin'], permissions: ['admin:access', 'content:manage']},
      '/admin/content': {roles: ['admin'], permissions: ['admin:access', 'content:manage']},

      // Analytics & Reports
      '/admin/analytics': {roles: ['admin'], permissions: ['admin:access', 'analytics:manage']},
      '/admin/reports': {roles: ['admin'], permissions: ['admin:access', 'reports:manage']},
      '/admin/reports/approvals': {roles: ['admin'], permissions: ['admin:access', 'reports:manage']},
      '/admin/reports/user-activity': {roles: ['admin'], permissions: ['admin:access', 'reports:manage']},
      // '/admin/reports/': {roles: ['admin'], permissions: ['admin:access', 'settings:manage']},
      // '/admin/reports/': {roles: ['admin'], permissions: ['admin:access', 'settings:manage']},


      // admin -> user routes [User Management]
      '/admin/users': {roles: ['admin'], permissions: ['admin:access', 'users:manage']},
      '/admin/users/create': {roles: ['admin'], permissions: ['admin:access', 'users:manage']},
      '/admin/users/[id]': {roles: ['admin'], permissions: ['admin:access', 'users:manage']},
      '/admin/users/import': {roles: ['admin'], permissions: ['admin:access', 'users:manage']},
      '/admin/users/active': {roles: ['admin'], permissions: ['admin:access', 'users:manage']},
      '/admin/users/inactive': {roles: ['admin'], permissions: ['admin:access', 'users:manage']},
      '/admin/users/pending': {roles: ['admin'], permissions: ['admin:access', 'users:manage']},
      '/admin/users/settings': {roles: ['admin'], permissions: ['admin:access', 'users:manage']},


      // admin -> checker routes [Checker Management]
      '/admin/checkers': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},
      '/admin/checkers/create': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},
      '/admin/checkers/[id]': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},
      '/admin/checkers/active': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},
      '/admin/checkers/inactive': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},
      '/admin/checkers/analytics': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},
      '/admin/checkers/assignments': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},
      '/admin/checkers/performance': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},
      '/admin/checkers/profile': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},
      '/admin/checkers/stats': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},
      '/admin/checkers/edit/[id]': {roles: ['admin'], permissions: ['admin:access', 'checkers:manage']},

      // workflow
      '/admin/workflows/templates': {roles: ['admin'], permissions: ['admin:access', 'workflows:manage']},
      '/admin/workflows/rules': {roles: ['admin'], permissions: ['admin:access', 'workflows:manage']},
      '/admin/workflows/escalation': {roles: ['admin'], permissions: ['admin:access', 'workflows:manage']},
      '/admin/workflows/sla': {roles: ['admin'], permissions: ['admin:access', 'workflows:manage']},


      // checker routes
      '/checkers': {roles: ['admin', 'checker'], permissions: ['checker:access']},
      '/checkers/delegation': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'delegation:review', 'delegation:manage']
      },
      '/checkers/notifications': {roles: ['admin', 'checker'], permissions: ['checker:access', 'notifications:review']},
      '/checkers/schedule': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'schedule:review', 'schedule:manage']
      },
      '/checkers/settings': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'settings:review', 'settings:manage']
      },
      '/checkers/stats': {roles: ['admin', 'checker'], permissions: ['checker:access', 'stats:review']},

      // Request of checkers
      '/checkers/requests': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'requests:review', 'requests:manage']
      },
      '/checkers/requests/approved': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'requests:review', 'requests:manage']
      },
      '/checkers/requests/pending': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'requests:review', 'requests:manage']
      },
      '/checkers/requests/rejected': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'requests:review', 'requests:manage']
      },
      '/checkers/requests/review': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'requests:review', 'requests:manage']
      },

      // workflows of checker
      '/checkers/workflows': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'workflows:review', 'workflows:manage']
      },
      '/checkers/workflows/batch': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'workflows:review', 'workflows:manage']
      },
      '/checkers/workflows/priority': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'workflows:review', 'workflows:manage']
      },
      '/checkers/workflows/standard': {
        roles: ['admin', 'checker'],
        permissions: ['checker:access', 'workflows:review', 'workflows:manage']
      },

      // history of checkers
      '/checkers/history': {roles: ['admin', 'checker'], permissions: ['checker:access', 'history:review']},

      // reports of checkers
      '/checkers/reports': {roles: ['admin', 'checker'], permissions: ['checker:access', 'reports:review']},
      '/checkers/reports/workflow': {roles: ['admin', 'checker'], permissions: ['checker:access', 'reports:review']},


      // User management routes
      '/users': {roles: ['admin', 'checker', 'user'], permissions: ['users:read']},
      // '/users/create': {roles: ['admin', 'checker', 'user'], permissions: ['users:create']},
      '/users/[id]': {roles: ['admin', 'checker', 'user'], permissions: ['users:edit']},
      '/users/settings': {roles: ['admin', 'checker', 'user'], permissions: ['users:edit']},
      '/users/stats': {roles: ['admin', 'checker', 'user'], permissions: ['users:edit']},
      '/users/profile': {roles: ['admin', 'checker', 'user'], permissions: ['users:edit']},

      // requests of user
      '/users/requests': {roles: ['admin', 'checker', 'user'], permissions: ['users:read', 'users:create']},
      '/users/requests/create': {roles: ['admin', 'checker', 'user'], permissions: ['users:create']},
      '/users/requests/approved': {roles: ['admin', 'checker', 'user'], permissions: ['users:read']},
      '/users/requests/approved/[id]': {roles: ['admin', 'checker', 'user'], permissions: ['users:read']},
      '/users/requests/changes': {roles: ['admin', 'checker', 'user'], permissions: ['users:read']},
      '/users/requests/changes/[id]': {roles: ['admin', 'checker', 'user'], permissions: ['users:read']},
      '/users/requests/documents': {roles: ['admin', 'checker', 'user'], permissions: ['users:read']},
      '/users/requests/documents/[id]': {roles: ['admin', 'checker', 'user'], permissions: ['users:read']},
      '/users/requests/draft': {roles: ['admin', 'checker', 'user'], permissions: ['users:read', 'users:delete']},
      '/users/requests/draft/[id]': {roles: ['admin', 'checker', 'user'], permissions: ['users:read']},
      '/users/requests/pending': {roles: ['admin', 'checker', 'user'], permissions: ['users:']},
      '/users/requests/pending/[id]': {roles: ['admin', 'checker', 'user'], permissions: ['users:edit']},
      '/users/requests/rejected': {roles: ['admin', 'checker', 'user'], permissions: ['users:read', 'users:review']},
      '/users/requests/rejected/[id]': {roles: ['admin', 'checker', 'user'], permissions: ['users:read']},
      '/users/requests/review': {roles: ['admin', 'checker', 'user'], permissions: ['users:review']},
      '/users/requests/review/[id]': {roles: ['admin', 'checker', 'user'], permissions: ['users:read']},
      '/users/requests/update/documents': {
        roles: ['admin', 'checker', 'user'],
        permissions: ['users:review', 'users:delete']
      },
      '/users/requests/update/documents/[id]': {
        roles: ['admin', 'checker', 'user'],
        permissions: ['users:edit', 'users:read']
      },
      '/users/request/update/draft': {roles: ['admin', 'checker', 'user'], permissions: ['users:edit', 'users:delete']},
      '/users/request/update/draft/[id]': {
        roles: ['admin', 'checker', 'user'],
        permissions: ['users:edit', 'users:read']
      },

      // templates
      '/users/templates': {roles: ['admin', 'checker', 'user'], permissions: ['templates:read']},

      // General routes
      '/dashboard': {roles: ['admin', 'checker', 'user'], permissions: ['dashboard:read']},
      '/profile': {roles: ['admin', 'checker', 'user'], permissions: ['profile:read']}
    }

    const access = routePermissions[route];
    if (!access) return true; // If route not defined, allow access for authenticated users


    // Check role-based access
    if (access.roles && !hasRole(access.roles)) {
      return false; // user does not have required role
    }

    // Check permission-based access
    return !(access.permissions && !hasPermission(access.permissions));

     // user has required role or permission
  }

  // const canPerform = (action: string, resource?: string): boolean => {
  //   if (!checkAuth()) return false;
  //   const permissions = resource ? `${action}:${resource}` : action;
  //   return hasPermission(permissions);
  // }
  //
  const getAccessibleRoutes = (): string[] => {
    if (!checkAuth()) return [];

    const allRoutes: string[] = [
      '/admin',
      '/admin/users',
      '/admin/users/create',
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
      '/admin/settings': {roles: ['admin'], permissions: ['admin:access', 'settings:manage']},
      '/users': {roles: ['admin', 'Manager'], permissions: ['users:read']},
      '/users/create': {roles: ['admin', 'Manager'], permissions: ['users:create']},
      '/users/edit': {roles: ['admin', 'Manager'], permissions: ['users:edit']},
      '/checkers': {roles: ['admin', 'checker'], permissions: ['checker:access']},
      '/checkers/requests': {roles: ['admin', 'checker'], permissions: ['checker:access', 'requests:review']},
      '/dashboard': {roles: ['admin', 'checker', 'user'], permissions: ['dashboard:read']},
      '/profile': {roles: ['admin', 'checker', 'user'], permissions: ['profile:read']}
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

    const role: string = user.value?.role.toLowerCase() as string;

    switch (role) {
      case 'admin':
        return navigateTo('/admin');
      case 'checker':
        return navigateTo('/checkers');
      case 'user':
        return navigateTo('/users');
      default:
        return navigateTo('/dashboard');
    }
  }

  const handledUnauthorized = async (routePath: string) => {
    console.warn(`Unauthorized access to ${routePath}. Redirecting...`);

    if (process.client) {
      console.log('Security Event:', {
        type: 'unauthorized_access',
        route: routePath,
        userId: user.value?.id,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })
    }

    return navigateTo({
      path: '/auth/unauthorized',
      query: {
        route: routePath,
        reason: `Insufficient permissions to access ${routePath}.`
      }
    })
  }

  return {
    checkAuth,
    hasRole,
    hasPermission,
    // hasAnyPermission,
    // hasAllPermission,
    canAccess,
    // canPerform,
    getAccessibleRoutes,
    getMissingPermission,
    redirectToAllowPage,
    handledUnauthorized
  }

}
