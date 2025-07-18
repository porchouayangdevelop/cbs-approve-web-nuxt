export default defineNuxtPlugin(async (nuxtApp) => {
  const {getCurrentUser, isAuthenticated} = useAuth();
  const {isTokenExpired} = useJWTDecoder();

  if (process.client) {
    const accessToken = useCookie('access_token').value;

    if (accessToken && !isTokenExpired(accessToken)) {
      try {
        await getCurrentUser();
      } catch (e) {
        const accessTokenCookie = useCookie('access_token');
        const refreshTokenCookie = useCookie('refresh_token');
        accessTokenCookie.value = null;
        refreshTokenCookie.value = null;
      }
    } else {
      const accessTokenCookie = useCookie('access_token');
      const refreshTokenCookie = useCookie('refresh_token');
      accessTokenCookie.value = null;
      refreshTokenCookie.value = null;
    }

  }


})
