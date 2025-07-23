<script setup lang="ts">
definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

import { h, resolveComponent } from "vue";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Column, getPaginationRowModel } from "@tanstack/vue-table";
import { useClipboard } from "@vueuse/core";
import { useSystemUserStore } from "~/store/systemUserStore";
import LoadingProgressCircle from "~/components/modals/LoadingProgressCircle.vue";

type Role = {
  id: string;
  name: string;
  description: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
};

const store = useSystemUserStore();
const {
  roles,
  error,
  loading: storeLoading,
  isInitialized,
} = storeToRefs(useSystemUserStore());

const { getRoles } = store;

const { user, isLoading: authLoading, isAuthenticated } = useAuth();

// composable
const toast = useToast();
const router = useRouter();

// components
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const table = useTemplateRef("table");

//state
const loading = ref(false);
const globalFilter = ref("");
const selectRole = ref("");

const itemsPerPage = ref(10);
const currentPage = ref(1);

// reactive data
const loadingMessage = computed(() => {
  if (!isAuthenticated.value) return "Authenticating...";
  if (loading.value && !isInitialized.value) return "Loading roles...";
  if (storeLoading.value) return "Refreshing roles...";
  return "Loading...";
});

const shouldShowLoading = computed(
  () => (isAuthenticated.value || storeLoading.value) && !isInitialized.value
);

const dataReady = computed(() => {
  return (
    isAuthenticated.value &&
    !authLoading.value &&
    !shouldShowLoading.value &&
    isInitialized.value
  );
});

const roleData = computed(() => {
  if (!user.value || roles.value.length === 0) return [];

  return roles.value.map((u, index: number) => {
    return {
      index: index + 1,
      ...u,
    };
  });
});

const roleColumns: TableColumn<Role>[] = [
  {
    accessorKey: "index",
    header: ({ column }) => getHeader(column, "Index", "left"),
    cell: ({ row }) => `${row.getValue("index")}`,
  },
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => getHeader(column, "Role ID", "left"),
  //   cell: ({ row }) => `${row.getValue("id")}`,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => getHeader(column, "Role Name", "left"),
    cell: ({ row }) => `${row.getValue("name")}`,
  },
  {
    accessorKey: "description",
    header: ({ column }) => getHeader(column, "Role Description", "left"),
    cell: ({ row }) => `${row.getValue("description")}`,
  },
  {
    accessorKey: "composite",
    header: ({ column }) => getHeader(column, "Composite", "left"),
    cell: ({ row }) => `${row.getValue("composite") ? "Yes" : "No"}`,
  },
  {
    accessorKey: "clientRole",
    header: ({ column }) => getHeader(column, "Client Role", "left"),
    cell: ({ row }) => `${row.getValue("clientRole") ? "Yes" : "No"}`,
  },
  // {
  //   accessorKey: "containerId",
  //   header: ({ column }) => getHeader(column, "Container ID", "left"),
  //   cell: ({ row }) => `${row.getValue("containerId")}`,
  // },
  {
    id: "action",
    accessorKey: "actions",
    header: () =>
      h(
        "div",
        {
          // color: "neutral",
          // variant: "ghost",
          // icon: "i-lucide-menu",
          class: "text-right",
        },
        "Actions"
      ),
  },
];

const totalItems = computed(() => filteredRoleData.value.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);
const startItem = computed(() => {
  if (totalItems.value === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, totalItems.value);
});

const getHeader = (
  column: Column<Role>,
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
    onClick() {
      column.pin(isPinned === position ? false : position);
    },
  });
};

const DropdownMenuActions = (role: Role): DropdownMenuItem[][] => {
  return [
    [
      {
        label: "Edit",
        icon: "i-heroicon-s-pencil",
        click: () => {
          router.push(`/admin/roles/${role.id}`);
        },
      },
    ],
  ];
};

const columnPinning = ref({
  left: [],
  right: ["actions"],
});

const pagination = ref({
  pageSize: itemsPerPage.value,
  pageIndex: currentPage.value - 1,
  total: 0,
});

const filteredRoleData = computed(() => {
  let filtered = [...roleData.value];

  // Search filter
  if (globalFilter.value) {
    const query = globalFilter.value.toLowerCase();
    filtered = filtered.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        (role.description || "").toLowerCase().includes(query) ||
        role.id.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Paginated data for display
const paginatedRoleData = computed(() => {
  console.log(
    `Computing paginated data: page ${currentPage.value}, size ${itemsPerPage.value}`
  );
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  const result = filteredRoleData.value.slice(startIndex, endIndex);
  console.log(
    `Showing items ${startIndex + 1} to ${Math.min(endIndex, filteredRoleData.value.length)} of ${filteredRoleData.value.length}`
  );
  return result;
});

// methoads
const newRole = () => {
  router.push("/admin/roles/create");
};

const viewRole = (row: any) => {
  router.push(`/admin/roles/${row.original.id}`);
};

const editRole = (row: any) => {
  router.push(`/admin/roles/edit/${row.original.id}`);
};

const deleteRole = (row: any) => {
  deleteRole(row.original.id);
};

const refreshData = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await getRoles();
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    toast.add({
      title: "Failed to fetch roles",
      description: "Please try again later",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

const exportRoles = () => {
  const dataToExport =
    selectRole.value.length > 0
      ? roles.value.filter((role) => role.id === selectRole.value)
      : roles.value;

  // Create CSV content
  const headers = [
    "Index",
    "Role ID",
    "Role Name",
    "Role Description",
    "Composite",
    "Client Role",
    "Container ID",
  ];
  const csvContent = [
    headers.join(","),
    ...dataToExport.map((role: any) =>
      [
        role.index,
        role.name,
        role.description,
        role.composite,
        role.clientRole,
        role.containerId,
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
    description: `Exported ${dataToExport.length} roles`,
    color: "success",
  });
};

const updatePaginationSize = (newSize: number) => {
  itemsPerPage.value = newSize;
  currentPage.value = 1; // Reset to first page when changing page size

  // Update pagination object for any components that might need it
  pagination.value.pageSize = newSize;
  pagination.value.pageIndex = 0;

  console.log(
    `Page size updated to: ${newSize}, Total pages: ${totalPages.value}`
  );
};

const handlePageChange = (page: number) => {
  console.log(`Page change requested: ${page}, Current: ${currentPage.value}`);
  currentPage.value = page;
  pagination.value.pageIndex = page - 1;

  // Force reactivity update
  nextTick(() => {
    console.log(
      `Page changed to: ${currentPage.value}, showing items ${startItem.value} to ${endItem.value}`
    );
  });
};

const initializeFetchRole = async () => {
  try {
    if (!isAuthenticated.value) {
      await navigateTo("/auth/login");
      return;
    }
    if (!isInitialized.value) {
      await getRoles();
    }
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    toast.add({
      title: "Failed to fetch roles",
      description: "Please try again later",
      color: "error",
    });
  }
};

// lifecycle hooks
onMounted(async () => {
  initializeFetchRole();
});

// watchers

watch(
  [isAuthenticated, authLoading],
  ([authenticated, authLoading]) => {
    if (!authLoading && authenticated && !isInitialized.value) {
      initializeFetchRole();
    }
  },
  { immediate: true }
);

watch(globalFilter, () => {
  currentPage.value = 1;
  pagination.value.pageIndex = 0;
});

// watch([itemsPerPage, currentPage], () => {
//   pagination.value.pageSize = itemsPerPage.value;
//   pagination.value.pageIndex = currentPage.value - 1;
// });

// Watch for data changes to ensure pagination is within bounds
watch([filteredRoleData, itemsPerPage], () => {
  const maxPage =
    Math.ceil(filteredRoleData.value.length / itemsPerPage.value) || 1;
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage;
    pagination.value.pageIndex = maxPage - 1;
  }
});

if (process.dev) {
  watch(roles, (newRoles) => {}, { immediate: true });

  watch(
    isInitialized,
    (newIsInitialized) => {
      console.log("isInitialized:", newIsInitialized);
    },
    { immediate: true }
  );

  watch(
    roleData,
    (newRoleData) => {
      if (newRoleData.length > 0) {
        console.log("roles changed:", newRoleData?.length || 0);
      }
    },
    { immediate: true }
  );
}
</script>

<template>
  <div class="space-y-6">
    <!--Loading state -->
    <div
      v-if="shouldShowLoading"
      class="flex justify-center items-center py-12"
    >
      <div class="text-center">
        <div
          class="flex items-center justify-center animate-spin rounded-full h-30 w-30 border-b-2 border-primary-600 mx-auto mb-4"
        ></div>
        <span class="text-gray-600 dark:text-gray-400">{{
          loadingMessage
        }}</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error && !loading" class="text-center py-12">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-12 h-12 text-red-400 mx-auto mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Failed to load users
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <UButton @click="refreshData" :loading="loading"> Try Again </UButton>
    </div>

    <!-- Empty state -->
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
      <UButton @click="navigateTo('/auth/login')"> Go to Login </UButton>
    </div>

    <!-- Main content -->
    <div v-else-if="dataReady">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex flex-col items-start">
          <h2 class="text-2xl font-bold">Role Management</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Manage roles and permissions for users
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <u-button
            :loading="loading"
            variant="outline"
            icon="i-heroicons-arrow-path"
            @click="refreshData"
            >reload</u-button
          >
          <u-button icon="i-heroicons-plus" @click="newRole">New Role</u-button>
        </div>
      </div>

      <!-- Roles table -->
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

        <u-table
          :columns="roleColumns"
          :data="paginatedRoleData"
          :loading="loading"
          v-model:column-pinning="columnPinning"
          v-model:pagination="pagination"
          v-model:global-filter="globalFilter"
          ref="table"
          size="sm"
          :ui="{
            base: 'w-full',
            td: 'py-1 px-3 border-b border-gray-200 dark:border-gray-700',
            th: 'py-1 px-3',
          }"
        >
          <template #description-cell="{ row }">
            {{
              row.getValue("description") ? row.getValue("description") : "N/A"
            }}
          </template>

          <template #composite-cell="{ row }">
            <u-badge
              variant="info"
              :color="row.getValue('composite') ? 'success' : 'danger'"
            >
              {{ row.getValue("composite") ? "Yes" : "No" }}
            </u-badge>
          </template>

          <template #action-cell="{ row }">
            <div class="flex justify-end items-center gap-1">
              <u-button
                icon="i-heroicons-eye"
                variant="outline"
                size="xs"
                color="info"
                @click="viewRole(row)"
                class="cursor-pointer"
              >
                View
              </u-button>
              <u-button
                variant="outline"
                size="xs"
                icon="i-heroicons-pencil"
                class="cursor-pointer"
                color="warning"
                @click="editRole(row)"
              >
                Edit
              </u-button>
              <u-button
                variant="outline"
                size="xs"
                color="error"
                icon="i-heroicons-trash"
                class="cursor-pointer"
                @click="deleteRole(row)"
              >
                Delete
              </u-button>
            </div>
          </template>
        </u-table>

        <div
          class="flex justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >Show:</span
              >
              <USelectMenu
                v-model="itemsPerPage"
                :items="[5, 10, 20, 50, 100]"
                size="sm"
                class="w-20"
                @change="updatePaginationSize(itemsPerPage)"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >per page</span
              >
            </div>

            <!-- <p class="text-sm text-gray-600 dark:text-gray-400">
              Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} roles
            </p> -->
          </div>

          <UPagination
            v-model="currentPage"
            :page-count="totalPages"
            :total="totalItems"
            size="sm"
            :max="7"
            :show-last="true"
            :show-first="true"
            @update:model-value="handlePageChange(currentPage)"
          />
        </div>

        <!-- <div class="flex justify-end border-t border-default pt-4">
          <UPagination
            :default-page="
              (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
            "
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
          />
          <UPagination
            v-model="currentPage"
            :page-count="itemsPerPage"
            :total="totalItems"
            size="sm"
            :max="7"
            :show-last="true"
            :show-first="true"
          />
        </div> -->

        <!-- Table Footer -->
        <div
          v-if="filteredRoleData.length > 0"
          class="px-4 py-3 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} roles
              (Page {{ currentPage }} of {{ totalPages }})
            </p>
            <div class="flex items-center space-x-2">
              <UButton
                @click="exportRoles"
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
              globalFilter
                ? "Try adjusting your filters"
                : "Get started by creating your first role"
            }}
          </p>
          <UButton
            @click="newRole"
            icon="i-heroicons-user-plus"
            class="cursor-pointer"
          >
            Add Role
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
