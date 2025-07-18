import {defineStore} from 'pinia';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  createTimestamp: string;
  enabled: boolean;
  disabledCredentialTypes: string[];
  requiredActions: string[];
  notBefore: number;
  access: {
    manage: boolean;
  };
  role:string;
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
  const setLoading = (value: boolean) => loading.value = value;

  const getUsers = async () => {
    try {
      setLoading(true);
      clearError();
      const config = useRuntimeConfig();
      const {$authApi} = useNuxtApp();

      const {data} = await $authApi.get(`admin/realms/apb_teller/users`);

      users.value = Array.isArray(data) ? data : data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while fetching users';
    } finally {
      setLoading(false);
    }
  }

  const getRoles = async (id : number) => {
    try {
      loading.value = true;
      const config = useRuntimeConfig();
      const {$authApi} = useNuxtApp();

      const {data} = await $authApi.get(`admin/realms/apb_teller/users/${id}/role-mappings/realm`);

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
    users:readonly(users),
    roles:readonly(roles),
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