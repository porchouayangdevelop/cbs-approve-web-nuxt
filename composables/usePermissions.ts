export const usePermissions = () => {
  const {user} = useAuth();

  const permissionMatrix: Record<string, string[]> = {
    'admin': [
      'admin:access',
      'users:create',
      'users:read',
      'users:edit',
      'users:delete',
      'settings:manage',
      'approval:access',
      'approval:approve',
      'approval:reject',
      'approval:delegate',
      'dashboard:read',
      'profile:read',
      'profile:edit',
      'reports:read',
      'reports:create'
    ],
    'checker': [
      'approval:access',
      'approval:approve',
      'approval:reject',
      'dashboard:read',
      'profile:read',
      'profile:edit',
      'requests:review'
    ],
    'user': [
      'dashboard:read',
      'profile:read',
      'profile:edit',
      'requests:create',
      'requests:read'
    ]
  }
  const getUserPermissions = computed(() => {
    if (!user.value?.role) return []
    return permissionMatrix[user.value.role] || []
  })

  const hasPermissions = (permission: string): boolean => getUserPermissions.value.includes(permission);
  const hasPermission = (permission: string): boolean => {
    return getUserPermissions.value.includes(permission)
  }

  // Check if user has any of the provided permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  // Check if user has all of the provided permissions
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  // Get permissions by category
  const getPermissionsByCategory = (category: string): string[] => {
    return getUserPermissions.value.filter(permission =>
      permission.startsWith(`${category}:`)
    )
  }

  return {
    getUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissionsByCategory,
    permissionMatrix
  }
}
