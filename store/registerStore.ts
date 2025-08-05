import type {
  RegisterCredentials,
  GetUsers,
  UsersReponse,
} from "~/types/user.client";

export const useUserRegisterStore = defineStore("userRegisterStore", () => {
  //state
  const credential = ref<RegisterCredentials>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    department: "",
    branchCode: "",
    subBranchCode: "",
    position: "",
    password: "",
    status: "PENDING",
    acceptTerms: false,
  });
  const users = ref<UsersReponse>({
    statusType: "",
    status: "",
    message: "",
    data: {
      totalItems: 0,
      data: [],
      totalPages: 0,
      currentPage: 0,
    },
    timestamp: "",
  });
  const user = ref<Object>({});
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const initalized = ref<boolean>(false);

  //getters
  const getUsers = computed(() => users.value);
  const getUser = computed(() => user.value);
  const getCredential = computed(() => credential.value);
  const getError = computed(() => error.value);
  const getLoading = computed(() => loading.value);
  const getInitialized = computed(() => initalized.value);

  //actions
  const clearError = () => (error.value = null);
  const resetInitialization = () => (initalized.value = false);

  //fetch data when admin authenticated

  const waitForAuth = async (): Promise<boolean> => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { isTokenExpired } = useJWTDecoder();

    while (isLoading.value) {
      await new Promise((_) => setTimeout(_, 100));
    }

    const token = useCookie("access_token").value;
    if (!token || isTokenExpired(token) || !isAuthenticated.value) {
      return false;
    }

    return true;
  };

  const registerUser = async (
    credential: RegisterCredentials
  ): Promise<void> => {
    try {
      loading.value = true;
      clearError();
      const { $userAPI } = useNuxtApp();
      const { data } = await $userAPI.post<RegisterCredentials>(
        `createRegister`,
        credential
      );
      initalized.value = true;
    } catch (error: any) {
      error.value = error.message || "An error occurred while registering";
    } finally {
      loading.value = false;
    }
  };

  const getRegisterUsers = async (
    getUsers: GetUsers
  ): Promise<UsersReponse> => {
    try {
      if (loading.value) {
        while (loading.value) {
          await new Promise((_) => setTimeout(_, 100));
        }
        return users.value;
      }

      if (!initalized.value) {
        loading.value = true;
        clearError();
        resetInitialization();
        const authReady = await waitForAuth();
        if (!authReady) {
          throw new Error("User is not authenticated");
        }

        const { $userAPI } = useNuxtApp();
        const { data } = await $userAPI.get<UsersReponse>(
          `getAllRegisters?page=${getUsers.page}&size=${getUsers.size}`
        );
        users.value = data;
        initalized.value = true;

        return users.value;
      }
      return users.value;
    } catch (error: any) {
      error.value = error.message || "An error occurred while fetching users";
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getRegisterUsersById = async (id: number) => {
    try {
      if (loading.value) {
        while (loading.value) {
          await new Promise((_) => setTimeout(_, 100));
        }
        return users.value;
      }

      if (!initalized.value) {
        loading.value = true;
        clearError();
        resetInitialization();
        const authReady = await waitForAuth();
        if (!authReady) {
          throw new Error("User is not authenticated");
        }

        const { $userAPI } = useNuxtApp();
        const { data } = await $userAPI.get(`getRegisterDataById/${id}`);
        user.value = data;
        initalized.value = true;
      }
      return user.value;
    } catch (error: any) {
      error.value = error.message || "An error occurred while fetching users";
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const approveUser = async (
    credential: RegisterCredentials
  ): Promise<void> => {
    try {
      loading.value = true;
      clearError();

      const authReady = await waitForAuth();
      if (!authReady) {
        throw new Error("User is not authenticated");
      }

      const { $userAPI } = useNuxtApp();
      await $userAPI.post<RegisterCredentials>(
        `updateRegisterData`,
        credential
      );
      initalized.value = true;
    } catch (error: any) {
      error.value = error.message || "An error occurred while approving user";
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateRegister = async (
    credentials: RegisterCredentials
  ): Promise<void> => {
    try {
      loading.value = true;
      clearError();

      const authReady = await waitForAuth();
      if (!authReady) {
        throw new Error("User is not authenticated");
      }

      const { $userAPI } = useNuxtApp();
      const { data } = await $userAPI.patch<RegisterCredentials>(
        `updateRegisterData`,
        credentials
      );
      initalized.value = true;
    } catch (error: any) {
      error.value =
        error.message || "An error occurred while updating register";
    } finally {
      loading.value = false;
    }
  };

  const deleteRegister = async (id: number) => {
    try {
      loading.value = true;
      clearError();

      const authReady = await waitForAuth();
      if (!authReady) {
        throw new Error("User is not authenticated");
      }

      const { $userAPI } = useNuxtApp();
      const { data } = await $userAPI.delete(`deleteRegisterDataById/${id}`);
      initalized.value = true;
    } catch (error: any) {
      error.value =
        error.message || "An error occurred while deleting register";
    } finally {
      loading.value = false;
    }
  };

  return {
    //state
    credential,
    error,
    loading,
    initalized,
    user,
    users,

    //getters
    getUsers,
    getUser,
    getCredential,
    getError,
    getLoading,
    getInitialized,

    //actions
    registerUser,
    getRegisterUsers,
    getRegisterUsersById,
    approveUser,
    updateRegister,
    deleteRegister,
  };
});
