export default defineNuxtRouteMiddleware(async (to, from) => {
  const {hasRole, handledUnauthorized, hasPermission} = useGuards();
  const {user,isAuthenticated,getCurrentUser} = useAuth();

  if(!isAuthenticated.value) {
    console.log('Admin access denied: user not authenticated');
    return navigateTo('/auth/login');
  }

  if(!user.value) {
    console.log('Admin access denied: user data not available');
    try {
      await getCurrentUser();
    }catch(err) {
      console.error('Error fetching user data:', err);
      return navigateTo('/auth/login');
    }
  }

  if(!user.value) {
    console.log('Admin access denied: user data still not available after fetching');
    return navigateTo('/auth/login');
  }


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
