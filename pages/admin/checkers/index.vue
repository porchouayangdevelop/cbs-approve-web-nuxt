<template>
  <div class="p-6">
    <DataTable
      :data="userData"
      :columns="userColumns"
      :loading="loading || storeLoading"
      :error="error"
      :filters="userFilters"
      :row-actions="getUserRowActions"
      title="System Users"
      description="Manage and organize system users"
      create-button-text="Add User"
      search-placeholder="Search users by name or email..."
      search-key="firstName"
      empty-title="No users found"
      empty-description="Get started by creating your first user"
      item-name="users"
      :show-debug="$nuxt.$dev"
      @create="handleCreateUser"
      @refresh="handleRefreshUsers"
      @export="handleExportUsers"
      @action="handleUserAction"
    >
      <!-- Custom cell templates -->
      <template #firstName-cell="{ row }">
        <div class="flex items-center space-x-3">
          <UAvatar
            :alt="`${row.original.firstName} ${row.original.lastName}`"
            size="sm"
            :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(row.original.firstName + ' ' + row.original.lastName)}`"
          />
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ row.original.firstName }} {{ row.original.lastName }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ row.original.email }}
            </p>
          </div>
        </div>
      </template>

      <template #username-cell="{ row }">
        <div class="uppercase font-mono">
          {{ row.getValue("username") }}
        </div>
      </template>

      <template #enabled-cell="{ row }">
        <UBadge
          :color="row.getValue('enabled') === 'Active' ? 'green' : 'red'"
          variant="soft"
        >
          {{ row.getValue("enabled") }}
        </UBadge>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { useSystemUserStore } from "~/store/systemUserStore";
import DataTable from "~/components/common/DataTables.vue";

definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

const router = useRouter();
const toast = useToast();

const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
const token = useCookie("access_token").value;

const store = useSystemUserStore();
const {
  users,
  loading: storeLoading,
  error,
  isInitialized,
} = storeToRefs(useSystemUserStore());
const { getUsers } = store;

// Local state
const loading = ref(false);

// Transform users data for table display
const userData = computed(() => {
  if (!users.value || users.value.length === 0) return [];

  return users.value.map((u, index: number) => ({
    id: u.id,
    index: index + 1,
    username: u.username,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    emailVerified: u.emailVerified,
    enabled: u.enabled ? "Active" : "Inactive",
    createdTimestamp: u.createdTimestamp,
  }));
});

// Table configuration
const userColumns = [
  {
    accessorKey: "index",
    header: "#",
    cellType: "text",
    sortable: false,
  },
  {
    accessorKey: "firstName",
    header: "Name",
    cellType: "avatar",
    subField: "email",
    sortable: true,
  },
  {
    accessorKey: "username",
    header: "Username",
    cellType: "text",
    sortable: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    cellType: "text",
    sortable: true,
  },
  {
    accessorKey: "enabled",
    header: "Status",
    cellType: "badge",
    colorMap: {
      Active: "green",
      Inactive: "red",
    },
    sortable: true,
  },
  {
    accessorKey: "createdTimestamp",
    header: "Created",
    cellType: "date",
    sortable: true,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cellType: "actions",
    sortable: false,
  },
];

const userFilters = [
  {
    key: "enabled",
    type: "select",
    placeholder: "Filter by status",
    options: ["Active", "Inactive"],
  },
];

const cleanFilters = () => {
  userFilters.forEach((filter) => {
    filter.value = "";
  });
};

// Methods
const getUserRowActions = (row: any, index: number) => {
  return [
    [
      {
        label: "View",
        icon: "i-heroicons-eye",
        onSelect: () => handleUserAction("view", row, index),
      },
    ],
    [
      {
        label: "Edit user",
        icon: "i-heroicons-pencil-square",
        onSelect: () => handleUserAction("edit", row, index),
      },
    ],
    [
      {
        label: "Assign Role",
        icon: "i-heroicons-user-group",
        onSelect: () => handleUserAction("assign-role", row, index),
      },
    ],
    [
      {
        label: "Delete user",
        icon: "i-heroicons-trash",
        onSelect: () => handleUserAction("delete", row, index),
      },
    ],
  ];
};

// Event handlers
const handleCreateUser = () => {
  router.push("/admin/users/create");
};

const handleRefreshUsers = async () => {
  try {
    loading.value = true;
    setTimeout(() => (loading.value = true), 1500);
    await getUsers();
  } catch (error) {
    toast.add({
      title: "Refresh failed",
      description: "Failed to refresh user list",
      color: "error",
    });
  } finally {
    setTimeout(() => (loading.value = false), 1500);
  }
};

const handleExportUsers = (selectedUsers: any[]) => {
  // Create CSV content
  const headers = [
    "Index",
    "First Name",
    "Last Name",
    "Username",
    "Email",
    "Status",
    "Created At",
  ];
  const csvContent = [
    headers.join(","),
    ...selectedUsers.map((user) =>
      [
        user.index,
        user.firstName,
        user.lastName,
        user.username,
        user.email,
        user.enabled,
        new Date(parseInt(user.createTimestamp)).toLocaleDateString(),
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
    description: `Exported ${selectedUsers.length} users`,
    color: "success",
  });
};

const handleUserAction = (action: string, user: any, index: number) => {
  switch (action) {
    case "view":
      router.push(`/admin/users/${user.id}`);
      break;
    case "edit":
      router.push(`/admin/users/${user.id}/edit`);
      break;
    case "assign-role":
      console.log("Assign role to user:", user);
      toast.add({
        title: "Feature Coming Soon",
        description: "Role assignment feature will be available soon",
      });
      break;
    case "delete":
      console.log("Delete user:", user);
      toast.add({
        title: "Delete User",
        description: "Delete functionality will be implemented",
      });
      break;
  }
};

// Initialize data
const initializeData = async () => {
  try {
    if (!isAuthenticated.value) {
      await navigateTo("/auth/login");
      return;
    }

    if (!isInitialized.value) {
      await getUsers();
    }
  } catch (error) {
    console.error("Error initializing data:", error);
    toast.add({
      title: "Load failed",
      description: "Failed to load users",
      color: "error",
    });
  }
};

// Lifecycle
onMounted(() => {
  initializeData();
});

watch(
  [isAuthenticated, isAuthLoading],
  ([authenticated, authLoading]) => {
    if (!authLoading && authenticated && !isInitialized.value) {
      initializeData();
    }
  },
  { immediate: true }
);

// SEO
useSeoMeta({
  title: "User Management - Admin",
  description: "Manage system users, roles and permissions",
});
</script>
