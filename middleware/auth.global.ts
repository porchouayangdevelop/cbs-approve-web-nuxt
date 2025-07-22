export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) {
    // Server-side logic can be added here if needed
    return;
  }

  const { isAuthenticated, user } = useAuth();
  const { defaultRoute } = useDefaultRouteForRole();
  const { publicRoutes } = useRoutePublic();

  const isPublicRoute = publicRoutes.value.includes(to.path);

  // Don't redirect if already on login page or if user is logging in
  if (to.path === '/auth/login') {
    if (isAuthenticated && user.value) {

      const intendedRoute = useCookie('intended_route');
      const targetRoute = intendedRoute.value || defaultRoute(user.value?.role);
      intendedRoute.value = null; // Clear the intended route after redirecting
      return navigateTo(targetRoute, { replace: true });
    }
    return; // Allow access to the login page
  }

  // Handle unauthenticated access to protected routes
  if (!isAuthenticated.value && !isPublicRoute) {
    console.log('User is not authenticated, redirecting to login');

    const intendedRoute = useCookie('intended_route', {
      default: () => to.fullPath,
      maxAge: 60 * 60 * 24, // 24 hour
      sameSite: 'lax',
    });
    intendedRoute.value = to.fullPath;
    return navigateTo('/auth/login', { replace: true });
  }

  if (to.path === '/' && isAuthenticated.value) {
    const route = defaultRoute(user.value?.role);
    return navigateTo(route, { replace: true });
  }
})

