export default defineNuxtRouteMiddleware((to, from) => {
  const {checkAuth, redirectToAllowPage} = useGuards();
  if (to.path !== '/') {
    return
  }

  if (!checkAuth()) {
    return navigateTo('/auth/login');
  }

  return redirectToAllowPage();
})
