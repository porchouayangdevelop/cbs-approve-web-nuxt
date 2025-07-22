export default defineNuxtPlugin(async (nuxtApp) => {

  if (process.server) return;

  const { getCurrentUser, isAuthenticated, isLoading, initializeAuth, isInitialized } = useAuth();
  const { isTokenExpired } = useJWTDecoder();

  if (isInitialized.value || isLoading.value) { return; };

  const accessToken = useCookie('access_token').value;

  if (accessToken && !isTokenExpired(accessToken)) {
    try {
      // await getCurrentUser();
      await initializeAuth();
    } catch (e) {
      const accessTokenCookie = useCookie('access_token');
      const refreshTokenCookie = useCookie('refresh_token');
      accessTokenCookie.value = null;
      refreshTokenCookie.value = null;
    }
  } else if (accessToken) {
    const accessTokenCookie = useCookie('access_token');
    const refreshTokenCookie = useCookie('refresh_token');
    accessTokenCookie.value = null;
    refreshTokenCookie.value = null;
  }
})
