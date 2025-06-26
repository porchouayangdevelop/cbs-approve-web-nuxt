export default defineNuxtRouteMiddleware((to, from) => {
  const {hasRole,handledUnauthorized,hasPermission} = useGuards();

  const hasCheckerRole = hasRole(['Checker', 'admin']);
  const hasApprovalPermission = hasPermission('approval:access');

  if(!hasCheckerRole || !hasApprovalPermission) {
    return handledUnauthorized(to.path);
  }
})
