import {defineStore} from 'pinia';

interface UserState {
  role: string;
  permissions?: string[];
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;

}

export const useUserStore = defineStore('userStore', () => {
  const state = reactive<UserState>({
    role: '',
    permissions: [],
    isAuthenticated: false,
    token: null,
    isLoading: false
  });

  //getters
  const role = computed(() => state.role);
  const permissions = computed(() => state.permissions);
  const isAuthenticated = computed(() => state.isAuthenticated);
  const token = computed(() => state.token);
  const isLoading = computed(() => state.isLoading);

  //actions
  const setRole = (newRole: string) => {
    state.role = newRole;
  };
  const setPermissions = (newPermissions: string[]) => {
    state.permissions = newPermissions;
  };

  const setIsAuthenticated = (status: boolean) => {
    state.isAuthenticated = status;
  };

  const setToken = (newToken: string | null) => {
    state.token = newToken;
  };

  const setIsLoading = (status: boolean) => {
    state.isLoading = status;
  };

  return {
    // State
    state,
    // Getters
    role,
    permissions,
    isAuthenticated,
    token,
    isLoading,

    // Actions
    setRole,
    setPermissions,
    setIsAuthenticated,
    setToken,
    setIsLoading

  };
});