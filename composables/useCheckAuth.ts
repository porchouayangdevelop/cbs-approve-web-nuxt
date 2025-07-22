interface CheckAuth {
  role: string;
}

export const useCheckAuth = () => {
  const { decodeToken, isTokenExpired } = useJWTDecoder();

  const checkRole = computed(() => {
    const token = useCookie('access_token').value;

    if (!token || isTokenExpired(token)) {
      console.log('Token is invalid or expired');
      return null;
    }
    return decodeToken(token)
  });

  const currentUserRole = (): string | null => {
    const payload = checkRole.value;
    if (!payload?.realm_access?.roles) {
      return null;
    }

    const rolePriority = ['admin', 'checker', 'user'];
    const userRoles = payload.realm_access.roles.map(role => role.toLowerCase());

    for (const role of rolePriority) {
      if (userRoles.includes(role)) {
        return role;
      }
    }

    const roleMapping: Record<string, string> = {
      'admin': 'admin',
      'checker': 'checker',
      'user': 'user'
    }

    for (const role of userRoles) {
      if (userRoles.includes(roleMapping[role])) {
        return roleMapping[role];
      }
    }

    // If no priority role found, return the first role
    return userRoles.length > 0 ? userRoles[0] : null;
  }

  const getUserPermissions = (): string[] => {

    const payload = checkRole.value;

    if (!payload) {
      return [];
    }

    const currentRole = currentUserRole();
    if (!currentRole) {
      return [];
    }

    const permissionMatrix: Record<string, string[]> = {
      'admin': [
        'admin:access',
        'users:create',
        'users:read',
        'users:edit',
        'users:delete',
        'users:manage',
        'settings:manage',
        'settings:read',
        'settings:edit',
        'approval:access',
        'approval:approve',
        'approval:reject',
        'approval:delegate',
        'approval:manage',
        'dashboard:read',
        'profile:read',
        'profile:edit',
        'profile:manage',
        'reports:read',
        'reports:create',
        'reports:manage',
        'system:manage',
        'audit:read',
        'roles:manage',
        'permissions:manage',
        'workflows:manage',
        'notifications:manage',
        'content:manage',
        'analytics:read',
        'checkers:manage'
      ],
      'checker': [
        'checker:access',
        'approval:access',
        'approval:approve',
        'approval:reject',
        'approval:delegate',
        'requests:review',
        'requests:read',
        'requests:manage',
        'dashboard:read',
        'profile:read',
        'profile:edit',
        'workflows:review',
        'workflows:manage',
        'stats:review',
        'reports:review',
        'notifications:review',
        'history:review',
        'schedule:review',
        'schedule:manage',
        'settings:review',
        'settings:manage'
      ],
      'user': [
        'users:read',
        'users:create',
        'dashboard:read',
        'profile:read',
        'profile:edit',
        'requests:create',
        'requests:read',
        'requests:edit',
        'requests:delete',
        'templates:read',
        'notifications:read',
        'history:read',
        'stats:read',
        'bulk:manage'
      ],
    };

    const permissions: string[] = [];
    if (payload.realm_access?.roles) {
      payload.realm_access.roles.forEach((role) => {
        permissions.push(role.toLowerCase());
      })
    }

    const rolePermissions = permissionMatrix[currentRole.toLowerCase()] || [];

    return [...new Set([...permissions, ...rolePermissions])];

    // if (payload.resource_access) {
    //   Object.entries(payload.resource_access).forEach(([resource, access]) => {
    //     access.roles.forEach((role: string) => {
    //       permissions.push(`${resource}:${role.toLowerCase()}`);
    //     });
    //   });
    // }
    //
    // if (payload.scope) {
    //   payload.scope.split(' ').forEach((scope: string) => {
    //     permissions.push(scope.toLowerCase());
    //   });
    // }

    // return permissions;

  }

  const getUserProfile = () => {
    const payload = checkRole.value;
    if (!payload) return null;

    return {
      id: payload.sub || '',
      username: payload.preferred_username || '',
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      email: payload.email || '',
      emailVerified: payload.email_verified || false,
      department: '', // Assuming department is not available in the token
      phoneNumber: '',
      locale: 'eng',
      sessionId: payload.sid || '',
      roles: payload.realm_access?.roles || [],
      permissions: getUserPermissions(),
      currentRole: currentUserRole() || '',
      avatar: '' // Assuming avatar is not available in the token
    };
  }

  const isAuthenticated = (): boolean => {
    const token = useCookie('access_token').value;
    return !!(token && !isTokenExpired(token) && checkRole.value)
  }

  const hasRole = (role: string | string[]): boolean => {
    const payload = checkRole.value;
    if (!payload || !payload?.realm_access?.roles) {
      return false;
    }

    const roleArray = Array.isArray(role) ? role : [role];
    const userRoles = payload.realm_access.roles.map(r => r.toLowerCase());
    return roleArray.some(r => userRoles.includes(r.toLowerCase()));
  }

  const hasPermission = (permission: string): boolean => {
    const permissions = getUserPermissions();
    return permissions.some(p => p.toLowerCase() === permission.toLowerCase());
  }

  const hasAnyPermission = (permission: string[]): boolean => {
    const userPermissions = getUserPermissions();
    return permission.some(p => userPermissions.includes(p.toLowerCase()));
  }

  const hasAllPermission = (permission: string[]): boolean => {
    const userPermissions = getUserPermissions();
    return permission.every(p => userPermissions.includes(p.toLowerCase()));
  }

  const getTokenInfo = () => {
    const token = useCookie('access_token').value;
    const payload = checkRole.value;
    if (!token || !payload) {
      return null;
    }

    return {
      token,
      payload,
      isExpired: isTokenExpired(token),
      expiration: payload.exp ? new Date(payload.exp * 1000) : null,
      issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
      audience: payload.aud || '',
      subject: payload.sub || '',
      issuer: payload.typ || '',
      scope: payload.scope || ''
    };
  }

  return {
    checkRole: readonly(checkRole),
    currentUserRole,
    getUserPermissions,
    getUserProfile,
    isAuthenticated,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermission,
    getTokenInfo
  }

}
