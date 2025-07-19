import { defineStore } from 'pinia';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  createTimestamp: string;
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

interface UserCreateCredential {
  userType: string
  username: string
  firstName: string
  lastName: string
  email?: string
  department: string
  phone: string
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

export const useSystemUserStore = defineStore('SystemUserStore', () => {
  //state
  const users = ref<User[]>([]);
  const roles = ref<RoleMapping[]>([]);
  const userCredential = ref<UserCreateCredential>({
    userType: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    phone: '',
    enabled: true,
    emailVerified: false,
    credentials: [{
      type: 'password',
      value: '',
      temporary: false
    }]
  })

  const loading = ref(false);
  const error = ref<string | null>(null);

  //getters
  const usersList = computed(() => users.value);
  const rolesList = computed(() => roles.value);
  const isLoading = computed(() => loading.value);
  const isError = computed(() => error.value);


  //actions
  const clearError = () => error.value = null;


  const getUsers = async () => {
    try {
      loading.value = true;
      clearError();

      console.log('🔍 Starting to fetch users...');

      const config = useRuntimeConfig();
      const { $authApi } = useNuxtApp();

      // console.log('🌐 API Base URL:', config.public.auth_url);
      console.log('🔑 Auth token exists:', !!useCookie('access_token').value);

      const { data } = await $authApi.get(`admin/realms/apb_teller/users`);

      console.log('✅ Raw API Response:', data);
      console.log('📊 Response type:', typeof data);
      console.log('📋 Is Array:', Array.isArray(data));

      users.value = Array.isArray(data) ? data : data;

      console.log('📦 Processed Users:', users.value);
      if (users.value.length === 0) {
        console.warn('⚠️ No users found in the response.');
      } else {
        console.log(`📈 Total users fetched: ${users.value.length}`);
      }

    } catch (e) {
      console.error('❌ Error fetching users:', e);

      error.value = e instanceof Error ? e.message : 'An error occurred while fetching users';
      users.value = []; // Ensure users is always an array
    } finally {
      loading.value = false;
    }
  }

  const getRoles = async (id: number) => {
    try {
      loading.value = true;
      const { $authApi } = useNuxtApp();

      const { data } = await $authApi.get(`admin/realms/apb_teller/users/${id}/role-mappings/realm`);

      roles.value = Array.isArray(data) ? data : data;

      return roles.value;

    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while fetching roles';
    } finally {
      loading.value = false;
    }
  }

  const userCreateCredential = (state: UserCreateCredential) => {
  }

  return {
    users: readonly(users),
    roles: readonly(roles),
    userCredential: readonly(userCredential),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    usersList,
    rolesList,
    isLoading,
    isError,

    // Actions
    getUsers,
    getRoles,
    userCreateCredential,
    clearError,
  };
});