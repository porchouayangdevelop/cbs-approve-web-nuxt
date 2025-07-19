<template>
  <div class="space-y-6 p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Manage and organize your team members
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <UButton
          icon="i-heroicons-arrow-down-tray"
          variant="outline"
          @click="exportUsers"
          class="cursor-pointer"
        >
          Export
        </UButton>
        <UButton
          icon="i-heroicons-plus"
          @click="createUser"
          class="cursor-pointer"
        >
          Add User
        </UButton>
      </div>
    </div>

    <!-- Filters & Search -->
    <UCard>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <UInput
            v-model="searchQuery"
            placeholder="Search users..."
            icon="i-heroicons-magnifying-glass"
            size="lg"
          />
        </div>

        <!-- Status Filter -->
        <USelectMenu
          v-model="selectedStatus"
          :items="statusOptions"
          placeholder="Filter by status"
          size="lg"
        />
      </div>
    </UCard>

    <!-- list -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3>User ({{ filteredUsers.length }})</h3>
          <div class="flex items-center space-x-2">
            <UButton
              variant="ghost"
              size="sm"
              icon="i-heroicons-funnel"
              @click="showAdvancedFilters = !showAdvancedFilters"
              >AvanceFilters</UButton
            >
            <UButton
              :loading="loading"
              variant="ghost"
              size="sm"
              icon="i-heroicons-arrow-path"
              @click="refreshUsers"
              >Refresh</UButton
            >
          </div>
        </div>
      </template>

      <!-- Advanced Filters (Collapsible) -->
      <div
        v-show="showAdvancedFilters"
        class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UInput
            v-model="emailFilter"
            placeholder="Filter by email domain"
            icon="i-heroicons-envelope"
          />
          <USelectMenu
            v-model="sortBy"
            :items="sortOption"
            placeholder="Sort by"
          />
        </div>
      </div>

      <UTable
        :data="userData"
        :loading="loading"
        :search-query="searchQuery"
        :searchable-fields="['name', 'lastname', 'email']"
        :head="columns"
        :row="paginatedUsers"
      >
        <templates #status-data="{ row }">
          {{ row.enabled }}
          <UBadge :color="getStatusColor(row.enabled)" variant="soft" />
        </templates>
      </UTable>

      <!-- Pagination -->
      <template #footer>
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to
            {{ Math.min(currentPage * pageSize, filteredUsers.length) }} of
            {{ filteredUsers.length }} users
          </div>
          <UPagination
            v-model="currentPage"
            :page-count="pageSize"
            :total="filteredUsers.length"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

import { useSystemUserStore } from "~/store/systemUserStore";
import type { User } from "~/store/systemUserStore";

const router = useRouter();

const { users, getUsers } = useSystemUserStore();

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
const selectedUser = ref<User | null>(null);

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
  return users.map((user, index: number) => {
    return {
      id: index + 1,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      enabled: user.enabled ? "Active" : "InActive",
      createTimestamp: user.createTimestamp,
    };
  });
});

const filteredUsers = computed(() => {
  let filtered = userData.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }

  // status filter
  if (selectedStatus.value) {
    filtered.filter((user) => user.enabled === selectedStatus.value);
  }

  // email filter
  if (emailFilter.value) {
    filtered.filter((user) =>
      user.email.toLowerCase().includes(emailFilter.value.toLowerCase())
    );
  }

  // sort
  if (sortBy.value) {
    filtered.sort((a, b) => {
      const aValue = a[sortBy.value as keyof User];
      const bValue = b[sortBy.value as keyof User];
      return String(aValue).localeCompare(String(bValue));
    });
  }

  return filtered;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredUsers.value.slice(start, end);
});

const columns = [
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

const actionItems = (user: User) => [
  {
    label: "Edit",
    icon: "i-heroicons-pencil",
    onClick: () => editUser(user.email),
  },
  {
    label: "Delete",
    icon: "i-heroicons-trash",
    onClick: () => deleteUser(user.email),
  },
  {
    label: "view",
    icon: "i-heroicons-download",
    onClick: () => viewUser(user.id),
  },
];

const getStatusColor = (status: string) => {
  const color: Record<string, string> = {
    Active: "success",
    InActive: "error",
  };
  return color[status];
};

const createUser = () => {
  router.push({ name: "admin-users-create" });
};

const exportUsers = () => {
  // Implement export functionality here
  console.log("Exporting users...");
  // You can use a library like FileSaver.js or similar to handle file downloads
};

const editUser = (userId: string) => {
  router.push({ name: "admin-users-edit", params: { id: userId } });
};

const viewUser = (userId: string) => {
  router.push({ name: "admin-users-view", params: { id: userId } });
};

const deleteUser = (userId: string) => {
  // Implement delete functionality here
  console.log(`Deleting user with ID: ${userId}`);
  // You can use a library like Axios to make API requests
};

const refreshUsers = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await getUsers();
  } catch (error) {
    console.error("Error refreshing users:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getUsers();
});
</script>

<style lang="scss" scoped></style>
