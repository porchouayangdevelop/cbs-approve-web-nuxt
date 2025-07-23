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
    <div
      v-if="shouldShowLoading"
      class="flex items-center justify-center py-12"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">
          {{ loadingMessage }}
        </p>
      </div>
    </div>

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

    <!-- Empty state when no auth -->
    <div v-else-if="!isAuthenticated" class="text-center py-12">
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

    <!-- Main Content -->
    <div v-else-if="dataReady">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            System Users
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Manage and organize system users
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <UButton
            @click="refreshUsers"
            :loading="loading"
            variant="outline"
            icon="i-heroicons-arrow-path"
          >
            Refresh
          </UButton>
          <UButton
            @click="createUser"
            icon="i-heroicons-user-plus"
            class="cursor-pointer"
          >
            Add User
          </UButton>

          <!-- <UButton @click="openModal"> Open Modal </UButton> -->
        </div>
      </div>

      <!-- Users Table -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div class="flex px-4 py-3 5 border-b border-accented">
          <UInput
            v-model="globalFilter"
            placeholder="Search users"
            class="max-w-sm"
            icon="i-heroicons-magnifying-glass"
          />
        </div>
        <UTable
          :columns="userColumns"
          :data="userData"
          :loading="loading"
          v-model:column-pinning="columnPinning"
          v-model:pagination="pagination"
          v-model:global-filter="globalFilter"
          ref="table"
        >
          <template #username-cell="{ row }">
            <div class="uppercase font-mono">
              {{ row.getValue("username") }}
            </div>
          </template>
          <template #lastName-cell="{ row }">
            <div class="uppercase font-mono">
              {{ row.getValue("lastName") }}
            </div>
          </template>
          <template #email-cell="{ row }">
            <div class="uppercase font-mono">
              {{ row.getValue("email") ? row.getValue("email") : "N/A" }}
            </div>
          </template>
          <template #assignRole-cell="{ row }">
            <UButton
              size="small"
              class="px-[.3rem]"
              variant="outline"
              icon="i-heroicons-user-group"
              @click="assignRole(row)"
            >
              Assign
            </UButton>
          </template>
          <template #action-cell="{ row }">
            <UDropdownMenu :items="getDropdownActions(row.original)">
              <UButton
                icon="i-heroicons-ellipsis-vertical"
                color="neutral"
                variant="ghost"
                aria-label="Actions"
              />
            </UDropdownMenu>
          </template>
        </UTable>

        <div class="flex justify-end border-t border-default pt-4">
          <UPagination
            :default-page="
              (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
            "
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>

        <!-- Table Footer -->
        <div
          v-if="filteredUserData.length > 0"
          class="px-4 py-3 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Showing {{ filteredUserData.length }} of
              {{ userData.length }} users
            </p>
            <div class="flex items-center space-x-2">
              <UButton
                @click="exportUsers"
                variant="outline"
                size="sm"
                icon="i-heroicons-arrow-down-tray"
                class="cursor-pointer"
              >
                Export
              </UButton>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!loading" class="text-center py-12">
          <UIcon
            name="i-heroicons-users"
            class="w-12 h-12 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No users found
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{
              searchQuery || selectedStatus || selectedRole
                ? "Try adjusting your filters"
                : "Get started by creating your first user"
            }}
          </p>
          <UButton
            @click="createUser"
            icon="i-heroicons-user-plus"
            class="cursor-pointer"
          >
            Add User
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

import { useSystemUserStore } from "~/store/systemUserStore";
// import type { User } from "~/store/systemUserStore";
import { h, resolveComponent } from "vue";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Column, getPaginationRowModel } from "@tanstack/vue-table";
import { useClipboard } from "@vueuse/core";
import { LazyModalsModalExample } from "#components";

type User = {
  id?: string;
  index: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  createTimestamp: string;
};

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const table = useTemplateRef("table");

const overlay = useOverlay();
const modal = overlay.create(LazyModalsModalExample);

const { copy } = useClipboard();

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

// Local state
const loading = ref(false);
const searchQuery = ref("");
const selectedStatus = ref("");
const selectedRole = ref("");
const selectedUsers = ref<any[]>([]);
const globalFilter = ref("");

const loadingMessage = computed(() => {
  if (!isAuthenticated.value) return "Authenticating...";
  if (loading.value && !isInitialized.value) return "Loading users...";
  if (storeLoading.value) return "Refreshing users...";
  return "Loading";
});

const shouldShowLoading = computed(
  () => (isAuthLoading.value || storeLoading.value) && !isInitialized.value
);

const dataReady = computed(() => {
  return (
    isAuthenticated.value &&
    !isAuthLoading.value &&
    !shouldShowLoading.value &&
    isInitialized.value
  );
});

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

// Filtered data based on search and filters
const filteredUserData = computed(() => {
  let filtered = [...userData.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter((user) => user.enabled === selectedStatus.value);
  }

  // Role filter (you might need to add role data to the user object)
  if (selectedRole.value) {
    // This would require role information in your user data
    // filtered = filtered.filter((user) => user.role === selectedRole.value);
  }

  return filtered;
});

// Table columns configuration
const userColumns: TableColumn<User>[] = [
  {
    accessorKey: "index",
    header: ({ column }) => getHeader(column, "#", "left"),
    cell: ({ row }) => `${row.getValue("index")}`,
  },
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => getHeader(column, "#", "left"),
  //   cell: ({ row }) => `#${row.getValue("id")}`,
  // },
  {
    accessorKey: "username",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        class: "ml-2",
        label: "Username",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });

      // return getHeader(column, "Username", "left");
    },
    cell: ({ row }) => row.getValue("username"),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => getHeader(column, "First Name", "left"),
    cell: ({ row }) => row.getValue("firstName"),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => getHeader(column, "Last Name", "left"),
    cell: ({ row }) => row.getValue("lastName"),
  },

  {
    accessorKey: "email",
    header: ({ column }) => getHeader(column, "Email", "left"),
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "enabled",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        class: "ml-2",
        label: "Status",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => {
      const color = {
        Active: "success" as const,
        Inactive: "error" as const,
      }[row.getValue("enabled") as string];
      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("enabled")
      );
    },
  },
  // {
  //   accessorKey: "createdTimestamp",
  //   header: ({ column }) => getHeader(column, "Created", "left"),
  //   cell: ({ row }) => formatDate(row.getValue("createdTimestamp")),
  // },
  {
    id: "assignRole",
    accessorKey: "AssignRole",
  },
  {
    id: "action",
    accessorKey: "Action",
    cell: ({ row }) => getDropdownActions(row.original),
  },
];

const getHeader = (
  column: Column<User>,
  label: string,
  position: "left" | "right"
) => {
  const isPinned = column.getIsPinned();

  return h(UButton, {
    color: "neutral",
    variant: "ghost",
    label,
    icon: isPinned ? "i-lucide-pin-off" : "i-lucide-pin",
    class: "-mx-2.5",
    click() {
      column.pin(isPinned === position ? false : position);
    },
  });
};

const assignRoleAction = (user: User) => {
  const instance = modal.open({
    title: "Assign Role",
    content: "",
    okText: "OK",
    cancelText: "Cancel",
    data: {
      user,
    },
    onOk: () => {
      toast.add({
        title: "Success",
        description: "Operation successful",
      });
    },
    onCancel: () => {
      toast.add({
        title: "Cancel",
        description: "Operation cancelled",
      });
    },
  });
};

const getDropdownActions = (user: User): DropdownMenuItem[][] => {
  return [
    // [
    //   {
    //     label: "Copy email",
    //     icon: "i-heroicons-document-duplicate",
    //     onSelect: () => {
    //       copy(user.email);

    //       toast.add({
    //         title: "Email copied",
    //         color: "success",
    //         icon: "i-heroicons-clipboard-check",
    //       });
    //     },
    //   },
    // ],
    [
      {
        label: "AssignRole",
        icon: "i-heroicons-user-group",
        onSelect: () => {
          assignRole(user);
        },
      },
    ],
    [
      {
        label: "view",
        icon: "i-heroicons-eye",
        onSelect: () => {
          viewUser(user);
        },
      },
    ],
    [
      {
        label: "Edit user",
        icon: "i-heroicons-pencil-square",
        onSelect: () => {
          editUser(user);
        },
      },
    ],
    [
      {
        label: "Delete user",
        icon: "i-heroicons-trash",
        onSelect: () => {
          deleteUser(user);
        },
      },
    ],
  ];
};

const columnPinning = ref({
  left: [],
  right: [],
});

// pagination
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
  total: 0,
});

// Methods

const openModal = () => {
  const instance = modal.open({
    title: "Assign Role",
    content: "",
    okText: "OK",
    cancelText: "Cancel",
    data: {},
    onOk: () => {
      toast.add({
        title: "Success",
        description: "Operation successful",
      });
    },
    onCancel: () => {
      toast.add({
        title: "Cancel",
        description: "Operation cancelled",
      });
    },
  });
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(parseInt(dateString)).toLocaleDateString();
};

const gotoLogin = () => {
  router.push("/auth/login");
};

const createUser = () => {
  router.push("/admin/users/create");
};

const viewUser = (user: any) => {
  router.push(`/admin/users/${user.id}`);
};

const editUser = (user: any) => {
  router.push(`/admin/users/${user.id}/edit`);
};

const assignRole = (user: any) => {
  assignRoleAction(user.original);

  // toast.add({
  //   title: "Feature Coming Soon",
  //   description: "Role assignment feature will be available soon",
  // });
};

const resetPassword = (user: any) => {
  console.log("Reset password for user:", user);
  toast.add({
    title: "Password Reset",
    description: `Password reset initiated for ${user.firstName}`,
  });
};

const deleteUser = (user: any) => {
  console.log("Delete user:", user);
  // Implement delete confirmation modal
  toast.add({
    title: "Delete User",
    description: "Delete functionality will be implemented",
  });
};

const exportUsers = () => {
  const dataToExport =
    selectedUsers.value.length > 0
      ? selectedUsers.value
      : filteredUserData.value;

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
    ...dataToExport.map((user) =>
      [
        user.index,
        user.firstName,
        user.lastName,
        user.username,
        user.email,
        user.enabled,
        formatDate(user.createTimestamp),
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

// Debug watchers (development only)
if (process.dev) {
  watch(
    users,
    (newUsers) => {
      console.log("users changed:", newUsers?.length || 0);
    },
    { immediate: true }
  );

  watch(
    userData,
    (newUserData) => {
      console.log("userData changed:", newUserData?.length || 0);
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

// SEO
useSeoMeta({
  title: "User Management - Admin",
  description: "Manage system users, roles and permissions",
});
</script>
