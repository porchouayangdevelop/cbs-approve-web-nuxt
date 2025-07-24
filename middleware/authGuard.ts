export default defineNuxtRouteMiddleware(async (to, from) => {
  // Server-side logic can be added here if needed
  if (process.server) return;


  const { getCurrentUser, user, isAuthenticated, logout, isInitialized, isLoading } = useAuth();
  const { checkAuth, handledUnauthorized, canAccess } = useGuards();
  const { isTokenExpired } = useJWTDecoder();
  const { showTokenExpirationModal } = useTokenExpiration();

  // const clearAuthAndRedirect = async () => {
  //   try {
  //
  //     const accessTokenCookie = useCookie('access_token');
  //     const refreshTokenCookie = useCookie('refresh_token');
  //     accessTokenCookie.value = null;
  //     refreshTokenCookie.value = null;
  //
  //     if (process.client) {
  //       Object.keys(localStorage).forEach(key => {
  //         if (key.startsWith('request_draft_') || key.startsWith('preferred-language') || key.startsWith('preferredRole')) {
  //           localStorage.removeItem(key);
  //         }
  //       });
  //     }
  //
  //     try {
  //       await logout();
  //     } catch (e) {
  //       console.warn("AuthGuard: Logout cleanup fail", e)
  //     }
  //
  //   } catch (e) {
  //     console.error('AuthGuard: Error during auth cleanup:', e);
  //   } finally {
  //     navigateTo('/auth/login', {replace: true});
  //   }
  // }


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


  if (!isInitialized.value && isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return;
  }

  const token = useCookie('access_token').value;
  if (!token) {
    console.log('No access token found, redirecting to login');
    return navigateTo('/auth/login');
  }

  // let decodedToken;
  // try {
  //   decodedToken = decodeToken(token);
  //   if (!decodedToken) {
  //     await clearAuthAndRedirect();
  //     return;
  //   }
  // } catch (e) {
  //   console.log('AuthGuard: error decoding token:', e);
  //   await clearAuthAndRedirect();
  //   return;
  // }

  if (isTokenExpired(token)) {
    showTokenExpirationModal();


    return abortNavigation('Token expired - please refresh your session')

    // console.log('AuthGuard: Access token is expired, attempting refresh...');
    // try {
    //   const { refreshToken } = useAuth();
    //   const refreshed = await refreshToken();
    //   if (!refreshed) {
    //     console.log('Failed to refresh access token, redirecting to login');
    //     return navigateTo('/auth/login');
    //   }
    // } catch (e) {
    //   console.error('Error refreshing token:', e);
    //   return navigateTo('/auth/login');
    // }

  }

  if (!checkAuth()) {
    console.log('User is not authenticated, redirecting to login');
    // await clearAuthAndRedirect();
    return navigateTo('/auth/login');
  }

  // let attempts = 0;
  // let maxAttempts = 10;
  //
  // while (!user.value && attempts < maxAttempts) {
  //   try {
  //     await getCurrentUser();
  //     attempts += 1;
  //
  //     if (!user.value && attempts < maxAttempts) {
  //       console.log(`Attempt ${attempts}: User data not available yet, retrying...`);
  //       await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 1 second before retrying
  //     }
  //   } catch (e) {
  //     console.log(`Error fetching user data on attempt ${attempts}:`, e);
  //     if (attempts >= maxAttempts) {
  //       console.error('Max attempts reached, redirecting to login');
  //       await clearAuthAndRedirect();
  //       return;
  //     }
  //   }
  // }

  if (!user.value && isLoading.value) {
    try {
      await getCurrentUser();
    } catch (err) {
      console.error('Error fetching user data:', err);
      return navigateTo('/auth/login');
    }
  }

  if (!user.value) {
    console.log('User data still not available after fetching');
    // await clearAuthAndRedirect();
    return navigateTo('/auth/login');
  }

  if (!canAccess(to.path)) {
    return handledUnauthorized(to.path);
  }
})
