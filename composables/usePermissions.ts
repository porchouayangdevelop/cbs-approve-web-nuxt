export const usePermissions = () => {
  const { user } = useAuth();
  const { getUserPermissions, currentUserRole } = useCheckAuth();

  // Enhanced permission matrix based on roles
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

  // Get user permissions from both JWT token and role-based matrix
  const getUserPermissionsEnhanced = computed(() => {
    // Get permissions from JWT token
    const tokenPermissions = getUserPermissions();

    // Get role-based permissions
    const currentRole = currentUserRole();
    const rolePermissions = currentRole ? permissionMatrix[currentRole.toLowerCase()] || [] : [];

    // Combine and deduplicate permissions
    return [...new Set([...tokenPermissions, ...rolePermissions])];
  });

  // Get user permissions (legacy compatibility)
  const getUserPermissionsLegacy = computed(() => {
    if (!user.value?.role) return [];
    return permissionMatrix[user.value.role.toLowerCase()] || [];
  });

  const hasPermission = (permission: string): boolean => {
    const permissions = getUserPermissionsEnhanced.value;
    return permissions.includes(permission.toLowerCase());
  };

  // Check if user has any of the provided permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    const userPermissions = getUserPermissionsEnhanced.value;
    return permissions.some(permission =>
      userPermissions.includes(permission.toLowerCase())
    );
  };

  // Check if user has all of the provided permissions
  const hasAllPermissions = (permissions: string[]): boolean => {
    const userPermissions = getUserPermissionsEnhanced.value;
    return permissions.every(permission =>
      userPermissions.includes(permission.toLowerCase())
    );
  };

  // Get permissions by category
  const getPermissionsByCategory = (category: string): string[] => {
    const permissions = getUserPermissionsEnhanced.value;
    return permissions.filter(permission =>
      permission.startsWith(`${category.toLowerCase()}:`)
    );
  };

  // Check if user can perform a specific action on a resource
  const canPerform = (action: string, resource: string): boolean => {
    const permission = `${resource.toLowerCase()}:${action.toLowerCase()}`;
    return hasPermission(permission);
  };

  // Get user's role-based capabilities
  const getRoleCapabilities = () => {
    const currentRole = currentUserRole();

    if (!currentRole) return [];

    const capabilities = {
      admin: [
        'Full system access',
        'User management',
        'System configuration',
        'Security management',
        'Analytics and reporting',
        'Workflow management'
      ],
      checker: [
        'Request approval',
        'Workflow management',
        'Approval delegation',
        'Performance tracking',
        'Schedule management'
      ],
      user: [
        'Create requests',
        'View request status',
        'Manage personal profile',
        'Use templates',
        'View notifications'
      ],
    };

    return capabilities[currentRole.toLowerCase() as keyof typeof capabilities] || [];
  };

  // Check if user has access to a specific module
  const hasModuleAccess = (module: string): boolean => {
    const modulePermissions: Record<string, string[]> = {
      'admin': ['admin:access'],
      'user-management': ['users:read', 'users:manage'],
      'approval-system': ['approval:access', 'checker:access'],
      'analytics': ['analytics:read', 'reports:read'],
      'settings': ['settings:read', 'settings:manage'],
      'workflows': ['workflows:review', 'workflows:manage']
    };

    const requiredPermissions = modulePermissions[module.toLowerCase()] || [];
    return hasAnyPermission(requiredPermissions);
  };

  // Get available actions for a resource
  const getAvailableActions = (resource: string): string[] => {
    const permissions = getUserPermissionsEnhanced.value;
    const resourcePermissions = permissions.filter(permission =>
      permission.startsWith(`${resource.toLowerCase()}:`)
    );

    return resourcePermissions.map(permission =>
      permission.split(':')[1]
    );
  };

  // Check permission level (read, write, manage)
  const getPermissionLevel = (resource: string): 'none' | 'read' | 'write' | 'manage' => {
    if (canPerform('manage', resource)) return 'manage';
    if (canPerform('edit', resource) || canPerform('create', resource) || canPerform('delete', resource)) return 'write';
    if (canPerform('read', resource)) return 'read';
    return 'none';
  };

  // Get permission summary for debugging
  const getPermissionSummary = () => {
    const currentRole = currentUserRole();
    const tokenPermissions = getUserPermissions();
    const rolePermissions = currentRole ? permissionMatrix[currentRole.toLowerCase()] || [] : [];
    const allPermissions = getUserPermissionsEnhanced.value;

    return {
      currentRole,
      tokenPermissions,
      rolePermissions,
      allPermissions,
      permissionCount: allPermissions.length,
      capabilities: getRoleCapabilities()
    };
  };

  return {
    getUserPermissions: getUserPermissionsEnhanced,
    getUserPermissionsLegacy,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissionsByCategory,
    canPerform,
    getRoleCapabilities,
    hasModuleAccess,
    getAvailableActions,
    getPermissionLevel,
    getPermissionSummary,
    permissionMatrix
  };
};