export default defineNuxtRouteMiddleware((to, from) => {
  const {hasRole, handledUnauthorized} = useGuards();

  const allowedRole = ['User', 'Checker', 'admin'];

  if (!hasRole(allowedRole)) {
    return handledUnauthorized(to.path);
  }
})
