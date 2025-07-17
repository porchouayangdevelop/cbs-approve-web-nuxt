export default defineNuxtPlugin(async (nuxtApp) => {
  const {getCurrentUser,isAuthenticated} = useAuth();

  if(process.client){
    const accessToken = useCookie('access_token').value;

    if(accessToken){
      try {
        await getCurrentUser();
      }catch (e) {
        const accessTokenCookie = useCookie('access_token');
        const refreshTokenCookie = useCookie('refresh_token');
        accessTokenCookie.value = null;
        refreshTokenCookie.value = null;

      }

    }

  }


})
