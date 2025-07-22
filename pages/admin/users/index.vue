<template>
  <div class="space-y-6 p-6">
    <!-- Debug information (remove in production) -->
    <div
      v-if="$nuxt.$dev"
      class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
    >
      <h3 class="font-bold mb-2">Debug Info:</h3>
      <p>Auth Loading: {{ isAuthLoading }}</p>
      <p>Store Loading: {{ loading }}</p>
      <p>Store Initialized: {{ isInitialized }}</p>
      <p>Error: {{ error }}</p>
      <p>Raw users count: {{ users?.length || 0 }}</p>
      <p>Transformed userData count: {{ userData?.length || 0 }}</p>
      <p>Auth Token exists: {{ !!token }}</p>
      <p>User authenticated: {{ isAuthenticated }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="sholdShowLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">
          {{ loadingMessage }}
        </p>
      </div>
    </div>

    <div v-else-if="dataReady"></div>

    <!-- Error State -->
    <div v-else-if="error && !loading" class="text-center py-12">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-12 h-12 text-red-400 mx-auto mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Failed to load users
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <UButton @click="refreshUsers" :loading="loading"> Try Again </UButton>
    </div>

    <div v-else-if="dataReady">
      {{ userData }}
    </div>

    <!-- Empty state when no auth -->
    <div v-else class="text-center py-12">
      <UIcon
        name="i-heroicons-shield-exclamation"
        class="w-12 h-12 text-yellow-400 mx-auto mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Authentication Required
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Please log in to access user management
      </p>
      <UButton @click="gotoLogin"> Go to Login </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

import BaseTable from "~/components/common/BaseTable.vue";
import { useSystemUserStore } from "~/store/systemUserStore";
import type { User } from "~/store/systemUserStore";

const router = useRouter();

const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
const token = useCookie("access_token").value;

const toast = useToast();

const store = useSystemUserStore();
const {
  users,
  loading: storeLoading,
  error,
  isInitialized,
} = storeToRefs(useSystemUserStore());
const { getUsers, getRoles, getRole } = store;

//local state
const loading = ref(false);
const searchQuery = ref("");
const selectedStatus = ref("");
const statusFilter = ref("");
const emailFilter = ref("");
const sortBy = ref("");
const showAdvancedFilters = ref(false);
const currentPage = ref(1);
const pageSize = 10;
const selectedUsers = ref<User[]>([]);

const loadingMessage = computed(() => {
  if (isAuthenticated.value) return "Authenting....";
  if (loading.value && !isInitialized.value) return "Loading users...";
  if (storeLoading.value) return "Refresh users...";
  return "Loading";
});

const sholdShowLoading = computed(
  () => (isAuthLoading.value || storeLoading.value) && !isInitialized.value
);

const dataReady = computed(() => {
  return (
    isAuthenticated.value &&
    !isAuthLoading.value &&
    !sholdShowLoading.value &&
    isInitialized.value
  );
});

const statusOptions = ref([
  { label: "All", value: null },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
]);
const sortOption = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Status", value: "enabled" },
  { label: "Created At", value: "createTimestamp" },
];

const userData = computed(() => {
  if (!users.value || users.value.length === 0) return [];

  return users.value.map((u, index: number) => {
    return {
      id: index + 1,
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.username,
      email: u.email,
      emailVerified: u.emailVerified,
      enabled: u.enabled ? "Active" : "InActive",
      createTimestamp: u.createTimestamp,
    };
  });
});

const userFilters = [
  {
    key: "status",
    type: "select",
    placeholder: "filter by status",
    options: statusOptions.value,
  },
  {
    key: "role",
    type: "select",
    placeholder: "filter by role",
    options: ["Admin", "User", "Checker"],
  },
];

const userColumns = [
  { key: "idx", label: "#", sortable: true },
  { key: "firstName", label: "First Name", sortable: true },
  { key: "lastName", label: "Last Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "enabled", label: "Status", sortable: true },
  { key: "createdAt", label: "Created At", sortable: true },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
  },
];

const userBulkAcions = [
  {
    label: "Active Users",
    icon: "i-heroicons-check-circle",
    action: (selectedUsers: any[]) => {
      toast.add({
        title: "Users activated",
        description: `${selectedUsers.length} users have been activated`,
        color: "success",
      });
    },
  },
  {
    label: "Deactivate Users",
    icon: "i-heroicons-x-circle",
    action: (selectedUsers: any[]) => {
      toast.add({
        title: "Users deactivated",
        description: `${selectedUsers.length} users have been deactivated`,
        color: "warning",
      });
    },
  },
  {
    label: "Delete Users",
    icon: "i-heroicons-trash",
    action: (selectedUsers: any[]) => {
      toast.add({
        title: "Users deleted",
        description: `${selectedUsers.length} users have been deleted`,
        color: "error",
      });
    },
  },
];

const getUserRowActions = (row: any, index: number) => {
  return [
    {
      label: "assignRole",
      icon: "i-heroicons-user-group",
      onClick: () => assignRole("view", row, index),
    },

    {
      label: "Edit",
      icon: "i-heroicons-pencil",
      onClick: () => editUser("edit", row, index),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash",
      onClick: () => deleteUser("delete", row, index),
    },
    {
      label: "view",
      icon: "i-heroicons-download",
      onClick: () => viewUser("view", row, index),
    },
  ];
};

const getStatusColor = (status: string) => {
  const color: Record<string, string> = {
    Active: "success",
    InActive: "error",
  };
  return color[status];
};

const gotoLogin = () => {
  router.push({ name: "auth-login" });
};

const createUser = () => {
  router.push({ name: "admin-users-create" });
};

const handleSearchUsers = (query: string) => {
  searchQuery.value = query;
};

const handleFilterUsers = (filters: Record<string, any>) => {
  Object.keys(filters).forEach((key) => {
    switch (key) {
      case "status":
        selectedStatus.value = filters[key];
        break;
      default:
      // selectedRole.value = filters[key];
    }
  });
};

const handleSelectUsers = (selectedUsers: any[]) => {};

const handleUserAction = (action: string, user: any, index: number) => {
  switch (action) {
    case "edit":
      editUser(action, user, index);
      break;
    case "view":
      viewUser(action, user, index);
      break;
    case "delete":
      deleteUser(action, user, index);
      break;
    case "assignRole":
      assignRole(action, user, index);
      break;
    default:
      break;
  }
};

const initializedData = async () => {
  try {
    if (!isAuthenticated.value) {
      await navigateTo("/auth/login");
      return;
    }

    if (!isInitialized.value) {
      return await getUsers();
    }
  } catch (error) {
    toast.add({
      title: "Load failed",
      description: "Failed to load users",
      color: "error",
    });
  }
};

const exportUsers = (selectedUsers: any[]) => {
  console.log("Export users:", selectedUsers);
  const dataToExport =
    selectedUsers.length > 0 ? selectedUsers : userData.value;

  // Create CSV content
  const headers = ["Name", "Last Name", "Email", "Status", "Created At"];
  const csvContent = [
    headers.join(","),
    ...dataToExport.map((user) =>
      [
        user.firstName,
        user.lastName,
        user.email,
        user.enabled,
        user.createTimestamp,
      ].join(",")
    ),
  ].join("\n");

  // Download CSV
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  toast.add({
    title: "Export completed",
    description: `Exported ${dataToExport.length} users`,
    color: "success",
  });
};

const assignRole = (type: string, row: any, index: number) => {
  console.log(type, row, index);
};

const editUser = (type: string, row: any, index: number) => {
  router.push({ name: "admin-users-edit", params: { id: row.id } });
};

const viewUser = (type: string, row: any, index: number) => {
  router.push({ name: "admin-users-view", params: { id: row.id } });
};

const deleteUser = (type: string, row: any, index: number) => {
  // Implement delete functionality here
  console.log(`Deleting user with ID: ${row.id}`);
  // You can use a library like Axios to make API requests
};

const refreshUsers = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await getUsers();
    toast.add({
      title: "Users refreshed",
      description: "User list has been updated",
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Error refreshing users",
      description: "An error occurred while refreshing user list",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initializedData();
});

watch(
  [isAuthenticated, isAuthLoading],
  ([authenticated, authloading]) => {
    if (!authloading && authenticated && !isInitialized.value) {
      initializedData();
    }
  },
  { immediate: true }
);

if (process.dev) {
  watch(
    users,
    (newUsers) => {
      console.log("users changed:", newUsers);
    },
    { immediate: true }
  );

  watch(
    userData,
    (newUserdata) => {
      console.log("userdata changed:", newUserdata);
    },
    { immediate: true }
  );

  watch(
    isInitialized,
    (newIsInitialized) => {
      console.log("isInitialized changed:", newIsInitialized);
    },
    { immediate: true }
  );
}
</script>

<style lang="scss" scoped></style>
