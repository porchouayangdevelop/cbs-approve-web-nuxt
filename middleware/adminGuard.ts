export default defineNuxtRouteMiddleware((to, from) => {
  const {hasRole, handledUnauthorized, hasPermission} = useGuards();

  if (!hasRole('admin')) {
    console.log('Admin access denied: insufficient role')
    return handledUnauthorized(to.path);
  }

  if (!hasPermission('admin:access')) {
    console.log('Admin access denied: insufficient permissions')
    return handledUnauthorized(to.path);
  }

  console.log('Admin access granted')
})
