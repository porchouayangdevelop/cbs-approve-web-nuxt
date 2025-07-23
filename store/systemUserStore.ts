import { defineStore } from 'pinia';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  createdTimestamp: string;
  enabled: boolean;
  disabledCredentialTypes?: string[];
  requiredActions?: string[];
  notBefore?: number;
  access?: {
    manage: boolean;
  };
}

interface RoleCredential {
  id: string;
}

export interface RoleMapping {
  id: string;
  name: string;
  description?: string;
  composite?: boolean;
  clientRole?: boolean;
  containerId?: string;
}

export interface UserCreateCredential {
  username: string
  firstName: string
  lastName: string
  email?: string
  enabled: boolean
  emailVerified: boolean
  credentials: Array<{
    type: string
    value: string
    temporary: boolean
  }>
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

interface StoreState {
  loading: boolean;
  error: string | null;
}

export interface AssignRole {
  id: string;
  name: string;
  description?: string;
  composite?: boolean;
  clientRole?: boolean;
  containerId?: string;
}

export const useSystemUserStore = defineStore('SystemUserStore', () => {
  //state
  const users = ref<User[]>([]);
  const roles = ref<RoleMapping[]>([]);
  const userCredential = ref<UserCreateCredential>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    enabled: true,
    emailVerified: false,
    credentials: [{
      type: 'password',
      value: '',
      temporary: false
    }]
  })
  const assignCredential = ref<AssignRole>({
    id: '',
    name: '',
    description: '',
    composite: false,
    clientRole: false,
    containerId: ''
  })

  let loading = ref(false);
  const error = ref<string | null>(null);
  const initilized = ref(false);

  //getters
  const usersList = computed(() => users.value);
  const rolesList = computed(() => roles.value);
  const isLoading = computed(() => loading.value);
  const isError = computed(() => error.value);
  const isInitialized = computed(() => initilized.value);



  //actions
  const clearError = () => error.value = null;
  const clearUserCredential = () => userCredential.value = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    enabled: true,
    emailVerified: false,
    credentials: [{
      type: 'password',
      value: '',
      temporary: false
    }]
  }
  const clearAssingRoleCredential = () => assignCredential.value = {
    id: '',
    name: '',
    description: '',
    composite: false,
    clientRole: false,
    containerId: ''
  }


  const waitForAuth = async (): Promise<boolean> => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { isTokenExpired } = useJWTDecoder();

    while (authLoading.value) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const token = useCookie('access_token').value;
    if (!token) {
      return false;
    }
    if (isTokenExpired(token)) {
      return false;
    }

    if (!isAuthenticated.value) {
      return false;
    }

    return true;
  }


  const getUsers = async (): Promise<User[]> => {
    try {
      if (loading.value) {
        while (loading.value) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        return users.value;
      }

      loading.value = true;
      clearError();

      console.log('🔍 Starting to fetch users...');

      const authReady = await waitForAuth();
      if (!authReady) {
        throw new Error("Authentication not ready")
      }

      const { $authApi } = useNuxtApp();

      const { data } = await $authApi.get(`admin/realms/apb_teller/users`);


      const userData = Array.isArray(data) ? data : data;

      users.value.length = 0;
      users.value.push(...userData);

      initilized.value = true;

      // console.log('📦 Processed Users:', users.value);
      // if (users.value.length === 0) {
      //   console.warn('⚠️ No users found in the response.');
      // } else {

      // }

      return users.value;
    } catch (e: any) {
      console.error('❌ Error fetching users:', e);

      // Set a user-friendly error message
      if (e.response?.status === 401) {
        error.value = 'Authentication required. Please log in again.';
      } else if (e.response?.status === 403) {
        error.value = 'You do not have permission to access this resource.';
      } else if (e.response?.status >= 500) {
        error.value = 'Server error. Please try again later.';
      } else {
        error.value = e.message || 'An error occurred while fetching users';
      }

      // Don't clear existing data on error unless it's an auth error
      if (e.response?.status === 401 || e.response?.status === 403) {
        users.value.length = 0;
      }

      throw e; // Re-throw for component error handling
    } finally {
      loading.value = false;
    }
  }

  const getRoles = async (): Promise<RoleMapping[]> => {
    try {
      if (loading.value) {
        while (loading.value) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        return roles.value;
      }

      loading.value = true;
      clearError();
      const authReady = await waitForAuth();
      if (!authReady) throw new Error("Authentication not ready");

      const { $authApi } = useNuxtApp();
      const { data } = await $authApi.get(`admin/realms/apb_teller/roles`);

      const roleData = Array.isArray(data) ? data : data;
      roles.value.length = 0;
      roles.value.push(...roleData);

      return roles.value;
    } catch (e: any) {
      console.error('❌ Error fetching roles:', e);
      error.value = e.message || 'An error occurred while fetching roles';

      if (e.response?.status === 401 || e.response?.status === 403) {
        roles.value.length = 0;
      }

      throw e;
    } finally {
      loading.value = false
    }
  }

  const getRole = async (id: number): Promise<RoleMapping[]> => {
    try {
      loading.value = true;
      clearError();
      const authReady = await waitForAuth();
      if (!authReady) throw new Error("Authentication not ready");

      const { $authApi } = useNuxtApp();

      const { data } = await $authApi.get(`admin/realms/apb_teller/users/${id}/role-mappings/realm`);

      const roleData = Array.isArray(data) ? data : data;
      return roleData;
    } catch (e: any) {
      console.error('❌ Error fetching role:', e);
      error.value = e.message || 'An error occurred while fetching role';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const userCreateCredential = async (state: UserCreateCredential): Promise<void> => {
    try {
      loading.value = true;

      const authReady = await waitForAuth();
      if (!authReady) throw new Error("Authentication not ready");

      userCredential.value = { ...state };
      const { $authApi } = useNuxtApp();
      return await $authApi.post(`admin/realms/apb_teller/users`, state);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while fetching roles';
      throw e
    } finally {
      loading.value = false;
    }
  }

  const assignRoleCredential = async (id: string, role: AssignRole[]): Promise<void> => {
    try {
      loading.value = true;
      const authReady = await waitForAuth();
      if (!authReady) throw new Error("Authentication not ready");

      const { $authApi } = useNuxtApp();
      return await $authApi.post(`admin/realms/apb_teller/users/${id}/role-mappings/realm`, role);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while fetching roles';
      throw e
    } finally {
      loading.value = false;
    }
  }


  const resetStore = () => {
    users.value.length = 0;
    roles.value.length = 0;
    clearError();
    clearUserCredential();
    initilized.value = false;
  }


  return {
    users,
    roles,
    userCredential,
    assignCredential,
    loading,
    error,

    // Getters
    usersList,
    rolesList,
    isLoading,
    isError,
    isInitialized,

    // Actions
    getUsers,
    assignRoleCredential,
    getRoles,
    getRole,
    userCreateCredential,
    clearError,
    resetStore
  };
});