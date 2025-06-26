export default defineNuxtRouteMiddleware((to, from) => {
  const {canAccess,handledUnauthorized} = useGuards();

  if(!canAccess(to.path)) {
    return handledUnauthorized(to.path);
  }
})
