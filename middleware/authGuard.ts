export default defineNuxtRouteMiddleware(async (to, from) => {
  if(process.server) {
    // Server-side logic can be added here if needed
    return;
  }

  const {getCurrentUser,user,isAuthenticated} = useAuth();
  const {checkAuth, handledUnauthorized, canAccess} = useGuards();


  const publicRoutes: string[] = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/auth/unauthorized',
  ]

  if (publicRoutes.includes(to.path)) {
    return;
  }

  const token = useCookie('access_token').value;
  if(!token){
    console.log('No access token found, redirecting to login');
    return navigateTo('/auth/login');
  }

  const {isTokenExpired } = useJWTDecoder();
  if( isTokenExpired(token)) {
    console.log('Access token is expired, redirecting to login');

    try {
      const {refreshToken} = useAuth();
      const refreshed = await refreshToken();
      if(!refreshed) {
        console.log('Failed to refresh access token, redirecting to login');
        return navigateTo('/auth/login');
      }
    }catch (e) {
      console.error('Error refreshing token:', e);
      return navigateTo('/auth/login');
    }

  }

  if (!checkAuth()) {
    console.log('User is not authenticated, redirecting to login');
    return navigateTo('/auth/login');
  }

  let attempts = 0;
  let maxAttempts = 10;

  while (!user.value && attempts < maxAttempts) {
    try {
      await getCurrentUser();
      attempts += 1;

      if(!user.value && attempts < maxAttempts) {
        console.log(`Attempt ${attempts}: User data not available yet, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 1 second before retrying
      }
    }catch (e) {
      console.log(`Error fetching user data on attempt ${attempts}:`, e);
      if (attempts >= maxAttempts) {
        console.error('Max attempts reached, redirecting to login');
        return navigateTo('/auth/login');
      }
    }

  }

  if(!user.value) {
    try {
      await getCurrentUser();
    }catch(err) {
      console.error('Error fetching user data:', err);
      return navigateTo('/auth/login');
    }
  }

  if (!user.value) {
    console.log('User data still not available after fetching');
    return navigateTo('/auth/login');
  }

  if (!canAccess(to.path)) {
    return handledUnauthorized(to.path);
  }
})
