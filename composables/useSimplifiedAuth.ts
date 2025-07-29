export const useSimplifiedAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout, refreshToken } = useAuth();
  const { getCurrentRole, hasRole, hasPermission, canAccessRoute, getDefaultRoute, navigateToDefaultRoute } = usePermissionSystem();

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    currentRole: computed(() => getCurrentRole()),

    login,
    logout,
    refreshToken,

    hasRole,
    hasPermission,
    canAccessRoute,

    getDefaultRoute,
    navigateToDefaultRoute
  }
}
