export default defineNuxtRouteMiddleware((to, from) => {
  const {canAccess,handledUnauthorized} = useGuards();

  if(!canAccess(to.path)) {
    console.log(`Permission denied for route: ${to.path}`)
    return handledUnauthorized(to.path);
  }

  console.log(`Permission granted for route: ${to.path}`)
})
