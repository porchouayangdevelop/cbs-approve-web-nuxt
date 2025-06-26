export default defineNuxtRouteMiddleware((to, from) => {
  const {checkAuth} = useGuards();

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
})
