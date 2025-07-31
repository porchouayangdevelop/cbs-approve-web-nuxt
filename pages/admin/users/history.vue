<template>
  <div class="p-6 space-y-6">
    <!-- Basic Usage Example -->
    <div>
      <USelectMenu>

      </USelectMenu>

      <h2 class="text-xl font-semibold mb-4">Basic Usage</h2>
      <UTable
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
        :search-keys="['firstName', 'lastName', 'email', 'username']"
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
        <template #firstName-cell="{ row,column,getValue,renderValue,cell }">
          <div class="flex items-center space-x-3">
            <UAvatar
              :alt="`${row.original.firstName} ${row.original.lastName}`"
              size="sm"
              :src="generateAvatarUrl(row.original)"
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

        <template #username-cell="{ cell }">
          <code class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            {{ cell.id }}
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

        
      </UTable>
    </div>

    <!-- Advanced Usage Example -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Advanced Usage with Selection</h2>
      <UTable
        title="Products Inventory"
        :data="products"
        :columns="productColumns"
        :loading="productsLoading"
        :filters="productFilters"
        :row-actions="getProductRowActions"
        selectable
        :selected-rows="selectedProducts"
        selection-key="id"
        show-export
        :export-config="productExportConfig"
        @update:selectedRows="handleProductSelection"
        @row-click="handleProductClick"
        @row-dblclick="handleProductDoubleClick"
      >
        <!-- Custom header for selection column -->
        <template #selection-header>
          <UCheckbox
            :model-value="isAllSelected"
            :indeterminate="isPartiallySelected"
            @update:model-value="toggleSelectAll"
          />
        </template>

        <!-- Custom selection cell -->
        <template #selection-cell="{ row }">
          <UCheckbox
            :model-value="isRowSelected(row.original)"
            @update:model-value="toggleRowSelection(row.original)"
          />
        </template>

        <!-- Custom price cell with formatting -->
        <template #price-cell="{ value }">
          <span class="font-mono"> ${{ value }} </span>
        </template>

        <!-- Custom stock cell with status indicator -->
        <template #stock-cell="{ value, row }">
          <div class="flex items-center space-x-2">
            <div
              :class="['w-2 h-2 rounded-full', getStockStatusColor(value)]"
            />
            <span>{{ value }}</span>
            <span class="text-xs text-gray-500">
              {{ getStockStatus(value) }}
            </span>
          </div>
        </template>
      </UTable>
    </div>

    <!-- Bulk Actions for Selected Items -->
    <div v-if="selectedProducts.length > 0" class="fixed bottom-4 right-4">
      <UCard class="shadow-lg">
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium">
            {{ selectedProducts.length }} selected
          </span>
          <div class="flex space-x-2">
            <UButton
              size="sm"
              variant="outline"
              icon="i-heroicons-pencil-square"
              @click="handleBulkEdit"
            >
              Edit
            </UButton>
            <UButton
              size="sm"
              variant="outline"
              icon="i-heroicons-archive-box"
              @click="handleBulkArchive"
            >
              Archive
            </UButton>
            <UButton
              size="sm"
              variant="outline"
              color="error"
              icon="i-heroicons-trash"
              @click="handleBulkDelete"
            >
              Delete
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pagination } from "#build/ui";
import type {
  UTableColumn,
  UTableFilter,
  UTableSort,
  UTableExportConfig,
} from "~/types/utable";
import {
  UTableColumnTypes,
  UTableFilterTypes,
  UTableUtils,
} from "~/types/utable";

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
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    username: "bob.johnson",
    email: "bob.johnson@example.com",
    status: "pending",
    role: "manager",
    lastLogin: null,
    createdAt: "2024-01-01T12:00:00Z",
  }, {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    username: "bob.johnson",
    email: "bob.johnson@example.com",
    status: "pending",
    role: "manager",
    lastLogin: null,
    createdAt: "2024-01-01T12:00:00Z",
  }, {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    username: "bob.johnson",
    email: "bob.johnson@example.com",
    status: "pending",
    role: "manager",
    lastLogin: null,
    createdAt: "2024-01-01T12:00:00Z",
  }, {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    username: "bob.johnson",
    email: "bob.johnson@example.com",
    status: "pending",
    role: "manager",
    lastLogin: null,
    createdAt: "2024-01-01T12:00:00Z",
  }, {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    username: "bob.johnson",
    email: "bob.johnson@example.com",
    status: "pending",
    role: "manager",
    lastLogin: null,
    createdAt: "2024-01-01T12:00:00Z",
  }, {
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
]);

const products = ref([
  {
    id: 1,
    name: "Wireless Headphones",
    sku: "WH001",
    price: 99.99,
    stock: 150,
    category: "Electronics",
    status: "active",
  },
  {
    id: 2,
    name: "Smart Watch",
    sku: "SW002",
    price: 299.99,
    stock: 5, // Low stock
    category: "Electronics",
    status: "active",
  },
  {
    id: 3,
    name: "Coffee Maker",
    sku: "CM003",
    price: 149.99,
    stock: 0, // Out of stock
    category: "Appliances",
    status: "inactive",
  },
]);

// State
const loading = ref(false);
const error = ref<string | null>(null);
const productsLoading = ref(false);
const selectedProducts = ref<any[]>([]);

// User table configuration
const userColumns: UTableColumn[] = [
  UTableColumnTypes.index(),
  {
    accessorKey: "firstName",
    header: "Name",
    cellType: "custom", // We'll use custom template
    sortable: true,
  },
  UTableColumnTypes.text("username", "Username"),
  {
    accessorKey: "status",
    header: "Status",
    cellType: "custom", // Custom template for better styling
    sortable: true,
  },
  UTableColumnTypes.text("role", "Role"),
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cellType: "custom", // Custom template for time ago
    sortable: true,
  },
  UTableColumnTypes.actions(),
];

const userFilters: UTableFilter[] = [
  UTableFilterTypes.status("status", ["active", "inactive", "pending"]),
  UTableFilterTypes.role("role", ["admin", "manager", "user"]),
];

// Product table configuration
const productColumns: UTableColumn[] = [
  {
    accessorKey: "selection",
    header: "",
    cellType: "custom",
    sortable: false,
    width: "50px",
  },
  UTableColumnTypes.text("name", "Product Name"),
  UTableColumnTypes.text("sku", "SKU"),
  {
    accessorKey: "price",
    header: "Price",
    cellType: "custom",
    sortable: true,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cellType: "custom",
    sortable: true,
  },
  UTableColumnTypes.text("category", "Category"),
  UTableColumnTypes.status("status", "Status"),
  UTableColumnTypes.actions(),
];

const productFilters: UTableFilter[] = [
  {
    key: "category",
    type: "select",
    placeholder: "Filter by category",
    options: [
      { label: "All Categories", value: "" },
      { label: "Electronics", value: "Electronics" },
      { label: "Appliances", value: "Appliances" },
    ],
  },
  UTableFilterTypes.status("status"),
];

const productExportConfig: UTableExportConfig = {
  format: "csv",
  filename: "products-export.csv",
  columns: ["name", "sku", "price", "stock", "category", "status"],
};

// Computed properties for selection
const isAllSelected = computed(() => {
  return (
    products.value.length > 0 &&
    selectedProducts.value.length === products.value.length
  );
});

const isPartiallySelected = computed(() => {
  return (
    selectedProducts.value.length > 0 &&
    selectedProducts.value.length < products.value.length
  );
});

// Methods
const generateAvatarUrl = (user: any) => {
  return UTableUtils.generateAvatarUrl(`${user.firstName} ${user.lastName}`);
};

const getStatusColor = (status: string) => {
  const colors = {
    active: "green",
    inactive: "red",
    pending: "yellow",
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
  return UTableUtils.formatDate(date || new Date());
};

const formatTimeAgo = (date: string | null) => {
  return UTableUtils.formatTimeAgo(date || new Date());
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

const isRowSelected = (row: any) => {
  return selectedProducts.value.some((p) => p.id === row.id);
};

const toggleRowSelection = (row: any) => {
  const index = selectedProducts.value.findIndex((p) => p.id === row.id);
  if (index > -1) {
    selectedProducts.value.splice(index, 1);
  } else {
    selectedProducts.value.push(row);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedProducts.value = [];
  } else {
    selectedProducts.value = [...products.value];
  }
};

// Event handlers
const getUserRowActions = UTableUtils.defaultRowActions(
  (row) => console.log("View user:", row),
  (row) => console.log("Edit user:", row),
  (row) => console.log("Delete user:", row)
);

const getProductRowActions = (row: any, index: number) => [
  [
    {
      label: "View Details",
      icon: "i-heroicons-eye",
      click: () => handleProductView(row),
    },
  ],
  [
    {
      label: "Edit Product",
      icon: "i-heroicons-pencil-square",
      click: () => handleProductEdit(row),
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate",
      click: () => handleProductDuplicate(row),
    },
  ],
  [
    {
      label: "Archive",
      icon: "i-heroicons-archive-box",
      click: () => handleProductArchive(row),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash",
      click: () => handleProductDelete(row),
    },
  ],
];

const handleCreateUser = () => {
  console.log("Create user clicked");
};

const handleRefreshUsers = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    console.log("Users refreshed");
  }, 1000);
};

const handleExportUsers = (data: any[]) => {
  UTableUtils.exportAsCSV(data, "users-export.csv");
};

const handleUserAction = (action: string, row: any, index: number) => {
  console.log("User action:", action, row, index);
};

const handleSearchChange = (query: string) => {
  console.log("Search changed:", query);
};

const handleFiltersChange = (filters: Record<string, any>) => {
  console.log("Filters changed:", filters);
};

const handleSortChange = (sort: UTableSort | null) => {
  console.log("Sort changed:", sort);
};

const handleItemsPerPageChange = (value: number) => {
  console.log("Items per page changed:", value);
};

const handlePageChange = (page: number) => {
  console.log("Page changed:", page);
};

const handleProductSelection = (rows: any[]) => {
  selectedProducts.value = rows;
};

const handleProductClick = (row: any, index: number) => {
  console.log("Product clicked:", row);
};

const handleProductDoubleClick = (row: any, index: number) => {
  console.log("Product double clicked:", row);
  handleProductView(row);
};

const handleProductView = (product: any) => {
  console.log("View product:", product);
};

const handleProductEdit = (product: any) => {
  console.log("Edit product:", product);
};

const handleProductDuplicate = (product: any) => {
  console.log("Duplicate product:", product);
};

const handleProductArchive = (product: any) => {
  console.log("Archive product:", product);
};

const handleProductDelete = (product: any) => {
  console.log("Delete product:", product);
};

const handleBulkEdit = () => {
  console.log("Bulk edit:", selectedProducts.value);
};

const handleBulkArchive = () => {
  console.log("Bulk archive:", selectedProducts.value);
};

const handleBulkDelete = () => {
  console.log("Bulk delete:", selectedProducts.value);
};
</script>
