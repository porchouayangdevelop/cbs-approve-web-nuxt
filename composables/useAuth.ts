import type {AxiosResponse} from "axios";
import {useJWTDecoder} from "~/composables/useJWTDecoder";

import type {TokenPayload} from "~/composables/useJWTDecoder";

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

  const {getUserProfile, isAuthenticated: checkAuthStatus, currentUserRole, getUserPermissions} = useCheckAuth();
  const {decodeToken, isTokenExpired} = useJWTDecoder();


  const getCurrentUser = async (): Promise<User | null> => {
    try {
      isLoading.value = true;

      const token = useCookie('access_token').value;
      if (!token || isTokenExpired(token)) {
        throw new Error('Token is invalid or expired');
      }

      if (!checkAuthStatus()) {
        throw new Error('User is not authenticated');
      }

      const profile = getUserProfile();
      if (!profile) {
        throw new Error('User profile not found');
      }

      const userProfile: User = {
        id: profile.id || '',
        username: profile.username || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        emailVerified: profile.emailVerified,
        role: profile.currentRole || '',
        roles: profile.roles || [],
        department: profile.department || '',
        permissions: getUserPermissions(),
        avatar: profile.avatar,
        locale: profile.locale,
        sessionId: profile.sessionId,
      }

      const validRole = ['admin', 'checker', 'user'].includes(userProfile.role.toLowerCase());
      if (!validRole) {
        throw new Error(`Invalid user role: ${userProfile.role}`);
      }

      user.value = userProfile;
      isAuthenticated.value = true;

      console.log(`Current user loaded: ${user.value.username} with role ${user.value.role}`);

      return userProfile ? userProfile : null;
    } catch (e) {
      console.log(`Error fetching user data: ${e}`);
      await logout();
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  const loginWithRole = async (credential: Credentials & { role?: string }) => {
    try {
      isLoading.value = true;
      const response = await login(credential);

      const userRole = user.value?.role?.toLowerCase();
      const selectRole = credential.role?.toLowerCase();

      if (selectRole && userRole !== selectRole) {
        throw new Error(`Error while login with role "${credential.role}"`);
      }
      return response;
    } catch (e) {
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  const login = async (credentials: Credentials) => {
    try {
      isLoading.value = true;
      const {$authApi} = useNuxtApp();
      // const config = useRuntimeConfig();

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

      const {data} = await $authApi.post<AuthResponse>(`realms/apb_teller/protocol/openid-connect/token`, params, config);

      const response = data;

      const token = useCookie('access_token');
      const refreshToken = useCookie('refresh_token')
      token.value = data.access_token;
      refreshToken.value = data.refresh_token;


      const decoder = decodeToken(token.value)
      if (decoder) {
        isAuthenticated.value = true;
        await getCurrentUser();
      }

      return response;

    } catch (e) {
      console.error(`Login failed: ${e}`);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true;
      const {$authApi} = useNuxtApp();
      const config = useRuntimeConfig();

      const refreshToken = useCookie('refresh_token').value;
      if (refreshToken) {
        try {
          await $authApi.post(`${config.public.logout}`, new URLSearchParams({
            client_id: 'apb_teller_security',
            refresh_token: refreshToken
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
              // 'Authorization': `Bearer ${useCookie('access_token')?.value || ''}`
            }
          });
        } catch (logoutError) {
          console.warn('Server logout failed:', logoutError);
        }
      }

      const accessTokenCookie = useCookie('access_token');
      const refreshTokenCookie = useCookie('refresh_token');

      accessTokenCookie.value = null;
      refreshTokenCookie.value = null;

      user.value = null;
      isAuthenticated.value = false;
      await navigateTo('/auth/login');
    } catch (e) {
      console.error(`Logout failed: ${e}`);

      const accessTokenCookie = useCookie('access_token');
      const refreshTokenCookie = useCookie('refresh_token');
      accessTokenCookie.value = null;
      refreshTokenCookie.value = null;

      user.value = null;
      isAuthenticated.value = false;
      await navigateTo('/auth/login');
    } finally {
      isLoading.value = false;
    }
  }

  const refreshToken = async () => {
    try {
      isLoading.value = true;
      const {$authApi} = useNuxtApp();
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

      const {data} = await $authApi.post<AuthResponse>(`${config.refreshToken}`, params, {
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

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    getCurrentUser,
    login,
    loginWithRole,
    logout,
    refreshToken,
    updateProfile,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }
}
