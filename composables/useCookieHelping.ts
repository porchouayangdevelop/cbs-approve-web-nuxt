export const useCookieHelping = () => {
  const setAccessToken =(token: string , expiresIn:number)=> {
    const accessToken = useCookie('access_token', {
      default: () => '',
      maxAge: expiresIn,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: false
    });
    accessToken.value = token;
    return !!accessToken.value;
  }

  const setRefreshToken =(token: string , expiresIn:number)=> {
    const refreshToken = useCookie('refresh_token', {
      default: () => '',
      maxAge: expiresIn,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: false
    });
    refreshToken.value = token;
    return !!refreshToken.value;
  }

  const getAccessToken = () => {
    const accessToken = useCookie('access_token');
    return accessToken.value || null;
  }

  const getRefreshToken = () => {
    const refreshToken = useCookie('refresh_token');
    return refreshToken.value || null;
  }

  const clearCookies = () => {
    const accessToken = useCookie('access_token');
    const refreshToken = useCookie('refresh_token');
    accessToken.value = null;
    refreshToken.value = null;
  }

  const validateAccessToken = () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      return false;
    }
    // Here you can add additional validation logic if needed
    return true;
  }

  return {
    setAccessToken,
    setRefreshToken,
    getAccessToken,
    getRefreshToken,
    clearCookies,
    validateAccessToken
  };

}
