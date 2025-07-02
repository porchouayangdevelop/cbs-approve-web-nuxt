export default defineNuxtRouteMiddleware((to, from) => {
  const {hasRole, handledUnauthorized, hasPermission} = useGuards();

  const hasCheckerRole = hasRole(['checker', 'admin']);
  const hasApprovalPermission = hasPermission(['checker:access', 'approval:access']);

  if (!hasCheckerRole) {
    console.log('Checker access denied: insufficient role')
    return handledUnauthorized(to.path);
  }

  if (!hasApprovalPermission) {
    console.log('Checker access denied: insufficient permissions')
    return handledUnauthorized(to.path)
  }

  console.log('Checker access granted')
})
