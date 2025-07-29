export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return;

  // const { isAuthenticated, user, isLoading } = useAuth();
  const { checkAuth, canAccessRoute, getDefaultRoute } = usePermissionSystem();
  const { publicRoutes } = useRoutePublic();

  // if (isLoading.value) {
  //   return;
  // }

  const isPublicRoute = publicRoutes.value.includes(to.path);

  if (isPublicRoute) {
    return;
  }

  if (!checkAuth()) {
    const intendedRoute = useCookie('intended_route');
    intendedRoute.value = to.fullPath;
    return navigateTo('/auth/login');
  }

  if (!canAccessRoute(to.path)) {
    const defaultRoute = getDefaultRoute();
    if (to.path !== defaultRoute) {
      return navigateTo(defaultRoute);
    } else {
      return navigateTo('/auth/unauthorized');
    }
  }

  // Don't redirect if already on login page or if user is logging in
  // if (to.path === '/auth/login' && isAuthenticated.value && user.value) {

  //   const intendedRoute = useCookie('intended_route');
  //   const targetRoute = intendedRoute.value || defaultRoute(user.value?.role);
  //   intendedRoute.value = null; // Clear the intended route after redirecting
  //   return navigateTo(targetRoute, { replace: true });
  // }



  // Handle unauthenticated access to protected routes
  // if (!isAuthenticated.value) {
  //   console.log('User is not authenticated, redirecting to login');

  //   const intendedRoute = useCookie('intended_route', {
  //     default: () => '',
  //     maxAge: 60 * 60 * 24, // 24 hour
  //     sameSite: 'lax',
  //   });

  //   if (!intendedRoute.value && to.fullPath !== '/') {
  //     intendedRoute.value = to.fullPath;
  //   }

  //   return navigateTo('/auth/login', { replace: true });
  // }

  // if (to.path === '/' && isAuthenticated.value && user.value) {
  //   const route = defaultRoute(user.value?.role);
  //   return navigateTo(route, { replace: true });
  // }
})

