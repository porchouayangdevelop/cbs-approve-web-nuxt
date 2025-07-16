export default defineNuxtRouteMiddleware(async (to, from) => {
  const {getCurrentUser,user,isAuthenticated} = useAuth();
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

  if(!user.value) {
    try {
      await getCurrentUser();
    }catch(err) {
      console.error('Error fetching user data:', err);
      return navigateTo('/auth/login');
    }
  }

  if (!user.value) {
    console.log('User data still not available after fetching');
    return navigateTo('/auth/login');
  }

  if (!canAccess(to.path)) {
    return handledUnauthorized(to.path);
  }
})
