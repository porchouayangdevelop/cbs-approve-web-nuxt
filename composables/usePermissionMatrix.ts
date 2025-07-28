export const usePermissionMatrix = () => {
  const permissionMatrix = computed((): Record<string, string[]> => {
    return {
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
    }
  });

  return {
    permissionMatrix
  }
}
