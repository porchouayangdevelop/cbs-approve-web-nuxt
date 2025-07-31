import type { BranchCodeItems, SubBranchCodeItems } from "~/types/index";

export const useBranchStore = defineStore("branchStore", () => {
  //state
  const branchItems = ref<BranchCodeItems[]>([]);
  const subBranchItems = ref<SubBranchCodeItems[]>([]);
  const loading = ref(false);
  const initalized = ref(false);
  const error = ref<string | null>(null);

  //getters
  const getBranchItems = computed(() => branchItems.value);
  const getSubBranchItems = computed(() => subBranchItems.value);
  const isLoading = computed(() => loading.value);
  const isInitialized = computed(() => initalized.value);
  const isError = computed(() => error.value);

  //actions
  const clearError = () => (error.value = null);

  const fetchBranchItem = async (): Promise<BranchCodeItems[]> => {
    try {
      if (loading.value) {
        while (loading.value) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return branchItems.value;
      }
      loading.value = true;
      clearError();
      const { $branchAPI } = useNuxtApp();

      const { data } = await $branchAPI.get<BranchCodeItems[]>(`branches`);
      const dataAr = Array.isArray(data) ? data : data;

      branchItems.value.length = 0;
      branchItems.value.push(...dataAr);
      initalized.value = true;

      return branchItems.value;
    } catch (e: any) {
      console.error("❌ Error fetching roles:", e);
      error.value = e.message || "An error occurred while fetching roles";

      if (e.response?.status === 401 || e.response?.status === 403) {
        branchItems.value.length = 0;
      }

      throw e;
    } finally {
      loading.value = false;
    }
  };
  const fetchSubBranchItem = async (
    subBranchCode: string
  ): Promise<SubBranchCodeItems[]> => {
    try {
      if (loading.value) {
        while (loading.value) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return subBranchItems.value;
      }
      loading.value = true;
      clearError();
      const { $branchAPI } = useNuxtApp();

      const { data } = await $branchAPI.get<SubBranchCodeItems[]>(
        `branches/sub-branch/${subBranchCode}`
      );
      const dataAr = Array.isArray(data) ? data : data;

      subBranchItems.value.length = 0;
      subBranchItems.value.push(...dataAr);
      initalized.value = true;

      return subBranchItems.value;
    } catch (e: any) {
      console.error("❌ Error fetching roles:", e);
      error.value = e.message || "An error occurred while fetching roles";

      if (e.response?.status === 401 || e.response?.status === 403) {
        branchItems.value.length = 0;
      }

      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    //state
    branchItems,
    subBranchItems,
    loading,
    error,
    initalized,

    //getters
    getBranchItems,
    getSubBranchItems,
    isLoading,
    isInitialized,
    isError,

    //methods
    fetchBranchItem,
    fetchSubBranchItem,
  };
});
