export default defineNuxtRouteMiddleware((to, from) => {
  // const {canAccess,handledUnauthorized} = useGuards();

  // if(!canAccess(to.path)) {
  //   console.log(`Permission denied for route: ${to.path}`)
  //   return handledUnauthorized(to.path);
  // }

  // console.log(`Permission granted for route: ${to.path}`)

  const { hasPermission, hasRole, getMissingPermissions } = usePermissionSystem();

  const criticalRoutes = [
    '/admin/users/create',
    '/admin/users/delete',
    '/admin/system',
    '/admin/settings/security'
  ]

  if (criticalRoutes.includes(to.path)) {
    const missing = getMissingPermissions(to.path)

    if (missing.roles.length > 0 || missing.permissions.length > 0) {
      console.error('Insufficient permissions for critical route:', {
        route: to.path,
        missing: missing
      })

      throw createError({
        statusCode: 403,
        statusMessage: 'Insufficient permissions for this action'
      })
    }
  }
})
