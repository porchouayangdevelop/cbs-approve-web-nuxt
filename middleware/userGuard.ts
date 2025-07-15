export default defineNuxtRouteMiddleware(async (to, from) => {
  const {hasRole, handledUnauthorized} = useGuards();
  const {user, isAuthenticated, getCurrentUser} = useAuth();

  if (!isAuthenticated.value) {
    console.log('User access denied: user not authenticated');
    return navigateTo('/auth/login');
  }

  if (!user.value) {
    console.log('User access denied: user data not available');
    try {
     await getCurrentUser();
    } catch (err) {
      console.error('Error fetching user data:', err);
      return navigateTo('/auth/login');
    }
  }

  if (!user.value) {
    console.log('User access denied: user data still not available after fetching');
    return navigateTo('/auth/login');
  }

  const allowedRole = ['user', 'checker', 'admin'];

  if (!hasRole(allowedRole)) {
    console.log('User access denied: insufficient role')
    return handledUnauthorized(to.path);
  }

  console.log('User access granted');
})
