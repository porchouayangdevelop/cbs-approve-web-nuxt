interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  permissions: string[];
  avatar?: string;
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

  const getCurrentUser = async () => {
    try {
      isLoading.value = true;
      const token = useCookie('access_token');

      if (!token.value) {
        isAuthenticated.value = false;
        return null;
      }
      const userData: User = {
        id: "4f7c9819-0acd-4c2f-9161-479a6d442204",
        username: "apb01398",
        firstName: "Por",
        lastName: "Yang",
        email: "apb.por@hotmail.com",
        role: "admin",
        department: "IT",
        permissions: ['read:dashboard', 'manage:users', 'view:reports', 'read:settings'],
        avatar: 'https://avatars.githubusercontent.com/u/739984?v=4'
      }

      user.value = userData;
      isAuthenticated.value = true;
      return userData ? userData : null;
    } catch (e) {
      console.log(`Error fetching user data: ${e}`);
      await logout();
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
      const config = useRuntimeConfig();
      const {data} = await $authApi.post<AuthResponse>(`${config.login}`, credentials);

      const response = data as AuthResponse;

      const token = useCookie('access_token', {
        maxAge: 1000 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
      });
      token.value = data.access_token;

      isAuthenticated.value = true;

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
      const {data} = await $authApi.post(`${config.logout}`, {
        headers: {
          'Authorization': `Bearer ${useCookie('access_token')?.value || ''}`
        }
      });

      const token = useCookie('access_token').value;

      if (token) {
        useCookie('access_token').value = null;
      }
      user.value = null;
      isAuthenticated.value = false;
      await navigateTo('/auth/login');
    } catch (e) {
      console.error(`Logout failed: ${e}`);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  const refreshToken = async () => {
    try {
      isLoading.value = true;
      const {$authApi} = useNuxtApp();
      const config = useRuntimeConfig();
      const refreshToken = useCookie('refresh_token');

      if (!refreshToken.value) {
        await logout();
        return false;
      }

      const {data} = await $authApi.post<AuthResponse>(`${config.refreshToken}`, {
        refresh_token: refreshToken.value
      });

      const response = data as AuthResponse;

      const token = useCookie('access_token', {
        maxAge: 1000 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
      });
      token.value = response.access_token;

      return true;

    } catch (e) {
      console.error(`Refresh token failed: ${e}`);
      await logout();
      return false;
    }
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    getCurrentUser,
    login,
    logout,
    refreshToken
  }
}
