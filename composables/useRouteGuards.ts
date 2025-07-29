
export const useRouteGuards = () => {
  const { checkAuth, canAccessRoute, getMissingPermissions, getDefaultRoute } = usePermissionSystem();


  const guardRoute = async (routePath: string): Promise<boolean> => {
    if (!checkAuth()) {
      await navigateTo('/auth/login')
      return false
    }

    if (!canAccessRoute(routePath)) {
      const missing = getMissingPermissions(routePath);

      const defaultRoute = getDefaultRoute();
      await navigateTo(defaultRoute)
      return false;
    }
    return true;
  }

  const redirectUnauthorized = async (routePath: string, reason?: string) => {
    await navigateTo({
      path: '/auth/unauthorized',
      query: {
        route: routePath,
        reason: reason || `Insufficient permissions to access ${routePath}`
      }
    })
  }

  return {
    guardRoute,
    redirectUnauthorized,
    canAccessRoute,
    getMissingPermissions
  }

}
