export default defineNuxtRouteMiddleware((to, from) => {
  const {hasRole, handledUnauthorized} = useGuards();

  const allowedRole = ['user', 'checker', 'admin'];

  if (!hasRole(allowedRole)) {
    console.log('User access denied: insufficient role')
    return handledUnauthorized(to.path);
  }

  console.log('User access granted');
})
