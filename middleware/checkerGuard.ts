export default defineNuxtRouteMiddleware(async (to, from) => {
  const { redirectUnauthorized } = useRouteGuards();
  const { user, isAuthenticated, getCurrentUser } = useAuth();
  const { hasPermission, hasRole } = usePermissionSystem()

  if (!isAuthenticated.value) {
    console.log('Checker access denied: user not authenticated');
    return navigateTo('/auth/login');
  }

  if (!user.value) {
    console.log('Checker access denied: user data not available');
    try {
      await getCurrentUser();
    } catch (err) {
      console.error('Error fetching user data:', err);
      return navigateTo('/auth/login');
    }
  }

  if (!user.value) {
    console.log('Checker access denied: user data still not available after fetching');
    return navigateTo('/auth/login');
  }


  const hasCheckerRole = hasRole(['checker', 'admin']);
  if (!hasCheckerRole) {
    console.log('Checker access denied: insufficient role')
    return redirectUnauthorized(to.path);
  }

  const hasApprovalPermission = hasPermission(["checkers:access", 'checker:approve']);
  if (!hasApprovalPermission) {
    console.log('Checker access denied: insufficient permissions')
    return redirectUnauthorized(to.path)
  }

  console.log('Checker access granted')
})
