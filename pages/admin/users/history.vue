<template>
  <div class="p-6 space-y-6">
    <!-- Basic Usage Example -->
    <div>
      <DataUtable
        title="Users Management"
        description="Manage system users and their permissions"
        :data="users"
        :columns="userColumns"
        :loading="loading"
        :error="error"
        :filters="userFilters"
        :row-actions="getUserRowActions"
        item-name="users"
        search-placeholder="Search users by name or email..."
        :search-keys="['firstName', 'lastName', 'email', 'username', 'status']"
        empty-title="No users found"
        empty-description="Get started by creating your first user"
        create-button-text="Add User"
        @create="handleCreateUser"
        @refresh="handleRefreshUsers"
        @export="handleExportUsers"
        @action="handleUserAction"
        @update:search="handleSearchChange"
        @update:filters="handleFiltersChange"
        @update:sort="handleSortChange"
        @update:itemsPerPage="handleItemsPerPageChange"
        @update:currentPage="handlePageChange"
      >
        <!-- Custom cell templates -->
        <template #firstName-cell="{ row }">
          <div class="">
            <!-- <UAvatar
              :alt="`${row.original.firstName} ${row.original.lastName}`"
              size="sm"
              :src="generateAvatarUrl(row.original)"
            /> -->
            <p class="font-medium text-gray-900 dark:text-white">
              {{ row.original.firstName }} {{ row.original.lastName }}
            </p>
            <!-- <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ row.original.email }}
              </p> -->
            <div></div>
          </div>
        </template>

        <template #username-cell="{ value }">
          <code class=" bg-gray-100 dark:bg-gray-800 rounded text-sm">
            {{ value }}
          </code>
        </template>

        <template #status-cell="{ value }">
          <UBadge :color="getStatusColor(value)" variant="soft" size="sm">
            <UIcon :name="getStatusIcon(value)" class="w-3 h-3 mr-1" />
            {{ value }}
          </UBadge>
        </template>

        <template #lastLogin-cell="{ value }">
          <span :title="formatDate(value)">
            {{ formatTimeAgo(value) }}
          </span>
        </template>
      </DataUtable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataUtable from "~/components/common/DataUtable.vue";

definePageMeta({
  layout: "admin-session",
  middleware: ["auth-guard", "admin-guard"],
});

// Sample data
const users = ref([
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    username: "john.doe",
    email: "john.doe@example.com",
    status: "active",
    role: "admin",
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    username: "jane.smith",
    email: "jane.smith@example.com",
    status: "inactive",
    role: "user",
    lastLogin: "2024-01-10T15:45:00Z",
    createdAt: "2023-02-20T09:15:00Z",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    username: "bob.johnson",
    email: "bob.johnson@example.com",
    status: "pending",
    role: "manager",
    lastLogin: null,
    createdAt: "2024-01-01T12:00:00Z",
  },
  {
    id: 4,
    firstName: "Alice",
    lastName: "Wilson",
    username: "alice.wilson",
    email: "alice.wilson@example.com",
    status: "active",
    role: "user",
    lastLogin: "2024-01-20T08:15:00Z",
    createdAt: "2023-03-10T14:30:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Brown",
    username: "charlie.brown",
    email: "charlie.brown@example.com",
    status: "active",
    role: "manager",
    lastLogin: "2024-01-18T16:45:00Z",
    createdAt: "2023-04-05T11:20:00Z",
  },
]);

// State
const loading = ref(false);
const error = ref<string | null>(null);
const productsLoading = ref(false);

// User table configuration
const userColumns = [
  {
    accessorKey: "id",
    header: "ID",
    cellType: "text",
    sortable: true,
  },
  {
    accessorKey: "firstName",
    header: "Name",
    cellType: "custom", // We'll use custom template
    sortable: true,
  },
  {
    accessorKey: "username",
    header: "Username",
    cellType: "custom",
    sortable: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    cellType: "custom",
    sortable: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cellType: "custom", // Custom template for better styling
    sortable: true,
  },
  {
    accessorKey: "role",
    header: "Role",
    cellType: "text",
    sortable: true,
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cellType: "custom", // Custom template for time ago
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
    key: "status",
    type: "select",
    placeholder: "Filter by status",
    options: [
      { label: "All Status", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
  },
  {
    key: "role",
    type: "select",
    placeholder: "Filter by role",
    options: [
      { label: "All Roles", value: "all" },
      { label: "Admin", value: "admin" },
      { label: "Manager", value: "manager" },
      { label: "User", value: "user" },
    ],
  },
];

// Methods
const generateAvatarUrl = (user: any) => {
  const name = `${user.firstName} ${user.lastName}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
};

const getStatusColor = (status: string) => {
  const colors = {
    active: "success",
    inactive: "error",
    pending: "info",
  };
  return colors[status as keyof typeof colors] || "gray";
};

const getStatusIcon = (status: string) => {
  const icons = {
    active: "i-heroicons-check-circle",
    inactive: "i-heroicons-x-circle",
    pending: "i-heroicons-clock",
  };
  return (
    icons[status as keyof typeof icons] || "i-heroicons-question-mark-circle"
  );
};

const formatDate = (date: string | null) => {
  if (!date) return "Never";
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return "Invalid Date";
  }
};

const formatTimeAgo = (date: string | null) => {
  if (!date) return "Never";
  try {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  } catch {
    return "Invalid Date";
  }
};

const getStockStatusColor = (stock: number) => {
  if (stock === 0) return "bg-red-500";
  if (stock < 10) return "bg-yellow-500";
  return "bg-green-500";
};

const getStockStatus = (stock: number) => {
  if (stock === 0) return "Out of Stock";
  if (stock < 10) return "Low Stock";
  return "In Stock";
};

// Event handlers
const getUserRowActions = (row: any, index: number) => [
  [
    {
      label: "View Details",
      icon: "i-heroicons-eye",
      click: () => console.log("View user:", row),
    },
  ],
  [
    {
      label: "Edit User",
      icon: "i-heroicons-pencil-square",
      click: () => console.log("Edit user:", row),
    },
    {
      label: "Reset Password",
      icon: "i-heroicons-key",
      click: () => console.log("Reset password:", row),
    },
  ],
  [
    {
      label: "Disable User",
      icon: "i-heroicons-no-symbol",
      click: () => console.log("Disable user:", row),
    },
    {
      label: "Delete User",
      icon: "i-heroicons-trash",
      click: () => console.log("Delete user:", row),
    },
  ],
];

const getProductRowActions = (row: any, index: number) => [
  [
    {
      label: "View Details",
      icon: "i-heroicons-eye",
      click: () => console.log("View product:", row),
    },
  ],
  [
    {
      label: "Edit Product",
      icon: "i-heroicons-pencil-square",
      click: () => console.log("Edit product:", row),
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate",
      click: () => console.log("Duplicate product:", row),
    },
  ],
  [
    {
      label: "Archive",
      icon: "i-heroicons-archive-box",
      click: () => console.log("Archive product:", row),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash",
      click: () => console.log("Delete product:", row),
    },
  ],
];

const handleCreateUser = () => {
  console.log("Create user clicked");
};

const handleCreateProduct = () => {
  console.log("Create product clicked");
};

const handleRefreshUsers = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    console.log("Users refreshed");
  }, 1000);
};

const handleRefreshProducts = () => {
  productsLoading.value = true;
  setTimeout(() => {
    productsLoading.value = false;
    console.log("Products refreshed");
  }, 1000);
};

const handleExportUsers = (data: any[]) => {
  console.log("Export users:", data);
  // Implement CSV export logic here
};

const handleExportProducts = (data: any[]) => {
  console.log("Export products:", data);
  // Implement CSV export logic here
};

const handleUserAction = (action: string, row: any, index: number) => {
  console.log("User action:", action, row, index);
};

const handleProductAction = (action: string, row: any, index: number) => {
  console.log("Product action:", action, row, index);
};

const handleSearchChange = (query: string) => {
  console.log("Search changed:", query);
};

const handleFiltersChange = (filters: Record<string, any>) => {
  console.log("Filters changed:", filters);
};

const handleSortChange = (sort: any) => {
  console.log("Sort changed:", sort);
};

const handleItemsPerPageChange = (value: number) => {
  console.log("Items per page changed:", value);
};

const handlePageChange = (page: number) => {
  console.log("Page changed:", page);
};
</script>
