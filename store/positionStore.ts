import type { Positions, Departments } from "~/types";
export const usePositionStore = defineStore("positionStore", () => {
  //states
  const positions = ref<Positions[]>([]);
  const departments = ref<Departments[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  //getters
  const getPostitions = computed(() => positions.value);
  const getDepartments = computed(() => departments.value);
  const isLoading = computed(() => loading.value);
  const isError = computed(() => error.value);
  const isInitialized = computed(() => initialized.value);

  //actions
  const clearError = () => (error.value = null);

  const fetchDepartments = async (): Promise<Departments[]> => {
    try {
      if (loading.value) {
        while (loading.value) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return departments.value;
      }

      loading.value = true;
      clearError();

      const { $branchAPI } = useNuxtApp();
      const { data } = await $branchAPI.get<Departments[]>(`departments`);
      const dataAr = Array.isArray(data) ? data : data;

      departments.value.length = 0;
      departments.value.push(...dataAr);
      initialized.value = true;

      return departments.value;
    } catch (e: any) {
      error.value = e instanceof Error ? e.message : "Unknown error";
      error.value = e.message || "An error occurred while fetching departments";
      if (e.response?.status === 401 || e.response?.status === 403) {
        departments.value.length = 0;
      }
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const fetchPositions = async (): Promise<Positions[]> => {
    try {
      if (loading.value) {
        while (loading.value) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return positions.value;
      }
      loading.value = true;
      clearError();

      const { $branchAPI } = useNuxtApp();
      const { data } = await $branchAPI.get<Positions[]>(`positions`);

      const positionData = Array.isArray(data) ? data : data;
      positions.value.length = 0;
      positions.value.push(...positionData);

      initialized.value = true;

      console.log(initialized.value);

      return positions.value;
    } catch (e: any) {
      error.value = e instanceof Error ? e.message : "Unknown error";
      error.value = e.message || "An error occurred while fetching roles";
      if (e.response?.status === 401 || e.response?.status === 403) {
        positions.value.length = 0;
      }
      throw e;
    } finally {
      loading.value = false;
    }
  };

  //return alls

  return {
    //state
    positions,
    departments,
    loading,
    error,
    initialized,

    //getters
    getPostitions,
    getDepartments,
    isLoading,
    isError,
    isInitialized,

    //methods
    fetchDepartments,
    fetchPositions,
  };
});
