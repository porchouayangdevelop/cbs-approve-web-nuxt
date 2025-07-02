export default defineNuxtRouteMiddleware(async (to, from) => {
  const {getCurrentUser} = useAuth();
  const {checkAuth, handledUnauthorized, canAccess} = useGuards();

  const publicRoutes: string[] = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/auth/unauthorized',
  ]

  if (publicRoutes.includes(to.path)) {
    return;
  }
  if (!checkAuth()) {
    return navigateTo('/auth/login');
  }

  try {
    await getCurrentUser();
  } catch (e) {
    return navigateTo('/auth/login')
  }

  if (!canAccess(to.path)) {
    return handledUnauthorized(to.path);
  }
})
