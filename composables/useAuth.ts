import type { AxiosResponse } from "axios";
import { useJWTDecoder } from "~/composables/useJWTDecoder";
import type { TokenPayload } from "~/composables/useJWTDecoder";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  role: string;
  roles: string[];
  department?: string;
  permissions: string[];
  avatar?: string;
  locale?: string;
  lastUpdated?: string;
  sessionId?: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface CredentialLogout {
  refreshToken: string;
  client_id: string;
  client_secret: string;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  not_before_policy: number;
  session_state: string;
  scope: string;
}

export const useAuth = () => {

  const user = useState<User | null>('auth.user', () => null);
  const isAuthenticated = useState<boolean>('auth.isAuthenticated', () => false);
  const isLoading = useState<boolean>('auth.isLoading', () => false);
  const isInitialized = useState<boolean>('auth.isInitialized', () => false);


  const initializationPromise = useState<Promise<void> | null>('auth.initializationPromise', () => null);

  const { getUserProfile, isAuthenticated: checkAuthStatus, currentUserRole, getUserPermissions } = useCheckAuth();
  const { decodeToken, isTokenExpired } = useJWTDecoder();
  const { defaultRoute } = useDefaultRouteForRole();

  const {
    setAccessToken,
    getAccessToken,
    validateAccessToken,
    getRefreshToken,
    setRefreshToken,
    clearCookies
  } = useCookieHelping();

  const initializeAuth = async () => {
    if (isInitialized.value || initializationPromise.value) { return initializationPromise.value };

    initializationPromise.value = _performInitialization();
    try {
      // isLoading.value = true;

      // const token = useCookie("access_token").value;
      // if (!token) {
      //   console.warn('No access token found, user is not authenticated');
      //   isAuthenticated.value = false;
      //   return;
      // }

      // if (isTokenExpired(token)) {
      //   console.warn('Access token is expired, trying to refresh...');
      //   const refreshed = await refreshToken();
      //   if (!refreshed) {
      //     console.warn('Failed to refresh access token, user is not authenticated');
      //     clearCookies();
      //     isAuthenticated.value = false;
      //     return;
      //   }
      // }
      // await getCurrentUser();
      await initializationPromise.value;

    }
    // catch (e) {
    //   console.error(`Error during auth initialization: ${e}`);
    //   clearCookies();
    //   user.value = null;
    //   isAuthenticated.value = false;
    // }
    finally {
      // isLoading.value = false;
      // isInitialized.value = false;
      initializationPromise.value = null;
    }
  }

  const _performInitialization = async () => {
    if (isInitialized.value || isLoading.value) return;

    try {
      isLoading.value = true;

      const token = useCookie("access_token").value;
      if (!token) {
        isAuthenticated.value = false;
        isInitialized.value = true;
        return;
      }

      if (isTokenExpired(token)) {
        console.log('Access token expired, attempting refresh...');
        const refreshed = await refreshToken();
        if (!refreshed) {
          clearCookies();
          isAuthenticated.value = false;
          isInitialized.value = true;
          return;
        }

      }
      await getCurrentUser();
      isInitialized.value = true;
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearCookies();
      user.value = null;
      isAuthenticated.value = false;
      isInitialized.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  const getCurrentUser = async (): Promise<User | null> => {
    // if (isLoading.value) return user.value;
    try {
      isLoading.value = true;

      const token = useCookie('access_token').value;
      if (!token) {
        throw new Error('Token is invalid or expired');
      }

      if (isTokenExpired(token)) {
        console.warn('Access token is expired, trying to refresh...');
        const refreshed = await refreshToken();
        if (!refreshed) {
          throw new Error('Failed to refresh access token');
        }

        // const newToken = setAccessToken('access_token', 3600);
        // if (!newToken) {
        //   throw new Error('Failed to set new access token');
        // }
      }

      if (!checkAuthStatus()) {
        throw new Error('User is not authenticated');
      }

      const profile = getUserProfile();
      if (!profile) {
        throw new Error('User profile not found');
      }

      const detectRole = currentUserRole();
      if (!detectRole) {
        throw new Error('User role not found');
      }

      const userProfile: User = {
        id: profile.id,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        emailVerified: profile.emailVerified,
        role: profile.roles && profile.roles.length > 0 ? profile.roles[0] : detectRole,
        roles: profile.roles,
        department: profile.department,
        permissions: getUserPermissions(),
        avatar: profile.avatar || generateAvatarUrl(profile.username, profile.lastName),
        locale: profile.locale,
        sessionId: profile.sessionId,
      }

      const validRole = ['admin', 'checker', 'user'];
      if (!validRole.includes(userProfile.role.toLowerCase())) {
        throw new Error(`Invalid user role: ${userProfile.role}`);
      }

      user.value = userProfile;
      isAuthenticated.value = true;
      return userProfile;
    } catch (e) {
      console.log(`Error fetching user data: ${e}`);
      user.value = null;
      isAuthenticated.value = false;

      return null;
    } finally {
      isLoading.value = false;
    }
  }

  const generateAvatarUrl = (username: string, lastname: string): string => {
    const baseUrl = 'https://ui-avatars.com/api/';
    const size = 128; // Default size
    const name = `${username} ${lastname}`.trim();
    const encodedName = encodeURIComponent(name);
    return `${baseUrl}?name=${encodedName}&size=${size}&background=random&color=fff`;
  }

  const login = async (credentials: Credentials) => {
    if (isLoading.value) { throw new Error('Login already in progress') };
    try {
      isLoading.value = true;
      const { $authApi } = useNuxtApp();

      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('client_id', 'apb_teller_security');
      params.append('username', credentials.username);
      params.append('password', credentials.password);
      params.append('client_secret', '8jIgedW9VfqjCAyAMuC5hrgPoYgZt2mC');

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      const { data } = await $authApi.post<AuthResponse>(`realms/apb_teller/protocol/openid-connect/token`, params, config);

      const accessToken = setAccessToken(data.access_token, data.expires_in);
      const refreshToken = setRefreshToken(data.refresh_token, data.refresh_expires_in);

      if (!accessToken || !refreshToken) {
        throw new Error('Failed to set access or refresh token');
      }

      const decoder = decodeToken(data.access_token);
      if (!decoder) {
        throw new Error('Failed to decode access token');
      }

      isAuthenticated.value = true;
      await getCurrentUser();

      const userAccount = await getCurrentUser();

      if (!userAccount) {
        throw new Error('Failed to fetch user data after login');
      }

      const intendedRoute = useCookie('intended_route');
      const redirect = intendedRoute.value || defaultRoute(userAccount.role);

      intendedRoute.value = null; // Clear the intended route after redirecting

      await nextTick();
      await navigateTo(redirect, { replace: true });

      return data;
    } catch (e) {
      console.error(`Login failed: ${e}`);
      clearCookies();
      user.value = null;
      isAuthenticated.value = false;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true;
      const { $authApi } = useNuxtApp();

      // Get refresh token for server-side logout
      const refreshTokenValue = useCookie('refresh_token').value;

      // Clear local state first
      await clearAuthState();

      // Attempt server-side logout if refresh token exists
      if (refreshTokenValue) {
        try {
          await $authApi.post(`realms/apb_teller/protocol/openid-connect/logout`, new URLSearchParams({
            refresh_token: refreshTokenValue,
            client_id: 'apb_teller_security',
            client_secret: '8jIgedW9VfqjCAyAMuC5hrgPoYgZt2mC'
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          console.log('Server logout successful');
        } catch (logoutError) {
          console.warn('Server logout failed, but local cleanup completed:', logoutError);
        }
      }

      // Clear cookies
      clearCookies();
      user.value = null;
      isAuthenticated.value = false;
      isInitialized.value = false;

      // Clear intended route cookie
      const intendedRoute = useCookie('intended_route');
      intendedRoute.value = null;

      await navigateTo('/auth/login');
    } catch (e) {
      console.error(`Logout error: ${e}`);
      // Ensure cleanup happens even if logout fails
      clearCookies();
      user.value = null;
      isAuthenticated.value = false;
      isInitialized.value = false;
      await clearAuthState();
      await navigateTo('/auth/login');
    } finally {
      isLoading.value = false;
    }
  }

  const refreshToken = async () => {
    if (isLoading.value) return false;
    try {
      isLoading.value = true;
      const { $authApi } = useNuxtApp();
      const config = useRuntimeConfig();
      const refreshToken = useCookie('refresh_token').value;

      if (!refreshToken) {
        await logout();
        return false;
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('client_id', 'apb_teller_security');
      params.append('refresh_token', refreshToken);
      params.append('client_secret', '8jIgedW9VfqjCAyAMuC5hrgPoYgZt2mC');

      const { data } = await $authApi.post<AuthResponse>(`${config.refreshToken}`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Update cookies with new tokens
      const accessToken = useCookie('access_token');
      const newRefreshToken = useCookie('refresh_token');

      accessToken.value = data.access_token;
      if (data.refresh_token) {
        newRefreshToken.value = data.refresh_token;
      }

      await getCurrentUser();

      return true;

    } catch (e) {
      console.error(`Refresh token failed: ${e}`);
      await logout();
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  const updateProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        console.log(`Updating profile for user`);
      }
    } catch (e) {
      console.error(`Error updating profile: ${e}`);
      // await logout();
    }
  }


  const clearAuthState = async () => {
    try {
      const accessTokenCookie = useCookie('access_token');
      const refreshTokenCookie = useCookie('refresh_token');
      accessTokenCookie.value = null;
      refreshTokenCookie.value = null;

      user.value = null;
      isAuthenticated.value = false;

      if (process.client) {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('request_draft_') || key.startsWith('preferred-language') || key.startsWith('preferredRole')) {
            localStorage.removeItem(key);
          }
        });
      }
      isInitialized.value = false;
      console.log('Auth state cleared successfully');

    } catch (e) {
      console.error(`Error clearing auth state: ${e}`);
    }
  }

  const hasRole = (roles: string | string[]): boolean => {
    if (!user.value) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.some(role => user.value?.roles.includes(role.toLowerCase()) || user.value?.role.toLowerCase() === role.toLowerCase());
  }

  const hasPermission = (permission: string): boolean => {
    if (!user.value?.permissions) return false;
    return user.value.permissions.includes(permission.toLowerCase());
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user.value?.permissions) return false;
    return permissions.some(permission =>
      user.value?.permissions.includes(permission.toLowerCase())
    );
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user.value?.permissions) return false;
    return permissions.every(permission =>
      user.value?.permissions.includes(permission.toLowerCase())
    );
  };

  if (process.client && !isInitialized.value && !initializationPromise.value) {
    initializeAuth();
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isInitialized: readonly(isInitialized),
    isLoading: readonly(isLoading),
    getCurrentUser,
    login,
    logout,
    refreshToken,
    updateProfile,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    initializeAuth,
    clearAuthState,
  }
}


